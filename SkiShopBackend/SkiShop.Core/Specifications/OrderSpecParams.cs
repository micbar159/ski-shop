using System;

namespace SkiShop.Core.Specifications;

public class OrderSpecParams : PagingParams
{
    public string? Status { get; set; }
}
