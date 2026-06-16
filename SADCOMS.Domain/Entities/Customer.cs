namespace SADCOMS.Domain.Entities;

public class Customer
{
  public Guid Id {get; set;}
  public required string Name {get; set;}
  public required string Email {get; set;}
  public required string CountryCode {get; set;}
  public DateTimeOffset CreatedAt {get; set;}
}