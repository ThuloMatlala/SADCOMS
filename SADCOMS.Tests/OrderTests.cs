using SADCOMS.Domain.Entities;
using SADCOMS.Domain.Enums;

public class OrderTests
{
  [Fact]
  public void UpdateStatus_ValidTransition_UpdatesStatus()
  {
    // Arrange - create an order in Pending state
    var order = new Order
    {
      CurrencyCode = "ZAR",
      Status = OrderStatus.Pending
    };

    // Act - call the method we're testing
    order.UpdateStatus(OrderStatus.Paid);

    // Assert - verify the status changed
    Assert.Equal(OrderStatus.Paid, order.Status);
  }

  [Fact]
  public void UpdateStatus_InvalidTransition_ThrowsInvalidOperationException()
  {
    // Arrange

    // Act

    // Assert
  }

  [Fact]
  public void UpdateStatus_FromFulfilled_ShouldDoNothing()
  {
    // Arrange

    // Act

    // Assert
  }
}