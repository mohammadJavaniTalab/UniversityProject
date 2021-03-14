using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CoreLib;
using ERP.MembershipService.Business.Interfaces.Shared;
using ERP.MembershipService.Core.Models;
using ERP.MembershipService.Core.Models.User;
using Microsoft.AspNetCore.Mvc;

namespace ERP.MembershipService.Api.Controllers.Membership
{
    [Route("api/relative")]
    [ApiController]
    public class RelativeController : ControllerBase
    {

        private readonly IRelativeBiz _relativeBiz;

        public RelativeController(IRelativeBiz relativeBiz)
        {
            _relativeBiz = relativeBiz;
        }
        
        [HttpPost("add")]
        public async Task<Result<Guid>> Add(CreateRelativeModel model)
            => await _relativeBiz.Add(model);


        [HttpPost("list-by-user")]
        public async Task<Result<IList<RelativeModel>>> ListByUser(BaseModel model)
            => await _relativeBiz.ListByUser(model);


        [HttpPost("delete")]
        public async Task<Result<Guid>> Delete(BaseModel model)
            => await _relativeBiz.Delete(model);


    }
}