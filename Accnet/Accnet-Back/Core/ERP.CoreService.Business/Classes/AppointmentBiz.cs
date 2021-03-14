using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CoreLib;
using CoreLib.Services;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Business.Services.Email;
using ERP.CoreService.Business.Services.Sms;
using ERP.CoreService.Core.Base;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Appointment;
using ERP.CoreService.Core.Models.Invoice;
using ERP.CoreService.Core.Models.Message;
using ERP.CoreService.DataAccess.EFModels;
using ERP.MembershipService.ApiClient;
using ERP.MembershipService.ApiClient.Enums;
using ERP.MembershipService.ApiClient.Models;
using ERP.MembershipService.ApiClient.Models.User;
using FilterModel = ERP.CoreService.Core.Models.FilterModel;

namespace ERP.CoreService.Business.Classes
{
    public class AppointmentBiz : Base, IAppointmentBiz
    {
        private readonly IRepository _repository;
        private readonly IMembershipServiceApi _membershipServiceApi;
        private readonly IAppointmentExceptionBiz _appointmentExceptionBiz;
        private readonly IInvoiceBiz _invoiceBiz;
        private readonly CoreSmtpClient _coreSmtpClient;
        private readonly SmsHttpClient _smsHttpClient;
        private readonly IMessageBiz _messageBiz;

        public AppointmentBiz(IMapperService mapper, IRepository repository, IMapper autoMapper, IInvoiceBiz invoiceBiz,
            IMembershipServiceApi membershipServiceApi, CoreSmtpClient coreSmtpClient, IMessageBiz messageBiz,
            IAppointmentExceptionBiz appointmentExceptionBiz, SmsHttpClient smsHttpClient,
            ILogger logger, IGeneralDataService generalDataService) : base(mapper, logger,
            generalDataService, autoMapper)
        {
            _smsHttpClient = smsHttpClient;
            _messageBiz = messageBiz;
            _invoiceBiz = invoiceBiz;
            _appointmentExceptionBiz = appointmentExceptionBiz;
            _coreSmtpClient = coreSmtpClient;
            _membershipServiceApi = membershipServiceApi;
            _repository = repository;
        }

        public Task<Result<object>> Add(CreateAppointmentModel model)
            => Result<object>.TryAsync(async () =>
            {
                var isAdmin = generalDataService.User.Permissions.Any(p => p == (int) PermissionType.Admin);

                if (model.UserId == Guid.Empty)
                    model.UserId = generalDataService.User.Id;
                var user = (await _membershipServiceApi.SystemUserApiService.Get(
                    new MembershipService.ApiClient.Models.BaseModel {Id = model.UserId})).Data;
                if (user == null)
                    return Result<object>.Failed(Error.WithData(1000, new[] {"User not found"}));

                var validateAppointment = await _appointmentExceptionBiz.ValidateAppointment(model.Date);
                if (validateAppointment.Success && validateAppointment.Data)
                    return Result<object>.Failed(Error.WithData(1000,
                        new[] {"Sorry , there are no available representative in the requested time"}));

                var duplicateTime =
                    await _repository.FirstOrDefaultAsNoTrackingAsync<Appointment>(a => a.Date == model.Date);
                if (duplicateTime.Success && duplicateTime.Data != null)
                    return Result<object>.Failed(Error.WithData(1000,
                        new[] {"Sorry , there are no available representative in the requested time"}));

                Guid? invoiceId = null;
                if (model.Duration > 20)
                    invoiceId = (await _invoiceBiz.Add(new CreateInvoiceModel
                    {
                        Amount = 200,
                        Description = @"1xVIP appointment $200 
Sub total = $200
Taxes = $10
Total = $210",
                        Status = InvoiceStatus.Pending,
                        Title = "VIP Appointment",
                        Enabled = true,
                        UserId = model.UserId
                    })).Data;

                var appointment = new Appointment
                {
                    Id = Guid.NewGuid(),
                    InvoiceId = invoiceId,
                    Description = model.Description,
                    CreationDate = DateTime.Now,
                    Date = model.Date,
                    Duration = model.Duration,
                    Type = model.Type,
                    UserId = !isAdmin ? generalDataService.User.Id : user.Id,
                    RepresentativeId = isAdmin ? generalDataService.User.Id : Guid.Empty,
                    Title = model.Title,
                    Approved = true
                };

                _repository.Add(appointment);

                var usersurvey = await _repository.ListAsync<UserSurvey>(us => us.UserId == generalDataService.User.Id);
                if (usersurvey.Success && usersurvey.Data != null && usersurvey.Data.Any())
                {
                    var userSurveyIds = usersurvey.Data.Select(us => us.Id).ToList();
                    var taxes = await _repository.ListAsync<Tax>(t =>
                        t.UserSurveyId != null && userSurveyIds.Contains(t.UserSurveyId.Value) &&
                        t.Status == (int) TaxStatus.SetConsultation);

                    if (taxes.Success && taxes.Data != null && taxes.Data.Any())
                    {
                        taxes.Data.ToList().ForEach(t => t.Status = (byte) TaxStatus.PendingConsultation);
                    }
                }

                await _repository.CommitAsync();


                if (appointment.InvoiceId == null)
                {
                    _coreSmtpClient.SendComplimentryConsultation(user.Email,
                        user.Firstname + " " + user.Lastname, appointment.Date.ToString("F"));


                    await _messageBiz.Add(new CreateMessageModel
                    {
                        Title = "Your Appointment",
                        Body =
                            $"Your appointment has been confirmed. One of our AccNet representatives will reach out to you at the scheduled time : {appointment.Date.ToString("F")} (PACIFIC STANDARD TIME)",
                        ToUser = user.Id,
                        Priority = MessagePriority.High
                    });

                    _coreSmtpClient.SendAppointmentBookNotif("notifications@accnetonline.com",
                        user.Firstname + " " + user.Lastname,
                        appointment.Date.ToString("F"));
                }

                return Result<object>.Successful(new
                {
                    message = invoiceId.HasValue
                        ? $"To confirm your VIP consultation on {appointment.Date.ToString("F")} (PACIFIC STANDARD TIME), please click OK to kindly pay the fee for this call. Once paid you will receive a confirmation email detailing the selected date and time. Thank you"
                        : $"Your appointment has been confirmed. One of our AccNet representatives will reach out to you at the scheduled time : {appointment.Date.ToString("F")} (PACIFIC STANDARD TIME)",
                    vip = invoiceId.HasValue
                });
            });

