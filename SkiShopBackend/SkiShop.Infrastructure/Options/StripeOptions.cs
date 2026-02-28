

namespace SkiShop.Infrastructure.Options
{
    public class StripeOptions
    {
        public const string SectionName = "Stripe";
        public string PublishableKey { get; set; }
        public string SecretKey { get; set; }
    }
}
