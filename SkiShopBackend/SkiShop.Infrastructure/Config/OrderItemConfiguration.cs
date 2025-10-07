using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkiShop.Core.Entities.OrderAggregate;

namespace SkiShop.Infrastructure.Config;

public class OrderItemConfig : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.OwnsOne(x => x.ItemOrdered, i => i.WithOwner());
        builder.Property(x => x.Price).HasColumnType("decimal(18,2)");
    }
}