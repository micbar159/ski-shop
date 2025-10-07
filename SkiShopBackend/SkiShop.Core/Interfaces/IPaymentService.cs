using System;
using SkiShop.Core.Entities;

namespace SkiShop.Core.Interfaces;

public interface IPaymentService
{
    Task<ShoppingCart?> CreateOrUpdatePaymentIntent(string cartId);
    Task<string> RefundPayment(string paymentIntentId);
}
