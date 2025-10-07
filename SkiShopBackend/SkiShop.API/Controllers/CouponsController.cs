using System;
using Microsoft.AspNetCore.Mvc;
using SkiShop.Core.Entities;
using SkiShop.Core.Interfaces;

namespace SkiShop.API.Controllers;

public class CouponsController(ICouponService couponService) : BaseApiController
{
    [HttpGet("{code}")]
    public async Task<ActionResult<AppCoupon>> ValidateCoupon(string code)
    {
        var coupon = await couponService.GetCouponFromPromoCode(code);

        if (coupon == null) return BadRequest("Invalid voucher code");

        return coupon;
    }
}