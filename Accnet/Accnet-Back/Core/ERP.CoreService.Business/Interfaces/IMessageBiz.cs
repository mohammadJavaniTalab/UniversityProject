using System;
using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Message;

namespace ERP.CoreService.Business.Interfaces
{
    public interface IMessageBiz
    {
        Task<Result<MessageCoreModel>> Edit(UpdateMessageModel model);
        Task<ResultList<MessageCoreModel>> List(FilterModel model);
        Task<Result<MessageCoreModel>> Get(BaseCoreModel coreModel);
        Task<Result<Guid>> Add(CreateMessageModel model);
        
        Task<Result<long>> CountByUser(Guid userId);

    }
}