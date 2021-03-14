using System;
using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Core.Extentions;
using ERP.MembershipService.ApiClient;
using ERP.MembershipService.ApiClient.Models.Feature;
using Microsoft.AspNetCore.Mvc;
using FilterModel = ERP.CoreService.Core.Models.FilterModel;

namespace ERP.CoreService.Api.Controllers.Membership
{
    [Route("api/feature")]
    [ApiController]
    public class FeatureController : ControllerBase
    {
        private readonly IMembershipServiceApi _membershipServiceApi;

        public FeatureController(IMembershipServiceApi membershipServiceApi)
        {
            _membershipServiceApi = membershipServiceApi;
        }

        [HttpPost("add")]
        public async Task<Result<Guid>> Add(CreateFeatureModel model)
            => await _membershipServiceApi.MembershipFeatureApiService.Add(model);

        [HttpPost("get")]
        public async Task<Result<FeatureModel>> Get(FeatureModel model)
            => await _membershipServiceApi.MembershipFeatureApiService.Get(model);


        [HttpPost("list")]
        public async Task<ResultList<FeatureModel>> List(FilterModel model)
            => await _membershipServiceApi.MembershipFeatureApiService.List(model.ToMembershipFilterModel());


        [HttpPost("edit")]
        public async Task<Result<FeatureModel>> Edit(UpdateFeatureModel model)
            => await _membershipServiceApi.MembershipFeatureApiService.Edit(model);
    }
}