using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CoreLib;
using ERP.MembershipService.Core.Models;
using ERP.MembershipService.Core.Models.User;

namespace ERP.MembershipService.Business.Interfaces.Shared
{
    public interface IRelativeBiz
    {
        Task<Result<Guid>> Add(CreateRelativeModel model);
        Task<Result<IList<RelativeModel>>> ListByUser(BaseModel model);
        Task<Result<Guid>> Delete(BaseModel model);
    }
}