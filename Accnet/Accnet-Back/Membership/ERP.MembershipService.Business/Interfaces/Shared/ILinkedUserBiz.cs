using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Models;
using ERP.MembershipService.Core.Models;
using ERP.MembershipService.Core.Models.Organization;

namespace ERP.MembershipService.Business.Interfaces.Shared
{
    public interface ILinkedUserBiz
    {
        Task<Result<LinkedUserModel>> Get(BaseModel model);
        Task<Result<Guid>> Add(CreateLinkedUserModel model);
        Task<ResultList<LinkedUserModel>> List(FilterModel model);
        Task<Result<IList<LinkedUserModel>>> ListAll();
        Task<Result<IList<LinkedUserModel>>> ListByUser(BaseModel model);
        Task<Result<IList<LinkedFullUserModel>>> ListByUserFullModel(BaseModel model);
        Task<Result<LinkedUserModel>> Edit(UpdateLinkedUserModel model);

        Task<Result> JoinRequest(CreateLinkedUserModel model);
        Task<Result> AcceptRequest(BaseModel model);
        Task<Result> Remove(BaseModel model);
    }
}