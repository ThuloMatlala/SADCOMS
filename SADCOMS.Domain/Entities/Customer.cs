namespace SADCOMS.Domain.Entities;

public class Customer : BaseEntity
{
  public required string Name {get; set;}
  public required string Email {get; set;}
  public required string CountryCode {get; set;}
}