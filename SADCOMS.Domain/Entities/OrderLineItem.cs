using System.ComponentModel.DataAnnotations;

namespace SADCOMS.Domain.Entities;

public class OrderLineItem
{
  public Guid Id { get; set; }
  public Guid OrderId { get; set; }
  public required Order Order { get; set; }
  public required string ProductSku { get; set; }
  [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0.")]
  public required int Quantity { get; set; }
  public decimal UnitPrice { get; set; }
}