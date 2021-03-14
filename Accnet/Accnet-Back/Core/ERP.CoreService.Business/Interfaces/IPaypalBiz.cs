using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Invoice;
using ERP.CoreService.Core.Models.Paypal;

namespace ERP.CoreService.Business.Interfaces
{
    public interface IPaypalBiz
    {
        
        Task<Result<string>> CreateOrder(BaseCoreModel coreModel);
        Task<Result<InvoiceCoreModel>> CaptureOrder(CaptureOrderModel model);

    }
}