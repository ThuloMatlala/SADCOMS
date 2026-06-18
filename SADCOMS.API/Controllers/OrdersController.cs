using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SADCOMS.API.Data;
using SADCOMS.API.DTOs;
using SADCOMS.Domain.Entities;
using SADCOMS.Domain.Validation;
using SADCOMS.Domain.Enums;
using SADCOMS.Domain.Events;
using SADCOMS.API.Messaging;

namespace SADCOMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
  private const int MaxPageSize = 100;

  private readonly AppDbContext _context;
  private readonly RabbitMqPublisher _rabbitMqPublisher;

  public OrdersController(AppDbContext context, RabbitMqPublisher rabbitMqPublisher)
  {
    _context = context;
    _rabbitMqPublisher = rabbitMqPublisher;
  }

  [HttpPost]
  public async Task<ActionResult<OrderResponse>> CreateOrder(CreateOrderRequest request, CancellationToken cancellationToken)
  {
    var customer = await _context.Customers.FindAsync(new object[] { request.CustomerId }, cancellationToken);
    if (customer is null)
    {
      return BadRequest($"Customer '{request.CustomerId}' was not found.");
    }

    if (!SadcCurrencyValidator.IsValid(
      customer.CountryCode.ToUpperInvariant(),
      request.CurrencyCode.Trim().ToUpperInvariant()))
    {
      return BadRequest($"Currency '{request.CurrencyCode}' is not valid for country '{customer.CountryCode}'.");
    }

    var order = new Order
    {
      CustomerId = customer.Id,
      Customer = customer,
      Status = OrderStatus.Pending,
      CurrencyCode = request.CurrencyCode.Trim().ToUpperInvariant(),
      CreatedAt = DateTimeOffset.UtcNow,
    };

    order.LineItems = request.LineItems.Select(li => new OrderLineItem
    {
      Order = order,
      ProductSku = li.ProductSku.Trim(),
      Quantity = li.Quantity,
      UnitPrice = li.UnitPrice,
    }).ToList();

    order.RecalculateTotalAmount();

    _context.Orders.Add(order);
    await _context.SaveChangesAsync(cancellationToken);

    var orderEvent = new OrderCreatedEvent
    (
      order.Id,
      customer.Id,
      order.TotalAmount,
      order.CurrencyCode,
      DateTimeOffset.UtcNow
    );

    _rabbitMqPublisher.PublishOrderCreated(orderEvent);

    var response = OrderResponse.FromEntity(order);
    return CreatedAtAction(nameof(GetById), new { id = order.Id }, response);
  }

  [HttpGet("{id:guid}")]
  public async Task<ActionResult<OrderResponse>> GetById(Guid id, CancellationToken cancellationToken)
  {
    var order = await _context.Orders
        .Include(o => o.LineItems)
        .AsNoTracking()
        .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

    if (order is null)
    {
      return NotFound();
    }

    return Ok(OrderResponse.FromEntity(order));
  }

  [HttpPut("{id:guid}/status")]
  public async Task<ActionResult<OrderResponse>> UpdateStatus(
    Guid id,
    UpdateOrderStatusRequest request,
    [FromHeader(Name = "Idempotency-Key")] string? idempotencyKey,
    CancellationToken cancellationToken)
  {
    var order = await _context.Orders
        .Include(o => o.LineItems)
        .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

    if (order is null)
    {
      return NotFound();
    }

    try
    {
      order.UpdateStatus(request.Status);
    }
    catch (InvalidOperationException ex)
    {
      return Conflict(ex.Message);
    }

    await _context.SaveChangesAsync(cancellationToken);

    return Ok(OrderResponse.FromEntity(order));
  }

  [HttpGet]
  public async Task<ActionResult<PagedResult<OrderResponse>>> GetAll(
      [FromQuery] Guid? customerId,
      [FromQuery] OrderStatus? status,
      [FromQuery] int page = 1,
      [FromQuery] int pageSize = 20,
      [FromQuery] string? sort = null,
      CancellationToken cancellationToken = default)
  {
    page = Math.Max(page, 1);
    pageSize = Math.Clamp(pageSize, 1, MaxPageSize);

    var query = _context.Orders.AsNoTracking();

    if (customerId.HasValue)
    {
      query = query.Where(o => o.CustomerId == customerId.Value);
    }

    if (status.HasValue)
    {
      query = query.Where(o => o.Status == status.Value);
    }

    query = sort switch
    {
      "createdAt" => query.OrderBy(o => o.CreatedAt),
      "-createdAt" => query.OrderByDescending(o => o.CreatedAt),
      "totalAmount" => query.OrderBy(o => o.TotalAmount),
      "-totalAmount" => query.OrderByDescending(o => o.TotalAmount),
      _ => query.OrderByDescending(o => o.CreatedAt),
    };

    var totalCount = await query.CountAsync(cancellationToken);

    var orders = await query
        .Include(o => o.LineItems)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync(cancellationToken);

    var items = orders.Select(OrderResponse.FromEntity).ToList();

    return Ok(new PagedResult<OrderResponse>(items, totalCount, page, pageSize));
  }
}
