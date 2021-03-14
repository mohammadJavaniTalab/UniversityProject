using System.Threading.Tasks;
using CoreLib;
using CoreLib.Models;

using ERP.MembershipService.Business.Interfaces.Shared;
using ERP.MembershipService.Core.Models;
using ERP.MembershipService.Core.Models.Permission;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.MembershipService.Api.Controllers.Membership
{
    
    [Route("api/permission")]
    [ApiController]
    
    public class PermissionController : ControllerBase
    {
        private readonly IPermissionBiz _permissionBiz;

        public PermissionController(IPermissionBiz permissionBiz)
        {
            _permissionBiz = permissionBiz;
        }

        

        [HttpPost("list")]
        public async Task<ResultList<PermissionModel>> List(PagingModel model)
            => await _permissionBiz.List(model);

    }
}