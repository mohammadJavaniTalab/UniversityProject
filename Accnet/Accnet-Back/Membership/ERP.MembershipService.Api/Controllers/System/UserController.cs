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
using Newtonsoft.Json;

namespace ERP.MembershipService.Api.Controllers.System
{
    [Route("api/system/user")]
    [ApiController]
    
    public class UserController : ControllerBase
    {
        private readonly IUserBiz _userBiz;

        public UserController(IUserBiz userBiz)
        {
            _userBiz = userBiz;
        }


        [HttpPost("get")]
        public async Task<Result<FullUserModel>> Get(BaseModel model)
            => await _userBiz.Get(model);
        

        [HttpPost("list-by-ids")]
        public async Task<Result<IList<LightUserModel>>> ListByIds(object Ids)
            => await _userBiz.ListByIds(JsonConvert.DeserializeObject<List<Guid>>(Ids.ToString()));
        
        [HttpPost("list-by-ids-full")]
        public async Task<Result<IList<FullUserModel>>> FullListByIds(object Ids)
            => await _userBiz.FullListByIds(JsonConvert.DeserializeObject<List<Guid>>(Ids.ToString()));
    }
}