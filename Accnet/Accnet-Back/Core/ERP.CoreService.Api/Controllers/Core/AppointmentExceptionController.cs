using System;
using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Appointment;
using Microsoft.AspNetCore.Mvc;

namespace ERP.CoreService.Api.Controllers.Core
{
    [Route("api/appointment-exception")]
    [ApiController]
    public class AppointmentExceptionController
    {
        private readonly IAppointmentExceptionBiz _appointmentExceptionBiz;

        public AppointmentExceptionController(IAppointmentExceptionBiz appointmentExceptionBiz)
        {
            _appointmentExceptionBiz = appointmentExceptionBiz;
        }

        [HttpPost("add")]
        public Task<Result<Guid>> Add(CreateAppointmentExceptionModel model)
            => _appointmentExceptionBiz.Add(model);

        [HttpPost("list")]
        public async Task<ResultList<AppointmentExceptionModel>> List(FilterModel model)
            => await _appointmentExceptionBiz.List(model);

        [HttpPost("edit")]
        public async Task<Result<AppointmentExceptionModel>> Edit(UpdateAppointmentExceptionModel model)
            => await _appointmentExceptionBiz.Edit(model);

        [HttpPost("delete")]
        public async Task<Result<bool>> Delete(BaseCoreModel model)
            => await _appointmentExceptionBiz.Delete(model);

    }
}