namespace SADCOMS.Domain.Entities;

public class OrderLineItem
{
  public Guid Id { get; set; }
  public Guid OrderId { get; set; }
  public Order Order { get; set; }
  public string ProductSku { get; set; }
  public int Quantity { get; set; }
  public decimal UnitPrice { get; set; }
}