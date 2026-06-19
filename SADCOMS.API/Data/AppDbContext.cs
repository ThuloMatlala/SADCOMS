using Microsoft.EntityFrameworkCore;
using SADCOMS.Domain.Entities;

namespace SADCOMS.API.Data;

public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
  {

  }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<Order>()
        .Property(o => o.TotalAmount)
        .HasPrecision(18, 2);

    modelBuilder.Entity<OrderLineItem>()
        .Property(oli => oli.UnitPrice)
        .HasPrecision(18, 2);
  }


  public DbSet<Customer> Customers { get; set; }
  public DbSet<Order> Orders { get; set; }
  public DbSet<OrderLineItem> OrderLineItems { get; set; }
  public DbSet<OutboxMessage> OutboxMessages { get; set; }
}