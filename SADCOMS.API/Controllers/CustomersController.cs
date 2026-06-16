using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SADCOMS.API.Data;
using SADCOMS.API.DTOs;
using SADCOMS.Domain.Entities;

namespace SADCOMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
  private const int MaxPageSize = 100;

  private readonly AppDbContext _context;

  public CustomersController(AppDbContext context)
  {
    _context = context;
  }

  [HttpPost]
  public async Task<ActionResult<CustomerResponse>> Create(CreateCustomerRequest request, CancellationToken cancellationToken)
  {
    var customer = new Customer
    {
      Name = request.Name.Trim(),
      Email = request.Email.Trim(),
      CountryCode = request.CountryCode.Trim().ToUpperInvariant(),
      CreatedAt = DateTimeOffset.UtcNow,
    };

    _context.Customers.Add(customer);
    await _context.SaveChangesAsync(cancellationToken);

    var response = CustomerResponse.FromEntity(customer);
    return CreatedAtAction(nameof(GetById), new { id = customer.Id }, response);
  }

  [HttpGet("{id:guid}")]
  public async Task<ActionResult<CustomerResponse>> GetById(Guid id, CancellationToken cancellationToken)
  {
    var customer = await _context.Customers.FindAsync(new object[] { id }, cancellationToken);
    if (customer is null)
    {
      return NotFound();
    }

    return Ok(CustomerResponse.FromEntity(customer));
  }

  [HttpGet]
  public async Task<ActionResult<PagedResult<CustomerResponse>>> GetAll(
      [FromQuery] string? search,
      [FromQuery] int page = 1,
      [FromQuery] int pageSize = 20,
      CancellationToken cancellationToken = default)
  {
    page = Math.Max(page, 1);
    pageSize = Math.Clamp(pageSize, 1, MaxPageSize);

    var query = _context.Customers.AsNoTracking();

    if (!string.IsNullOrWhiteSpace(search))
    {
      var term = search.Trim();
      query = query.Where(c => c.Name.Contains(term) || c.Email.Contains(term));
    }

    var totalCount = await query.CountAsync(cancellationToken);

    var items = await query
        .OrderBy(c => c.Name)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .Select(c => new CustomerResponse(c.Id, c.Name, c.Email, c.CountryCode, c.CreatedAt))
        .ToListAsync(cancellationToken);

    return Ok(new PagedResult<CustomerResponse>(items, totalCount, page, pageSize));
  }


}
