using SADCOMS.Domain.Entities;
using SADCOMS.Domain.Enums;
using SADCOMS.Domain.Validation;

public class OrderTests
{
  [Fact]
  public void UpdateStatus_FromPendingToPaid_UpdatesStatus()
  {
    // Arrange
    var order = new Order
    {
      CurrencyCode = "ZAR",
      Status = OrderStatus.Pending
    };

    // Act
    order.UpdateStatus(OrderStatus.Paid);

    // Assert
    Assert.Equal(OrderStatus.Paid, order.Status);
  }

  [Fact]
  public void UpdateStatus_InvalidTransition_ThrowsInvalidOperationException()
  {
    var order = new Order
    {
      CurrencyCode = "ZAR",
      Status = OrderStatus.Pending
    };

    // Act & Assert
    Assert.Throws<InvalidOperationException>(() =>
    {
      order.UpdateStatus(OrderStatus.Fulfilled);
    });
  }

  [Fact]
  public void UpdateStatus_FromFulfilled_ThrowsInvalidOperationException()
  {
    var order = new Order
    {
      CurrencyCode = "ZAR",
      Status = OrderStatus.Fulfilled
    };

    // Act & Assert
    Assert.Throws<InvalidOperationException>(() =>
    {
      order.UpdateStatus(OrderStatus.Fulfilled);
    });
  }


  [Fact]
  public void RecalculateTotalAmount_OrderTotal_SetsOrderToTheCorrectAmount()
  {
    var order = new Order
    {
      CurrencyCode = "ZAR",
      Status = OrderStatus.Fulfilled,
    };

    var lineItem1 = new OrderLineItem
    {
      Order = order,
      ProductSku = "SKU-001",
      Quantity = 2,
      UnitPrice = 49.99m,
    };

    var lineItem2 = new OrderLineItem
    {
      Order = order,
      ProductSku = "SKU-002",
      Quantity = 1,
      UnitPrice = 99.99m,
    };

    order.LineItems.Add(lineItem1);
    order.LineItems.Add(lineItem2);

    order.RecalculateTotalAmount();

    var expectedTotalAmount = 199.97m;
    // Act & Assert
    Assert.Equal(expectedTotalAmount, order.TotalAmount);
  }

  [Fact]
  public void ValidateCurrency_InvalidPairing_ReturnsFalse()
  {
    var countryCode = "ZA";
    var currencyCode = "KMF";

    // Act
    var isValid = SadcCurrencyValidator.IsValid(countryCode, currencyCode);

    // Assert
    Assert.False(isValid);
  }

  [Fact]
  public void ValidateCurrency_ValidPairing_ReturnsTrue()
  {
    var countryCode = "ZA";
    var currencyCode = "ZAR";

    // Act
    var isValid = SadcCurrencyValidator.IsValid(countryCode, currencyCode);

    // Assert
    Assert.True(isValid);
  }
}