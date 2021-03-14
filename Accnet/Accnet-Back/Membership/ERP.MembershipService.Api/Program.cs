using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using System;
using System.Net;

namespace ERP.MembershipService.Api
{
    public class Program
    {
        static string Ip { get; set; }
        static int Port { get; set; }
        public static void Main(string[] args)
        {
            var config = new ConfigurationBuilder().AddCommandLine(args).Build();
            Ip = config.GetValue<string>("ip") ?? "0.0.0.0";
            Port = config.GetValue<int?>("port") ?? 6003;
            var httpsPort = config.GetValue<int?>("https") ?? 5005;
            CoreLib.Statistics.WebHost = CreateWebHostBuilder(args).Build();
            CoreLib.Statistics.WebHost.Run();
        }
        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
            .UseKestrel(options =>
            {
                options.Listen(IPAddress.Any,Port);
                //options.Listen(IPAddress.Parse(Ip), Port);
                options.Limits.MaxConcurrentConnections = null;
                options.Limits.MaxConcurrentUpgradedConnections = null;
            });
    }
}
