using System;
using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Appointment;

namespace ERP.CoreService.Business.Interfaces
{
    public interface IAppointmentBiz
    {
        
        Task<Result<AppointmentCoreModel>> Edit(UpdateAppointmentModel model);
        Task<ResultList<AppointmentCoreModel>> List(FilterModel model);
        Task<Result<AppointmentCoreModel>> Get(BaseCoreModel coreModel);
        Task<Result<object>> Add(CreateAppointmentModel model);
        Task<Result> Delete(BaseCoreModel model);
    }
}