using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SkiShop.Infrastructure.Options;

namespace SkiShop.Infrastructure
{
    public static class Extensions
    {        
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration) 
        {            
            return services.Configure<StripeOptions>(configuration.GetSection(StripeOptions.SectionName));
        }
    }
}
