using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CoreLib;
using ERP.MembershipService.Business.Interfaces.Shared;
using ERP.MembershipService.Core.Models;
using ERP.MembershipService.Core.Models.Organization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.MembershipService.Api.Controllers.System
{
    [Route("api/system/linked-user")]
    [ApiController]
    
    public class LinkedUserController : ControllerBase
    {
        private readonly ILinkedUserBiz _linkedUserBiz;

        public LinkedUserController(ILinkedUserBiz linkedUserBiz)
        {
            _linkedUserBiz = linkedUserBiz;
        }


        [HttpPost("list-by-user")]
        public async Task<Result<IList<LinkedFullUserModel>>> ListByUserFullModel(BaseModel model)
            => await _linkedUserBiz.ListByUserFullModel(model);


        [HttpPost("lis-all")]
        public async Task<Result<IList<LinkedUserModel>>> ListAll()
            => await _linkedUserBiz.ListAll();


    }
}