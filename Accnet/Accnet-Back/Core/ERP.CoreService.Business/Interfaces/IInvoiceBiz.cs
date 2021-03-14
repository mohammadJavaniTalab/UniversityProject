using System;
using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Invoice;
using ERP.CoreService.DataAccess.EFModels;

namespace ERP.CoreService.Business.Interfaces
{
    public interface IInvoiceBiz
    {
        Task<Result<InvoiceCoreModel>> Edit(UpdateInvoiceModel model);
        Task<ResultList<InvoiceCoreModel>> List(FilterModel model);
        Task<Result<InvoiceCoreModel>> Get(BaseCoreModel coreModel);
        Task<Result<Guid>> Add(CreateInvoiceModel model, UserSurvey userSurvey = null);
        
        Task<Result<long>> CountByUser(Guid userId);

    }
}