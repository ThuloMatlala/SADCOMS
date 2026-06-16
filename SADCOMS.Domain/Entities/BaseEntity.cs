namespace SADCOMS.Domain.Entities;

public abstract class BaseEntity
{
  public Guid Id { get; set; }
  public DateTimeOffset CreatedAt { get; set; }
}
