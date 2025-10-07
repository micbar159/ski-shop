using System;
using SkiShop.Core.Entities;

namespace SkiShop.Core.Specifications;

public class TypeListSpecification : BaseSpecification<Product, string>
{
    public TypeListSpecification()
    {
        AddSelect(x => x.Type);
        ApplyDistinct();
    }
}