using SADCOMS.Worker.Messaging;

namespace SADCOMS.Worker;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly RabbitMqConsumer _rabbitMqConsumer;

    public Worker(ILogger<Worker> logger, RabbitMqConsumer rabbitMqConsumer)
    {
        _logger = logger;
        _rabbitMqConsumer = rabbitMqConsumer;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _rabbitMqConsumer.StartConsuming();
        while (!stoppingToken.IsCancellationRequested)
        {
            if (_logger.IsEnabled(LogLevel.Information))
            {
                _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
            }
            await Task.Delay(1000, stoppingToken);
        }
    }
}
