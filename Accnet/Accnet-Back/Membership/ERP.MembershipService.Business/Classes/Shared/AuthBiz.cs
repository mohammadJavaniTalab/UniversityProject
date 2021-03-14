using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CoreLib;
using CoreLib.Services;
using Microsoft.IdentityModel.Tokens;
using ERP.MembershipService.Business.Interfaces.Shared;
using ERP.MembershipService.Core.Base;
using ERP.MembershipService.Core.Models;
using ERP.MembershipService.Core.Models.Auth;
using ERP.MembershipService.Core.Models.Feature;
using ERP.MembershipService.Core.Models.Permission;
using ERP.MembershipService.Core.Models.Role;
using ERP.MembershipService.DataAccess.EFModels;

namespace ERP.MembershipService.Business.Classes.Shared
{
    public class AuthBiz : Base, IAuthBiz
    {
        private readonly IAppSettings _appSettings;
        private readonly IRepository repository;
        private readonly ICryptoService _cryptoService;

        public AuthBiz(IServiceProvider provider,
            IGeneralDataService generalDataService,
            IMapperService mapper,
            IRepository repository,
            IAppSettings appSettings,
            ICryptoService cryptoService,
            IMapper autoMapper,
            ILogger logger) : base(mapper, logger,
            generalDataService, autoMapper)
        {
            _appSettings = appSettings;
            _cryptoService = cryptoService;
            this.repository = repository;
        }

        public Task<Result<object>> GenerateToken(LoginModel model)
            => Result<object>.TryAsync(async () =>
            {
                if (string.IsNullOrWhiteSpace(model.Username))
                    return Result<object>.Failed(
                        Error.WithCode(ErrorCodes.AuthModelValidtionOneOfMobileOrEmailOrUsernameIsRequired));

                model.Password = _cryptoService.ComputeSha512Hash(model.Password);

                var userResult = await repository.FirstOrDefaultAsNoTrackingAsync<User>(u =>
                        (string.IsNullOrEmpty(model.Username) || u.Username == model.Username ||
                         u.Email == model.Username) && u.Password == model.Password,
                    u => u.Role);
                if (!userResult.Success || userResult.Data == null)
                    return Result<object>.Failed(Error.WithCode(ErrorCodes.UserNotFound));

                if (!userResult.Data.Enabled)
                    return Result<object>.Failed(Error.WithData(1000,
                        new[]
                        {
                            "Your Credentials Are Not Allowed Anymore , Please Contact Support If You Have Any Questions."
                        }));

                var roleResult = await repository.FirstOrDefaultAsNoTrackingAsync<Role>(r => r.Id == userResult.Data.RoleId,
                   r=> r.RoleFeature.Select(rf => rf.Feature.FeaturePermission));
                var role = roleResult.Data;
                var roleModel = new RoleModel
                {
                    Id = role.Id,
                    Name = role.Name,
                    Feature = role.RoleFeature?.Select(rf => new FeatureModel
                    {
                        Id = rf.Feature.Id,
                        Name = rf.Feature.Name,
                        Permissions = rf.Feature?.FeaturePermission?.Select(fp => new PermissionModel
                        {
                            Id = (PermissionType) fp.PermissionId,
                        }).ToList()
                    }).ToList()
                };

                var token = GenerateJsonWebToken(userResult.Data,role);
                var response = new
                {
                    Token = token,
                    Role = roleModel
                };
                return Result<object>.Successful(response);
            });

        public Task<Result<object>> GenerateToken(Guid userId) =>
            Result<object>.TryAsync(async () =>
            {
                var userResult = await repository.FirstOrDefaultAsNoTrackingAsync<User>(u => u.Id == userId,
                    u => u.Role.RoleFeature.Select(rf => rf.Feature.FeaturePermission.Select(fp => fp.Permission)));
                if (!userResult.Success || userResult.Data == null)
                    return Result<object>.Failed(Error.WithCode(ErrorCodes.UserNotFound));


                return Result<object>.Successful(GenerateJsonWebToken(userResult.Data,userResult.Data.Role));
            });

        public async Task<Result<bool>> ChangePassword(ChangePasswordModel model)
        {
            var user = await repository.FirstOrDefaultAsync<User>(u => u.Id == model.UserId);

            if (string.IsNullOrEmpty(model.NewPassword))
                return Result<bool>.Failed(Error.WithData(1000, new[] {"new password is empty"}));

            if (!user.Success || user.Data == null)
                return Result<bool>.Failed(Error.WithData(1000, new[] {"user not found"}));
            user.Data.Password = _cryptoService.ComputeSha512Hash(model.NewPassword);

            await repository.CommitAsync();

            return Result<bool>.Successful(true);
        }

        public string GenerateJsonWebToken(User user,Role role)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sid, "ERP:" + Guid.NewGuid().ToString()),
                new Claim("Username", user.Username),
                new Claim("Id", user.Id.ToString()),
                new Claim("Name", user.Firstname),
                new Claim("Lastname", user.Lastname),
                new Claim("Email", user.Email),
                new Claim("Mobile", user.Mobile),
                new Claim("Enabled", user.Enabled.ToString()),
                new Claim("CreationDate", DateTime.Now.ToString("MM/dd/yyyy hh:mm tt")),
                new Claim("RoleId", user.RoleId.ToString()),
                new Claim("PermissionsId",
                    role.RoleFeature.Select(m => m.Feature)
                        .SelectMany(f => f.FeaturePermission)
                        .Select(s => s.PermissionId.ToString()).Distinct().Aggregate((a, b) => $"{a},{b}")),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            //var signingKey = Convert.FromBase64String(_appSettings.JwtSecret);
            var signingKey = Encoding.UTF8.GetBytes(_appSettings.JwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = _appSettings.JwtIssuer,
                Audience = _appSettings.JwtIssuer,
                IssuedAt = DateTime.Now,
                NotBefore = DateTime.Now,
                Expires = DateTime.Now.AddMinutes(_appSettings.JwtValidDuration),
                Subject = new ClaimsIdentity(claims),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(signingKey),
                    SecurityAlgorithms.HmacSha256Signature)
            };
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = jwtTokenHandler.CreateJwtSecurityToken(tokenDescriptor);
            var token = jwtTokenHandler.WriteToken(jwtToken);
            return token;
        }
    }
}