using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Text;
using AutoMapper;
using CoreLib;
using CoreLib.Models;
using ERP.CoreService.ApiClient;
using ERP.MembershipService.Api.AutoMapper;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ERP.MembershipService.Api.Middlewares;
using ERP.MembershipService.DataAccess.EFModels;
using FluentValidation.AspNetCore;
using Microsoft.OpenApi.Models;

namespace ERP.MembershipService.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IServiceProvider serviceProvider)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton(provider => { return Configuration; });

            ContainerConfiguration(services);

            SwaggerConfiguration(services);

            AutoMapperConfig(services);

            AuthenticationConfiguration(services);

            // Disable model state validation
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

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1).AddFluentValidation(
                mvcConfiguration =>
                    mvcConfiguration.RegisterValidatorsFromAssemblyContaining<Startup>());
            ;
        }

        private void SwaggerConfiguration(IServiceCollection services)
        {
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "ACCNET  API",
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

        private void AutoMapperConfig(IServiceCollection services)
        {
            var mappingConfig = new MapperConfiguration(mc => { mc.AddProfile(new MappingProfile()); });

            IMapper mapper = mappingConfig.CreateMapper();
            services.AddSingleton(mapper);
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

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IServiceProvider serviceProvider)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors(x => x
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader());

            app.UseAuthentication();
            app.UseMiddleware<ServiceAuthorizeMiddleware>();
            app.UseMvc();

            app.UseSwagger();
            app.UseSwaggerUI(options => { options.SwaggerEndpoint("/swagger/v1/swagger.json", "ACCNET  API V1"); });
        }

        private void ContainerConfiguration(IServiceCollection services)
        {
            services.AddHttpContextAccessor();

            var appSetting = new CoreLib.AppSettings
            {
                ConnectionString = Configuration["ConnectionString"],
                JwtSecret = Configuration["Jwt:Secret"],
                JwtIssuer = Configuration["Jwt:Issuer"],
                JwtValidDuration = int.Parse(Configuration["Jwt:ValidDuration"]),
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
                },
                VerifyCodeValidMinutes = int.Parse(Configuration["VerifyCode:ValidMinutes"]),
                JwtRefreshPeriod = int.Parse(Configuration["Jwt:RefreshPeriod"])
            };

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

            services.AddSingleton(typeof(CoreLib.IAppSettings), appSetting);
            services.AddHttpClient<CoreLib.HttpClients.SmsApiClient>(cf =>
                cf.BaseAddress = new Uri(appSetting.SmsApiAddress));
            services.AddSingleton<CoreLib.HttpClients.HttpClientFactory>();
            services.AddScoped<ICoreServiceApi, CoreServiceApi>();


            services.AddDbContextPool<ErpMembershipDBContext>((serviceProvider, options) =>
            {
                options.UseSqlServer(this.Configuration["ConnectionString"]);
                options.UseInternalServiceProvider(serviceProvider);
            }, 256);
            services.AddEntityFrameworkSqlServer();

            EstablishServicesHttpClients(services, appSetting);
        }

        private void EstablishDbHttpClients(IServiceCollection services)
        {
        }

        private void EstablishServicesHttpClients(IServiceCollection services, CoreLib.IAppSettings setting)
        {
            services.AddHttpClient(setting.CoreService.Host,
                    client => { client.BaseAddress = new Uri(setting.CoreService.Host); })
                .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
                {
                    AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate,
                    MaxConnectionsPerServer = 500
                }).SetHandlerLifetime(TimeSpan.FromMinutes(20));
        }
    }
}