using System;
using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Ticket;
using ERP.CoreService.DataAccess.EFModels;

namespace ERP.CoreService.Business.Interfaces
{
    public interface ITicketBiz
    {
        Task<Result<Guid>> Add(CreateTicketModel model,UserSurvey userSurvey=null,bool sendEmail=true);
        Task<Result<TicketCoreModel>> Edit(UpdateTicketModel model);
        Task<ResultList<TicketCoreModel>> List(FilterModel model);
        Task<Result<TicketCoreModel>> Get(BaseCoreModel coreModel);
    }
}