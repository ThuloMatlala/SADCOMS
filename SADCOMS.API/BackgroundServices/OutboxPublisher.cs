
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using SADCOMS.API.Data;
using SADCOMS.API.Messaging;
using SADCOMS.Domain.Events;

public class OutboxPublisher : BackgroundService
{
  private readonly IServiceScopeFactory _scopeFactory;
  private readonly RabbitMqPublisher _rabbitMqPublisherpublisher;
  private readonly ILogger<OutboxPublisher> _logger;

  public OutboxPublisher(IServiceScopeFactory scopeFactory, RabbitMqPublisher rabbitMqPublisherpublisher, ILogger<OutboxPublisher> logger)
  {
    _scopeFactory = scopeFactory;
    _rabbitMqPublisherpublisher = rabbitMqPublisherpublisher;
    _logger = logger;
  }

  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    while (!stoppingToken.IsCancellationRequested)
    {
      await ProcessOutboxMessages();
      await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
    }
  }

  private async Task ProcessOutboxMessages()
  {
    using var scope = _scopeFactory.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    var messages = await db.OutboxMessages
      .Where(m => m.ProcessedAt == null)
      .ToListAsync();

    foreach (var message in messages)
    {
      try
      {
        if (message.EventType == nameof(OrderCreatedEvent))
        {
          var orderEvent = JsonSerializer.Deserialize<OrderCreatedEvent>(message.Payload);
          if (orderEvent is not null)
            _rabbitMqPublisherpublisher.PublishOrderCreated(orderEvent);
        }
        else
        {
          _logger.LogWarning("Unknown outbox event type: {EventType}", message.EventType);
        }

        message.ProcessedAt = DateTimeOffset.UtcNow;
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Failed to process outbox message {MessageId}", message.Id);
      }
    }

    await db.SaveChangesAsync();
  }
}