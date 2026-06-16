using System.ComponentModel.DataAnnotations;
using SADCOMS.Domain.Enums;

namespace SADCOMS.Domain.Entities;

public class Order : BaseEntity
{
  public Guid CustomerId { get; set; }
  public Customer Customer { get; set; }
  public OrderStatus Status { get; set; }
  public required string CurrencyCode { get; set; }
  public decimal TotalAmount { get; set; }
  [Timestamp]
  public byte[] RowVersion { get; set; }
  public ICollection<OrderLineItem> LineItems { get; set; } = new List<OrderLineItem>();

  public void RecalculateTotalAmount()
  {
    TotalAmount = LineItems.Sum(li => li.Quantity * li.UnitPrice);
  }

  private static readonly Dictionary<OrderStatus, OrderStatus[]> _validTransitions = new()
{
    { OrderStatus.Pending,   new[] { OrderStatus.Paid, OrderStatus.Cancelled } },
    { OrderStatus.Paid,      new[] { OrderStatus.Fulfilled, OrderStatus.Cancelled } },
    { OrderStatus.Fulfilled, Array.Empty<OrderStatus>() },
    { OrderStatus.Cancelled, Array.Empty<OrderStatus>() },
};

  public void UpdateStatus(OrderStatus newStatus)
  {
    var allowed = _validTransitions[Status];
    if (!allowed.Contains(newStatus))
    {
      throw new InvalidOperationException(
          $"Cannot transition from {Status} to {newStatus}.");
    }
    Status = newStatus;
  }
}
