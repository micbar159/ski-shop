using System;
using SkiShop.Core.Entities;

namespace SkiShop.Core.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity;
    Task<bool> Complete();
}
