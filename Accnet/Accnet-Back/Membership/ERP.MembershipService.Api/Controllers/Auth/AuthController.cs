using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CoreLib;

using Microsoft.AspNetCore.Mvc;
using ERP.MembershipService.Business.Interfaces.Shared;
using ERP.MembershipService.Core.Models;
using ERP.MembershipService.Core.Models.Auth;
using ERP.MembershipService.Core.Models.Organization;
using ERP.MembershipService.Core.Models.User;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace ERP.MembershipService.Api.Controllers.Auth
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthBiz _authBiz;
        private readonly IUserBiz _userBiz;

        public AuthController(IAuthBiz authBiz, IUserBiz userBiz)
        {
            _authBiz = authBiz;
            _userBiz = userBiz;
        }

        [HttpPost("generate-token")]
        public async Task<Result<object>> GenerateToken(LoginModel model)
            => await _authBiz.GenerateToken(model);

        [HttpPost("refresh-token")]
        public async Task<Result<object>> RefreshToken(BaseModel model)
            => await _authBiz.GenerateToken(model.Id.Value);

        [HttpPost("register")]
        public Task<Result<object>> Register(RegisterModel model)
            => _userBiz.Register(model);

        [HttpPost("advanced-register")]
        public Task<Result<object>> Register(AdvanceRegisterModel model)
            => _userBiz.Register( model);

        [HttpPost("setting")]
        
        public async Task<Result<LightUserModel>> Setting(BaseModel model)
            => await _userBiz.Setting(model);

        [HttpPost("profile")]
        
        public async Task<Result<FullUserModel>> Profile(BaseModel model)
            => await _userBiz.Profile(model);

        [HttpPost("update-profile")]
        
        public async Task<Result<LightUserModel>> UpdateProfile(UpdateUserProfileModel model)
            => await _userBiz.UpdateProfile(model);
        
        [HttpPost("reciepts")]
        
        public async Task<Result<IList<Guid>>> Reciepts(BaseModel model)
            => await _userBiz.Reciepts(model);
        
        [HttpPost("change-password")]
        
        public async Task<Result<bool>> ChangePassword(ChangePasswordModel model)
            => await _authBiz.ChangePassword(model);
    }
}