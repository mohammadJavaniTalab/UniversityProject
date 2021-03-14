using System;
using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Appointment;

namespace ERP.CoreService.Business.Interfaces
{
    public interface IAppointmentExceptionBiz
    {
        Task<Result<AppointmentExceptionModel>> Edit(UpdateAppointmentExceptionModel model);
        Task<Result<bool>> Delete(BaseCoreModel model);
        Task<ResultList<AppointmentExceptionModel>> List(FilterModel model);
        Task<Result<bool>> ValidateAppointment(DateTime appointmentDate);
        Task<Result<Guid>> Add(CreateAppointmentExceptionModel model);

    }
}