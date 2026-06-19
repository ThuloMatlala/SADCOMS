namespace SADCOMS.Domain.Entities;

public class OutboxMessage : BaseEntity
{
  public required string EventType { get; set; }
  public required string Payload{ get; set; }
  public DateTimeOffset? ProcessedAt {get; set;}
}