using System;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Models;
using ERP.MembershipService.Core.Models;
using ERP.MembershipService.Core.Models.Feature;

namespace ERP.MembershipService.Business.Interfaces.Shared
{
    public interface IFeatureBiz
    {
        Task<Result<FeatureModel>> Get(BaseModel model);
        Task<Result<Guid>> Add(CreateFeatureModel model);
        Task<ResultList<FeatureModel>> List(FilterModel model);
        Task<Result<FeatureModel>> Edit(UpdateFeatureModel model);

    }
}