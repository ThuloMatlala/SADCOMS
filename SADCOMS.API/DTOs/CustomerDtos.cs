using System.ComponentModel.DataAnnotations;
using SADCOMS.Domain.Entities;

namespace SADCOMS.API.DTOs;

public record CreateCustomerRequest
{
  [Required, StringLength(200, MinimumLength = 1)]
  public required string Name { get; init; }

  [Required, EmailAddress, StringLength(256)]
  public required string Email { get; init; }

  [Required, StringLength(2, MinimumLength = 2)]
  public required string CountryCode { get; init; }
}

public record CustomerResponse(Guid Id, string Name, string Email, string CountryCode, DateTimeOffset CreatedAt)
{
  public static CustomerResponse FromEntity(Customer customer) =>
      new(customer.Id, customer.Name, customer.Email, customer.CountryCode, customer.CreatedAt);
}


public record PagedResult<T>(IReadOnlyList<T> Items, int TotalCount, int Page, int PageSize);