        public Task<Result> Delete(BaseCoreModel model)
            => Result.TryAsync(async () =>
            {
                var app = await _repository.FirstOrDefaultAsync<Appointment>(a => a.Id == model.Id,
                    a => a.Invoice);
                if (app.Data.Invoice != null)
                    _repository.Remove(app.Data.Invoice);
                _repository.Remove(app.Data);
                await _repository.CommitAsync();
                return Result.Successful();
            });

        public Task<Result<AppointmentCoreModel>> Get(Core.Models.BaseCoreModel coreModel)
            => Result<AppointmentCoreModel>.TryAsync(async () =>
            {
                var result =
                    await _repository.FirstOrDefaultAsNoTrackingAsync<Appointment>(s => s.Id == coreModel.Id,
                        a => a.Invoice);

                if (!result.Success || result.Data == null)
                    return Result<AppointmentCoreModel>.Failed(Error.WithCode(BaseErrorCodes.NotFound));

                var appointment = result.Data;

                LightUserModel user = null;
                LightUserModel representative = null;
                user = (await _membershipServiceApi.AuthAuthApiService.Setting(new BaseModel
                        {Id = appointment.UserId}))
                    .Data;
                representative = appointment.RepresentativeId != null
                    ? (await _membershipServiceApi.AuthAuthApiService.Setting(new BaseModel
                        {Id = appointment.RepresentativeId})).Data
                    : null;

                var appointmentModel = new AppointmentCoreModel
                {
                    Id = appointment.Id,
                    Title = appointment.Title,
                    Description = appointment.Description,
                    User = user,
                    Representative = representative,
                    Date = appointment.Date,
                    Type = appointment.Type,
                    CreationDate = appointment.CreationDate,
                    Duration = appointment.Duration,
                    Invoice = appointment.Invoice != null
                        ? new InvoiceCoreModel
                        {
                            Id = appointment.Invoice.Id,
                            Amount = appointment.Invoice.Amount,
                            Enabled = appointment.Invoice.Enabled,
                            CreationDate = appointment.Invoice.CreationDate,
                            Description = appointment.Invoice.Description,
                            Title = appointment.Invoice.Title
                        }
                        : null,

                    Approved = appointment.Approved
                };
                return Result<AppointmentCoreModel>.Successful(appointmentModel);
            });

