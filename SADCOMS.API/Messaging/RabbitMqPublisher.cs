using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using SADCOMS.Domain.Events;

namespace SADCOMS.API.Messaging;

public class RabbitMqPublisher : IDisposable
{
    private readonly IConnection _connection;
    private readonly IModel _channel;
    private const string ExchangeName = "sadcoms";
    private const string RoutingKey = "order.created";

    public RabbitMqPublisher()
    {
        var factory = new ConnectionFactory { HostName = "localhost" };
        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();

        _channel.ExchangeDeclare(ExchangeName, ExchangeType.Direct, durable: true);
    }

    public void PublishOrderCreated(OrderCreatedEvent orderEvent)
    {
        var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(orderEvent));

        var properties = _channel.CreateBasicProperties();
        properties.DeliveryMode = 2; // persistent

        _channel.BasicPublish(
            exchange: ExchangeName,
            routingKey: RoutingKey,
            basicProperties: properties,
            body: body);
    }

    public void Dispose()
    {
        _channel?.Dispose();
        _connection?.Dispose();
    }
}