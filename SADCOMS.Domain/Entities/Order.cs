using System.ComponentModel.DataAnnotations;
using SADCOMS.Domain.Enums;

namespace SADCOMS.Domain.Entities;

public class Order : BaseEntity
{
  public Guid CustomerId { get; set; }
  public required Customer Customer { get; set; }
  public OrderStatus Status { get; set; }
  public required string CurrencyCode { get; set; }
  public decimal TotalAmount { get; set; }
  [Timestamp]
  public required byte[] RowVersion { get; set; }
  public ICollection<OrderLineItem> LineItems { get; set; } = new List<OrderLineItem>();
}