        public Task<ResultList<AppointmentCoreModel>> List(FilterModel model)
            => ResultList<AppointmentCoreModel>.TryAsync(async () =>
            {
                var isAdmin = generalDataService.User.Permissions.Any(p => p == (int) PermissionType.Admin);
                var appointmentes = new List<Appointment>();
                if (isAdmin)
                    appointmentes = (await _repository.ListAsNoTrackingAsync<Appointment>(i =>
                            (model.DateTime == null ||
                             model.DateTime.Value.ToString("d") == i.Date.ToString("d")) &&
                            (string.IsNullOrEmpty(model.Keyword) || model.Keyword == i.Title), a => a.Invoice))
                        .Data
                        ?.ToList();
                else
                    appointmentes = (await _repository.ListAsNoTrackingAsync<Appointment>(i =>
                            i.UserId == generalDataService.User.Id &&
                            (model.DateTime == null ||
                             model.DateTime.Value.ToString("d") == i.Date.ToString("d")) &&
                            (string.IsNullOrEmpty(model.Keyword) || model.Keyword == i.Title), a => a.Invoice))
                        .Data
                        ?.ToList();

                if (appointmentes == null)
                    return ResultList<AppointmentCoreModel>.Failed(Error.WithCode(ErrorCodes.NotFound));

                var users = (await _membershipServiceApi.SystemUserApiService.ListByIds(appointmentes
                    .Select(a => a.UserId)
                    .Union(appointmentes
                        .Select(a => a.RepresentativeId != null ? a.RepresentativeId.Value : Guid.Empty)
                        .Where(a => a != Guid.Empty)).ToList())).Data;

                var appointmentModels = appointmentes.Select(appointment => new AppointmentCoreModel
                {
                    Id = appointment.Id,
                    Title = appointment.Title,
                    Description = appointment.Description,
                    User = users.FirstOrDefault(u => u.Id == appointment.UserId),
                    Representative = users.FirstOrDefault(u => u.Id == appointment.RepresentativeId),
                    CreationDate = appointment.CreationDate,
                    Date = appointment.Date,
                    Type = appointment.Type,
                    Duration = appointment.Duration,
                    Invoice = appointment.Invoice != null
                        ? new InvoiceCoreModel
                        {
                            Id = appointment.Invoice.Id,
                            Amount = appointment.Invoice.Amount,
                            Enabled = appointment.Invoice.Enabled,
                            CreationDate = appointment.Invoice.CreationDate,
                            Description = appointment.Invoice.Description,
                            Title = appointment.Invoice.Title
                        }
                        : null,
                    Approved = appointment.Approved
                }).OrderBy(a=>a.CreationDate).Reverse().ToList();
                return ResultList<AppointmentCoreModel>.Successful(appointmentModels);
            });

        public Task<Result<AppointmentCoreModel>> Edit(UpdateAppointmentModel model)
            => Result<AppointmentCoreModel>.TryAsync(async () =>
            {
                var appointment =
                    (await _repository.FirstOrDefaultAsync<Appointment>(i => i.Id == model.Id, a => a.Invoice))
                    .Data;
                if (appointment == null)
                    return Result<AppointmentCoreModel>.Failed(Error.WithCode(ErrorCodes.NotFound));
                var isAdmin = generalDataService.User.Permissions.Any(p => p == (int) PermissionType.Admin);

                if (!appointment.Approved && appointment.Invoice != null && !appointment.Invoice.IsPaid)
                    return Result<AppointmentCoreModel>.Failed(Error.WithData(1000,
                        new[] {"You cant Approved VIP consultation without the user paying it !"}));
                appointment.Approved = model.Approved;
                appointment.RepresentativeId = isAdmin ? generalDataService.User.Id : Guid.Empty;
                appointment.Date = model.Date;
                appointment.Type = model.Type;
                appointment.Duration = model.Duration;


                var userIds = new List<Guid> {appointment.UserId};
                if (appointment.RepresentativeId.Value != Guid.Empty)
                    userIds.Add(appointment.RepresentativeId.Value);
                var users = (await _membershipServiceApi.SystemUserApiService.ListByIds(userIds)).Data;

                await _repository.CommitAsync();
                var appointmentModel = new AppointmentCoreModel
                {
                    Id = appointment.Id,
                    Title = appointment.Title,
                    Description = appointment.Description,
                    User = users.FirstOrDefault(u => u.Id == appointment.UserId),
                    Representative = appointment.RepresentativeId != Guid.Empty
                        ? users.FirstOrDefault(u => u.Id == appointment.RepresentativeId)
                        : null,
                    Date = appointment.Date,
                    Duration = appointment.Duration,
                    Type = appointment.Type,
                    Invoice = appointment.Invoice != null
                        ? new InvoiceCoreModel
                        {
                            Id = appointment.Invoice.Id,
                            Amount = appointment.Invoice.Amount,
                            Enabled = appointment.Invoice.Enabled,
                            CreationDate = appointment.Invoice.CreationDate,
                            Description = appointment.Invoice.Description,
                            Title = appointment.Invoice.Title
                        }
                        : null,
                    CreationDate = appointment.CreationDate,
                    Approved = appointment.Approved
                };


//                _coreSmtpClient.Send(appointmentModel.User.Email,
//                    $"Dear  {appointmentModel.User.Firstname} {appointmentModel.User.Lastname} ,\n Your Appointment is schedule  has changed in the system  , please check your new appointment details  . \n Best Regards",
//                    "Your Appointment ");

//                await _messageBiz.Add(new CreateMessageModel
//                {
//                    Title = "Your Appointment",
//                    Body =
//                        $"Dear  {appointmentModel.User.Firstname} {appointmentModel.User.Lastname} ,\n Your Appointment is schedule  has changed in the system  , please check your new appointment details  . \n Best Regards",
//                    ToUser = generalDataService.User.Id,
//                    Priority = MessagePriority.High
//                });

                return Result<AppointmentCoreModel>.Successful(appointmentModel);
            });
    }
}