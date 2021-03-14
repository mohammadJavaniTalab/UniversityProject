using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Business.Services.Email;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Appointment;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ERP.CoreService.Api.Controllers.Core
{
    [Route("api/appointment")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentBiz _AppointmentBiz;
        private readonly CoreSmtpClient _coreSmtpClient;

        public AppointmentController(IAppointmentBiz AppointmentBiz, CoreSmtpClient coreSmtpClient)
        {
            _coreSmtpClient = coreSmtpClient;
            _AppointmentBiz = AppointmentBiz;
        }

        [HttpPost("add")]
        public Task<Result<object>> Add(CreateAppointmentModel model)
            => _AppointmentBiz.Add(model);



        [HttpPost("get")]
        public async Task<Result<AppointmentCoreModel>> Get(BaseCoreModel coreModel)
            => await _AppointmentBiz.Get(coreModel);

        [HttpPost("delete")]
        public async Task<Result> Delete(BaseCoreModel coreModel)
            => await _AppointmentBiz.Delete(coreModel);


        [HttpPost("list")]
        public async Task<ResultList<AppointmentCoreModel>> List(FilterModel model)
            => await _AppointmentBiz.List(model);


        [HttpPost("edit")]
        public async Task<Result<AppointmentCoreModel>> Edit(UpdateAppointmentModel model)
            => await _AppointmentBiz.Edit(model);
    }
}