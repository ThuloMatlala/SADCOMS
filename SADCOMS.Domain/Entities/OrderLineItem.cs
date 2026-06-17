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
  [Range(0, int.MaxValue, ErrorMessage = "Unit Price must be at least 0.")]
  public decimal UnitPrice { get; set; }
}