using System.ComponentModel.DataAnnotations;
using SADCOMS.Domain.Enums;

namespace SADCOMS.Domain.Entities;

public class Order
{
  public Guid Id { get; set; }
  public DateTimeOffset CreatedAt { get; set; }
  public Guid CustomerId { get; set; }
  public Customer Customer { get; set; }
  public OrderStatus Status { get; set; }
  public string CurrencyCode { get; set; }
  public decimal TotalAmount { get; set; }
  [Timestamp]
  public byte[] RowVersion { get; set; }
  public ICollection<OrderLineItem> LineItems { get; set; } = new List<OrderLineItem>();
}