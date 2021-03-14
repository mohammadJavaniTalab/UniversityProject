using System;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Models;

using ERP.MembershipService.Business.Interfaces.Shared;
using ERP.MembershipService.Core.Models;
using ERP.MembershipService.Core.Models.Feature;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.MembershipService.Api.Controllers.Membership
{
    [Route("api/feature")]
    [ApiController]
    
    public class FeatureController : ControllerBase
    {
        private readonly IFeatureBiz _featureBiz;

        public FeatureController(IFeatureBiz featureBiz)
        {
            _featureBiz = featureBiz;
        }

        [HttpPost("add")]
        public async Task<Result<Guid>> Add(CreateFeatureModel model)
            => await _featureBiz.Add(model);

        [HttpPost("get")]
        public async Task<Result<FeatureModel>> Get(FeatureModel model)
            => await _featureBiz.Get(model);


        [HttpPost("list")]
        public async Task<ResultList<FeatureModel>> List(FilterModel model)
            => await _featureBiz.List(model);


        [HttpPost("edit")]
        public async Task<Result<FeatureModel>> Edit(UpdateFeatureModel model)
            => await _featureBiz.Edit(model);
    }
}