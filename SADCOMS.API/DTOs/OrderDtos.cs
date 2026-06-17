using System.ComponentModel.DataAnnotations;
using SADCOMS.Domain.Entities;
using SADCOMS.Domain.Enums;

namespace SADCOMS.API.DTOs;

public record CreateOrderLineItemRequest
{
  [Required, StringLength(64, MinimumLength = 1)]
  public required string ProductSku { get; init; }

  [Range(1, int.MaxValue)]
  public required int Quantity { get; init; }

  [Range(0, double.MaxValue)]
  public required decimal UnitPrice { get; init; }
}

public record CreateOrderRequest
{
  public required Guid CustomerId { get; init; }

  [Required, StringLength(3, MinimumLength = 3)]
  public required string CurrencyCode { get; init; }

  [Required, MinLength(1)]
  public required List<CreateOrderLineItemRequest> LineItems { get; init; }
}

public record OrderLineItemResponse(Guid Id, string ProductSku, int Quantity, decimal UnitPrice)
{
  public static OrderLineItemResponse FromEntity(OrderLineItem lineItem) =>
      new(lineItem.Id, lineItem.ProductSku, lineItem.Quantity, lineItem.UnitPrice);
}

public record UpdateOrderStatusRequest
{
  public required OrderStatus Status { get; init; }
}

public record OrderResponse(
    Guid Id,
    Guid CustomerId,
    OrderStatus Status,
    string CurrencyCode,
    decimal TotalAmount,
    DateTimeOffset CreatedAt,
    IReadOnlyList<OrderLineItemResponse> LineItems)
{
  public static OrderResponse FromEntity(Order order) =>
      new(order.Id, order.CustomerId, order.Status, order.CurrencyCode, order.TotalAmount, order.CreatedAt,
          order.LineItems.Select(OrderLineItemResponse.FromEntity).ToList());
}
