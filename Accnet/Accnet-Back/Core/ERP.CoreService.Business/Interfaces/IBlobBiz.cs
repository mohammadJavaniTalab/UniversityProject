using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Core.Models;
using ERP.CoreService.DataAccess.EFModels;

namespace ERP.CoreService.Business.Interfaces
{
    public interface IBlobBiz
    {
        Task<Result<Guid>> Add(byte[] toArray, string fileFileName,string contentType);
        Task<Result<Blob>> Get(BaseCoreModel coreModel);
        Task<Result<IList<Blob>>> ListById(List<Guid> blobIds);
    }
}