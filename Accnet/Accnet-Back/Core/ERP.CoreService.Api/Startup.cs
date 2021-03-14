using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ERP.CoreService.Api.Middlewares;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Threading;
using AspNetCoreRateLimit;
using AutoMapper;
using CoreLib;
using CoreLib.Models;
using CoreLib.Schedule;
using ERP.CoreService.Api.AutoMapper;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using ERP.CoreService.Api.Filters;
using ERP.CoreService.Business.Services.BankGateway;
using ERP.CoreService.Business.Services.Docusign;
using ERP.CoreService.Business.Services.Email;
using ERP.CoreService.Business.Services.Google;
using ERP.CoreService.Business.Services.Sms;
using ERP.CoreService.DataAccess.EFModels;
using ERP.MembershipService.ApiClient;
using FluentValidation.AspNetCore;
using Microsoft.OpenApi.Models;

namespace ERP.CoreService.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton(provider => { return Configuration; });

            IpRateLimitationConfiguration(services);

            ContainerConfiguration(services);
            
            SwaggerConfiguration(services);

            AutoMapperConfig(services);

            AuthenticationConfiguration(services);

            services.AddMvc(config => { config.Filters.Add(new ModelValidationFilter()); })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1).AddFluentValidation(
                    mvcConfiguration =>
                        mvcConfiguration.RegisterValidatorsFromAssemblyContaining<Startup>());

            //Disable Automatic Model State Validation
            services.Configure<ApiBehaviorOptions>(options =>
            {
                //options.SuppressModelStateInvalidFilter = true;
                options.InvalidModelStateResponseFactory = actionContext =>
                {

                    return new BadRequestObjectResult(Result.Failed(Error.WithData(1000, (
                        actionContext.ModelState.Values.SelectMany(v => v.Errors)
                            .Select(e => e.ErrorMessage.ToString())).ToArray())));
                };
            });

            services.AddResponseCompression(options => { options.Providers.Add<GzipCompressionProvider>(); });
        }

        private void AutoMapperConfig(IServiceCollection services)
        {
            var mappingConfig = new MapperConfiguration(mc => { mc.AddProfile(new MappingProfile()); });

            IMapper mapper = mappingConfig.CreateMapper();
            services.AddSingleton(mapper);
        }


        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IServiceProvider provider)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            
            
            app.UseHttpsRedirection();
            app.UseIpRateLimiting();
            app.UseCors(x => x
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .WithExposedHeaders("new-token"));

            app.UseHsts();
            app.UseAuthentication();
            app.UseMiddleware<ResolverMiddleware>();
            app.UseResponseCompression();
            app.UseMvc();

            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "ACCNET  API V1");
            });

            LoadStatistics(provider);
        }


        private void SwaggerConfiguration(IServiceCollection services)
        {
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "ACCNET Core Service API",
                    Version = "v1.0",
                    Description = "ACCNET ASP.NET Core Web API",
                });
                


                // Set the comments path for the Swagger JSON and UI.
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";

                options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFile));

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.ApiKey,
                    In = ParameterLocation.Header,
                    Name = "Authorization",
                    Description = "Please enter into field the word 'Bearer' following by space and JWT",
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] { }
                    }
                });
            });
        }

        private void ContainerConfiguration(IServiceCollection services)
        {
            new Business.LayerServicesTypes()
                .GetServices()
                .GroupBy(s => s.Lifetime)
                .ToList()
                .ForEach(g =>
                {
                    if (g.Key == CoreLib.TypeLifetime.Transient)
                        g.ToList().ForEach(s =>
                        {
                            if (s.Implement != null)
                                services.AddTransient(s.BaseType, s.Implement);
                            else
                                services.AddTransient(s.BaseType, s.ImplementationType);
                        });

                    else if (g.Key == CoreLib.TypeLifetime.Scoped)
                        g.ToList().ForEach(s =>
                        {
                            if (s.Implement != null)
                                services.AddScoped(s.BaseType, s.Implement);
                            else
                                services.AddScoped(s.BaseType, s.ImplementationType);
                        });

                    else if (g.Key == CoreLib.TypeLifetime.Singleton)
                        g.ToList().ForEach(s =>
                        {
                            if (s.Implement != null)
                                services.AddSingleton(s.BaseType, s.Implement);
                            else if (s.Instance != null && s.BaseType != null)
                                services.AddSingleton(s.BaseType, s.Instance);
                            else if (s.Instance != null && s.BaseType == null)
                                services.AddSingleton(s.Instance);
                            else if (s.BaseType == null)
                                services.AddSingleton(s.ImplementationType);
                            else
                                services.AddSingleton(s.BaseType, s.ImplementationType);
                        });
                });

            var setting = new CoreLib.AppSettings
            {
                ConnectionString = Configuration["ConnectionString"],
                JwtSecret = Configuration["Jwt:Secret"],
                JwtIssuer = Configuration["Jwt:Issuer"],
                JwtRefreshPeriod = int.Parse(Configuration["Jwt:RefreshPeriod"]),
                SmsApiAddress = Configuration["Sms:ApiAddress"],
                SmsUsername = Configuration["Sms:Username"],
                SmsPassword = Configuration["Sms:Password"],
                SmsSender = Configuration["Sms:Sender"],
                MembershipService = new Service
                {
                    Host = Configuration["Services:Membership:Host"],
                    ApiKey = Configuration["Services:Membership:ApiKey"]
                },
                CoreService = new Service
                {
                    Host = Configuration["Services:Core:Host"],
                    ApiKey = Configuration["Services:Core:ApiKey"]
                }
            };

            services.AddSingleton(typeof(CoreLib.IAppSettings), setting);

            services.AddHttpContextAccessor();

            services.AddDbContextPool<ErpCoreDBContext>((serviceProvider, options) =>
            {
                options.UseSqlServer(this.Configuration["ConnectionString"]);
                options.UseInternalServiceProvider(serviceProvider);
            }, 256);
            services.AddEntityFrameworkSqlServer();

            services.AddScoped<IMembershipServiceApi, MembershipServiceApi>();
            services.AddHostedService<QuartzHostedService>();
            services.AddTransient<CoreSmtpClient>();
            services.AddTransient<SmsHttpClient>();
            services.AddTransient<PaypalHttpClient>();
            services.AddTransient<DocusignHttpClient>();
            services.AddTransient<PlaceApi>();
            services.AddTransient<Captcha>();

            EstablishServicesHttpClients(services, setting);

            LoadStatistics(services.BuildServiceProvider());

            Thread.Sleep(10000);
            EstablishDbHttpClients(services);
        }

        private void AuthenticationConfiguration(IServiceCollection services)
        {
            services.AddAuthentication(x =>
                {
                    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    //var signingKey = Convert.FromBase64String(Configuration["Jwt:Secret"]);
                    var signingKey = Encoding.UTF8.GetBytes(Configuration["Jwt:Secret"]);
                    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = Configuration["Jwt:Issuer"],
                        ValidAudience = Configuration["Jwt:Issuer"],
                        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(signingKey)
                    };
                });
        }

        private void IpRateLimitationConfiguration(IServiceCollection services)
        {
            services.AddMemoryCache();

            //load general configuration from appsettings.json
            services.Configure<IpRateLimitOptions>(Configuration.GetSection("IpRateLimiting"));

            //load ip rules from appsettings.json
            //services.Configure<IpRateLimitPolicies>(Configuration.GetSection("IpRateLimitPolicies"));

            // inject counter and rules stores
            //services.AddSingleton<IClientPolicyStore, MemoryCacheClientPolicyStore>();
            services.AddSingleton<IIpPolicyStore, MemoryCacheIpPolicyStore>();
            services.AddSingleton<IRateLimitCounterStore, MemoryCacheRateLimitCounterStore>();
        }

        private void LoadStatistics(IServiceProvider provider)
        {
        }

        private void EstablishDbHttpClients(IServiceCollection services)
        {
        }

        private void EstablishServicesHttpClients(IServiceCollection services, CoreLib.IAppSettings setting)
        {
            services.AddHttpClient(setting.MembershipService.Host,
                    client => { client.BaseAddress = new Uri(setting.MembershipService.Host); })
                .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
                {
                    AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate,
                    MaxConnectionsPerServer = 500
                }).SetHandlerLifetime(TimeSpan.FromMinutes(20));
        }
    }
}