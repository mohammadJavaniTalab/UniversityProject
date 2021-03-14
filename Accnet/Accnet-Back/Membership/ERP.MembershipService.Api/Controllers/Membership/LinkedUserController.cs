using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Models;

using ERP.MembershipService.Business.Interfaces.Shared;
using ERP.MembershipService.Core.Models;
using ERP.MembershipService.Core.Models.Organization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.MembershipService.Api.Controllers.Membership
{
    [Route("api/linked-user")]
    [ApiController]
    
    public class LinkedUserController : ControllerBase
    {
        private readonly ILinkedUserBiz _linkedUserBiz;

        public LinkedUserController(ILinkedUserBiz linkedUserBiz)
        {
            _linkedUserBiz = linkedUserBiz;
        }

        [HttpPost("add")]
        public async Task<Result<Guid>> Add(CreateLinkedUserModel model)
            => await _linkedUserBiz.Add(model);

        [HttpPost("get")]
        public async Task<Result<LinkedUserModel>> Get(BaseModel model)
            => await _linkedUserBiz.Get(model);


        [HttpPost("list")]
        public async Task<ResultList<LinkedUserModel>> List(FilterModel model)
            => await _linkedUserBiz.List(model);

        [HttpPost("remove")]
        public async Task<Result> Remove(BaseModel model)
            => await _linkedUserBiz.Remove(model);

        [HttpPost("list-by-user")]
        public async Task<Result<IList<LinkedUserModel>>> ListByUser(BaseModel model)
            => await _linkedUserBiz.ListByUser(model);


        [HttpPost("join-request")]
        public async Task<Result> JoinRequest(CreateLinkedUserModel model)
            => await _linkedUserBiz.JoinRequest(model);

        [HttpPost("accept-request")]
        public async Task<Result> AcceptRequest(BaseModel model)
            => await _linkedUserBiz.AcceptRequest(model);


        [HttpPost("edit")]
        public async Task<Result<LinkedUserModel>> Edit(UpdateLinkedUserModel model)
            => await _linkedUserBiz.Edit(model);
    }
}