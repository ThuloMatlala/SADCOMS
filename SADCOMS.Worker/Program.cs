using SADCOMS.Worker;
using SADCOMS.Worker.Messaging;

var builder = Host.CreateApplicationBuilder(args);
builder.Services.AddHostedService<Worker>();
builder.Services.AddSingleton<RabbitMqConsumer>();

var host = builder.Build();
host.Run();
