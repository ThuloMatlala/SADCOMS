using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;

public class ApiAuthTests : IClassFixture<WebApplicationFactory<Program>>
{
  private readonly HttpClient _client;

  public ApiAuthTests(WebApplicationFactory<Program> factory)
  {
    _client = factory.CreateClient();
  }

  [Fact]
  public async Task GetCustomers_WithoutToken_Returns401()
  {
    var response = await _client.GetAsync("/api/customers");
    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
  }

  [Fact]
  public async Task GetOrders_WithoutToken_Returns401()
  {
    var response = await _client.GetAsync("/api/orders");
    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
  }
}