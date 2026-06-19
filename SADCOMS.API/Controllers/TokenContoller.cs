using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace SADCOMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TokenController : ControllerBase
{
  private readonly IConfiguration _config;
  private readonly IWebHostEnvironment _env;

  public TokenController(IConfiguration config, IWebHostEnvironment env)
  {
    _config = config;
    _env = env;
  }

  [HttpGet]
  public IActionResult GetDevToken()
  {
    if (!_env.IsDevelopment())
      return NotFound();

    var secret = _config["Jwt:DevSecret"];
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret!));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        audience: _config["Jwt:Audience"],
        claims: new[] { new Claim("sub", "dev-user") },
        expires: DateTime.UtcNow.AddHours(8),
        signingCredentials: creds
    );

    return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
  }
}