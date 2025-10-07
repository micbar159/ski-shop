using System;
using Microsoft.AspNetCore.Mvc;
using SkiShop.Core.Entities;
using SkiShop.Core.Interfaces;

namespace SkiShop.API.Controllers;

public class CartController(ICartService cartService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ShoppingCart>> GetCartById(string id)
    {
        var cart = await cartService.GetCartAsync(id);

        return Ok(cart ?? new ShoppingCart{Id = id});
    }
    
    [HttpPost]
    public async Task<ActionResult<ShoppingCart>> UpdateCart(ShoppingCart cart)
    {
        var updatedCart = await cartService.SetCartAsync(cart);

        return Ok(updatedCart);
    }
    
    [HttpDelete]
    public async Task DeleteCart(string id)
    {
        await cartService.DeleteCartAsync(id);
    }
}