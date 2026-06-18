namespace SADCOMS.Domain.Events;

public record OrderCreatedEvent(
    Guid OrderId,
    Guid CustomerId,
    decimal TotalAmount,
    string CurrencyCode,
    DateTimeOffset CreatedAt
);