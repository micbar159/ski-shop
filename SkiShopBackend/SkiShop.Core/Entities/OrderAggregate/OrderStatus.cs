using System.Runtime.Serialization;

namespace SkiShop.Core.Entities.OrderAggregate;

public enum OrderStatus
{
    Pending,
    PaymentReceived,
    PaymentFailed,
    PaymentMismatch,
    Refunded
}