using Microsoft.Extensions.Configuration;
using SkiShop.Core.Entities;
using SkiShop.Core.Interfaces;
using Stripe;

namespace SkiShop.Infrastructure.Services;

public class CouponService : ICouponService
{
    public CouponService(IConfiguration config)
    {
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];
    }
    
    public async Task<AppCoupon?> GetCouponFromPromoCode(string code)
    {
        var promotionService = new PromotionCodeService();

        var options = new PromotionCodeListOptions
        {
            Code = code
        };

        var promotionCodes = await promotionService.ListAsync(options);

        var promotionCode = promotionCodes.FirstOrDefault();

        if (promotionCode?.Promotion?.Coupon != null)
        {
            return new AppCoupon
            {
                Name = promotionCode.Promotion.Coupon.Name,
                AmountOff = promotionCode.Promotion.Coupon.AmountOff,
                PercentOff = promotionCode.Promotion.Coupon.PercentOff,
                CouponId = promotionCode.Promotion.Coupon.Id,
                PromotionCode = promotionCode.Code
            };
        }

        return null;
    }
}
