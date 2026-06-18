using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using SADCOMS.Domain.Events;

namespace SADCOMS.Worker.Messaging;

public class RabbitMqConsumer : IDisposable
{
    private readonly IConnection _connection;
    private readonly IModel _channel;
    private readonly ILogger<RabbitMqConsumer> _logger;
    private const string ExchangeName = "sadcoms";
    private const string RoutingKey = "order.created";

    public RabbitMqConsumer(ILogger<RabbitMqConsumer> logger)
    {
        _logger = logger;
        var factory = new ConnectionFactory { HostName = "localhost" };
        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();

        _channel.ExchangeDeclare(ExchangeName, ExchangeType.Direct, durable: true);
    }

    public void StartConsuming()
    {
        var queueName = "order.created.queue";

        _channel.QueueDeclare(queueName, durable: true, exclusive: false, autoDelete: false);
        _channel.QueueBind(queueName, ExchangeName, RoutingKey);

        var consumer = new EventingBasicConsumer(_channel);
        consumer.Received += (model, ea) =>
        {
            Task.Run(async () =>
            {
                try
                {
                    var body = ea.Body.ToArray();
                    var orderEvent = JsonSerializer.Deserialize<OrderCreatedEvent>(
                        Encoding.UTF8.GetString(body));

                    if (orderEvent is null) throw new InvalidOperationException("Null event");

                    _logger.LogInformation("[Fulfillment] Order received: OrderId={OrderId}", orderEvent.OrderId);

                    await Task.Delay(500);
                    _logger.LogInformation("[Fulfillment] Checking inventory for order {OrderId}", orderEvent.OrderId);

                    await Task.Delay(800);
                    _logger.LogInformation("[Fulfillment] Allocating stock...");

                    await Task.Delay(600);
                    _logger.LogInformation("[Fulfillment] Fulfillment complete for order {OrderId}", orderEvent.OrderId);

                    _channel.BasicAck(ea.DeliveryTag, multiple: false);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to process message");
                    _channel.BasicNack(ea.DeliveryTag, multiple: false, requeue: false);
                }
            });
        };

        _channel.BasicConsume(queueName, autoAck: false, consumer: consumer);
    }

    public void Dispose()
    {
        _channel?.Dispose();
        _connection?.Dispose();
    }
}