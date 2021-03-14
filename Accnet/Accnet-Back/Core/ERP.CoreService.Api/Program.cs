using System.Net;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace ERP.CoreService.Api
{
    public class Program
    {
        static string Ip { get; set; }
        static int Port { get; set; }

        public static void Main(string[] args)
        {
            var config = new ConfigurationBuilder().AddCommandLine(args).Build();
            Ip = config.GetValue<string>("ip") ?? "0.0.0.0";
            Port = config.GetValue<int?>("port") ?? 6004;
            var httpsPort = config.GetValue<int?>("https") ?? 5005;
            CoreLib.Statistics.WebHost = CreateWebHostBuilder(args).Build();
            CoreLib.Statistics.WebHost.Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .UseKestrel(options =>
                {
                    options.Limits.MaxRequestBodySize = 10000000;

                    options.Listen(IPAddress.Any, Port, op =>
                    {
                        // op.UseHttps();
//                        using (var store = new X509Store(StoreName.My, StoreLocation.CurrentUser))
//                        {
//                            store.Open(OpenFlags.ReadOnly);
//                            foreach (var cert in store.Certificates)
//                            {
//                                if(cert.SubjectName.Name == "*.ERP.com")
//                                    op.UseHttps(cert);
//                            }
//                        }
                    });
                    options.Listen(IPAddress.Any, 6005, op =>
                    {
//                        op.UseHttps();
//                        using (var store = new X509Store(StoreName.My, StoreLocation.CurrentUser))
//                        {
//                            store.Open(OpenFlags.ReadOnly);
//                            foreach (var cert in store.Certificates)
//                            {
//                                if(cert.SubjectName.Name == "*.ERP.com")
//                                    op.UseHttps(cert);
//                            }
//                        }
                    });
//                    options.Listen(IPAddress.Parse(Ip), Port);
                    options.Limits.MaxConcurrentConnections = null;
                    options.Limits.MaxConcurrentUpgradedConnections = null;
                });
    }
//            public static class KestrelServerOptionsExtensions
//        {
//            public static void ConfigureEndpoints(this KestrelServerOptions options)
//            {
//                var configuration = options.ApplicationServices.GetRequiredService<IConfiguration>();
//                var environment = options.ApplicationServices.GetRequiredService<IHostingEnvironment>();
//
//                var endpoints = configuration.GetSection("HttpServer:Endpoints")
//                    .GetChildren()
//                    .ToDictionary(section => section.Key, section =>
//                    {
//                        var endpoint = new EndpointConfiguration();
//                        section.Bind(endpoint);
//                        return endpoint;
//                    });
//
//                foreach (var endpoint in endpoints)
//                {
//                    var config = endpoint.Value;
//                    var port = config.Port ?? (config.Scheme == "https" ? 443 : 80);
//
//                    var ipAddresses = new List<IPAddress>();
//                    if (config.Host == "localhost")
//                    {
//                        ipAddresses.Add(IPAddress.IPv6Loopback);
//                        ipAddresses.Add(IPAddress.Loopback);
//                    }
//                    else if (IPAddress.TryParse(config.Host, out var address))
//                    {
//                        ipAddresses.Add(address);
//                    }
//                    else
//                    {
//                        ipAddresses.Add(IPAddress.IPv6Any);
//                    }
//
//                    foreach (var address in ipAddresses)
//                    {
//                        options.Listen(address, port,
//                            listenOptions =>
//                            {
//                                if (config.Scheme == "https")
//                                {
//                                    var certificate = LoadCertificate(config, environment);
//                                    listenOptions.UseHttps(certificate);
//                                }
//                            });
//                    }
//                }
//            }
//
//            private static X509Certificate2 LoadCertificate(EndpointConfiguration config,
//                IHostingEnvironment environment)
//            {
//                if (config.StoreName != null && config.StoreLocation != null)
//                {
//                    using (var store = new X509Store(config.StoreName, Enum.Parse<StoreLocation>(config.StoreLocation)))
//                    {
//                        store.Open(OpenFlags.ReadOnly);
//                        var certificate = store.Certificates.Find(
//                            X509FindType.FindBySubjectName,
//                            config.Host,
//                            validOnly: !environment.IsDevelopment());
//
//                        if (certificate.Count == 0)
//                        {
//                            throw new InvalidOperationException($"Certificate not found for {config.Host}.");
//                        }
//
//                        return certificate[0];
//                    }
//                }
//
//                if (config.FilePath != null && config.Password != null)
//                {
//                    return new X509Certificate2(config.FilePath, config.Password);
//                }
//
//                throw new InvalidOperationException(
//                    "No valid certificate configuration found for the current endpoint.");
//            }
//        }
//
//        public class EndpointConfiguration
//        {
//            public string Host { get; set; }
//            public int? Port { get; set; }
//            public string Scheme { get; set; }
//            public string StoreName { get; set; }
//            public string StoreLocation { get; set; }
//            public string FilePath { get; set; }
//            public string Password { get; set; }
//        }

}