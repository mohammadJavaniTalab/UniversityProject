using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CoreLib;
using CoreLib.Services;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Business.Services.BankGateway;
using ERP.CoreService.Business.Services.Email;
using ERP.CoreService.Business.Services.Sms;
using ERP.CoreService.Core.Base;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Invoice;
using ERP.CoreService.Core.Models.Message;
using ERP.CoreService.Core.Models.Paypal;
using ERP.CoreService.DataAccess.EFModels;
using ERP.MembershipService.ApiClient;
using ERP.MembershipService.ApiClient.Models;
using InvoiceStatus = ERP.CoreService.Core.Base.InvoiceStatus;
using TaxStatus = ERP.CoreService.Core.Base.TaxStatus;

namespace ERP.CoreService.Business.Classes
{
    public class PaypalBiz : Base, IPaypalBiz
    {
        private readonly IRepository _repository;
        private readonly PaypalHttpClient _paypalHttpClient;
        private readonly CoreSmtpClient _coreSmtpClient;
        private readonly SmsHttpClient _smsHttpClient;
        private readonly IMembershipServiceApi _membershipServiceApi;
        private readonly IMessageBiz _messageBiz;

        public PaypalBiz(IMapperService mapper, IRepository repository, IMapper autoMapper,
            PaypalHttpClient paypalHttpClient, CoreSmtpClient coreSmtpClient,
            IMessageBiz messageBiz,
            IMembershipServiceApi membershipServiceApi, SmsHttpClient smsHttpClient,
            ILogger logger, IGeneralDataService generalDataService) : base(
            mapper, logger,
            generalDataService, autoMapper)
        {
            _messageBiz = messageBiz;
            _smsHttpClient = smsHttpClient;
            _membershipServiceApi = membershipServiceApi;
            _coreSmtpClient = coreSmtpClient;
            _paypalHttpClient = paypalHttpClient;
            _repository = repository;
        }

        public async Task<Result<string>> CreateOrder(BaseCoreModel coreModel)
        {
            var invoice = await _repository.FirstOrDefaultAsync<Invoice>(i => i.Id == coreModel.Id,
                i => i.UserSurvey.Select(us => us.Tax), i => i.PaypalOrder);
            if (!invoice.Success || invoice.Data == null)
                return Result<string>.Failed(Error.WithData(1000, new[] {"Invoice not found"}));

            var result = await _paypalHttpClient.Order(invoice.Data.Id.ToString(), invoice.Data.Amount);
            if (!result.Success || result.Data == null)
                return Result<string>.Failed(result.Error);
            var paypalOrderStatus = invoice.Data.PaypalOrder?.Status;
            invoice.Data.PaypalOrder = result.Data;
            if (!string.IsNullOrEmpty(paypalOrderStatus))
                invoice.Data.PaypalOrder.Status = "#" + invoice.Data.PaypalOrder.Status;
            await _repository.CommitAsync();
            return Result<string>.Successful(result.Data.ApproveLink);
        }

        public async Task<Result<InvoiceCoreModel>> CaptureOrder(CaptureOrderModel model)
        {
            var invoice = await _repository.FirstOrDefaultAsync<Invoice>(i => i.Id == model.InvoiceId,
                i => i.PaypalOrder, i => i.Appointment, i => i.UserSurvey.Select(us => us.Tax));
            if (!invoice.Success || invoice.Data == null)
                return Result<InvoiceCoreModel>.Failed(Error.WithData(1000, new[] {"Invoice not found"}));

            var capture = await _paypalHttpClient.Capture(invoice.Data.PaypalOrder.OrderId);
            if (!capture.Success)
                return Result<InvoiceCoreModel>.Failed(Error.WithData(1000, new[] {"Could not capture order"}));

            invoice.Data.IsPaid = true;
            invoice.Data.Enabled = true;
            invoice.Data.Status = (byte) InvoiceStatus.Paid;


            await _repository.CommitAsync();

            var profile =
                await _membershipServiceApi.AuthAuthApiService.Profile(new BaseModel {Id = invoice.Data.UserId});

            try
            {
                if (invoice.Data.UserSurvey != null && invoice.Data.UserSurvey.Any())
                {
                    invoice.Data.UserSurvey.FirstOrDefault().Tax.ToList()
                        .ForEach(t => t.Status = (byte) TaxStatus.TaxProcessPending);
                    await _repository.CommitAsync();
                    _coreSmtpClient.SendPaypalPayment(profile.Data.Email,
                        profile.Data.Firstname + " " + profile.Data.Lastname);

                }

                if (invoice.Data.Appointment != null && invoice.Data.Appointment.Any())
                {
                    _coreSmtpClient.SendVipConsultation(profile.Data.Email,
                        profile.Data.Firstname+" "+profile.Data.Lastname, invoice.Data.Appointment.FirstOrDefault().Date.ToString("F"));
                    _coreSmtpClient.SendAppointmentBookNotif("notifications@accnetonline.com",
                        profile.Data.Firstname + " " + profile.Data.Lastname,
                        invoice.Data.Appointment.FirstOrDefault().Date.ToString("F"));


                    await _messageBiz.Add(new CreateMessageModel
                    {
                        Title = "Your Appointment",
                        Body =
                            $"Your appointment has been confirmed. One of our AccNet representatives will reach out to you at the scheduled time : {invoice.Data.Appointment.FirstOrDefault().Date.ToString("F")} (PACIFIC STANDARD TIME)",
                        ToUser = profile.Data.Id,
                        Priority = MessagePriority.High
                    });
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                Console.WriteLine(e.Message);
                Console.WriteLine(e.StackTrace);
            }

            _coreSmtpClient.SendPaysForInvoicesNotif("notifications@accnetonline.com", profile.Data.Username,
                DateTime.Now.ToString("F"));

//            var result =
//                await _membershipServiceApi.SystemUserApiService.Get(new MembershipService.ApiClient.Models.BaseModel
//                    {Id = generalDataService.User.Id});
//            _coreSmtpClient.SendInvoice(invoice.Data, result.Data);


            return Result<InvoiceCoreModel>.Successful(new InvoiceCoreModel
            {
                Id = invoice.Data.Id,
                Amount = invoice.Data.Amount,
                Description = invoice.Data.Description,
                Title = invoice.Data.Title,
                Status = (InvoiceStatus) invoice.Data.Status,
                CreationDate = invoice.Data.CreationDate,
                Enabled = invoice.Data.Enabled,
            });
        }
    }
}