using Microsoft.EntityFrameworkCore;
using SADCOMS.Domain.Entities;

namespace SADCOMS.API.Data;

public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
  {

  }

  public DbSet<Customer> Customers { get; set; }
  public DbSet<Order> Orders { get; set; }
  public DbSet<OrderLineItem> OrderLineItems { get; set; }
}