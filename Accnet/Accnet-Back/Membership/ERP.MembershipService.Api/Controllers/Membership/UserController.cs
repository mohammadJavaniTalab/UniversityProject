using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Models;

using ERP.MembershipService.Business.Interfaces.Shared;
using ERP.MembershipService.Core.Models;
using ERP.MembershipService.Core.Models.User;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.MembershipService.Api.Controllers.Membership
{
    [Route("api/user")]
    [ApiController]
    
    public class UserController : ControllerBase
    {
        private readonly IUserBiz _userBiz;
        public UserController(IUserBiz userBiz)
        {
            _userBiz = userBiz;
        }
        
        [HttpPost("add")]
        public async Task<Result<Guid>> Add(CreateUserModel model)
            => await _userBiz.Add(model);

        
        [HttpPost("list")]
        public async Task<ResultList<FullUserModel>> List(FilterModel model)
            => await _userBiz.List(model);

        [HttpPost("search")]
        public async Task<Result<LightUserModel>> Search(SearchUserModel model)
            => await _userBiz.Search(model);

        
        [HttpPost("edit")]
        public async Task<Result<LightUserModel>> Edit(UpdateUserModel model)
            => await _userBiz.Edit(model);

        [HttpPost("delete")]
        public async Task<Result> Delete(BaseModel model)
            => await _userBiz.Delete(model);

        [HttpPost("add-reciepts")]
        public async Task<Result> AddReciept(UpdateUserModel model)
            => await _userBiz.AddReciept(model);


    }
}
