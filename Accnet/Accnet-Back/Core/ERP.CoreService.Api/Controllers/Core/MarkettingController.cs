using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Services;
using ERP.CoreService.Core.Base;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Invoice;
using ERP.CoreService.Core.Models.UserSurvey;
using ERP.CoreService.DataAccess.EFModels;
using ERP.MembershipService.ApiClient;
using Microsoft.AspNetCore.Mvc;

namespace ERP.CoreService.Api.Controllers.Core
{
    [Route("api/marketing")]
    [ApiController]
    public class MarkettingController
    {
        private readonly IRepository _repository;
        private readonly IMembershipServiceApi _membershipServiceApi;

        public MarkettingController(IRepository repository, IMembershipServiceApi membershipServiceApi)
        {
            _repository = repository;
            _membershipServiceApi = membershipServiceApi;
        }

        [HttpPost("list")]
        public async Task<ResultList<MarketingModel>> List(FilterModel model)
        {
            var taxes = await _repository.ListAsNoTrackingAsync<Tax>(t =>
                (model.UserId == null || model.UserId.Value == t.UserId) && t.UserSurvey.UserId == t.UserId);
            var invoices =
                await _repository.ListAsNoTrackingAsync<Invoice>(t =>
                    model.UserId == null || model.UserId.Value == t.UserId);
            var appointments =
                await _repository.ListAsNoTrackingAsync<Appointment>(
                    t => model.UserId == null || model.UserId.Value == t.UserId, a => a.Invoice);

            if (!taxes.Data.Any() && !invoices.Data.Any() && !appointments.Data.Any())
                return ResultList<MarketingModel>.Successful(new List<MarketingModel>());

            var userId = taxes.Data.Select(t => t.UserId).Union(invoices.Data.Select(i => i.UserId))
                .Union(appointments.Data.Select(a => a.UserId)).Distinct().ToList();

            var users = await _membershipServiceApi.SystemUserApiService.FullListByIds(userId);

            return ResultList<MarketingModel>.Successful(users.Data.OrderBy(u => u.CreationDate).Reverse()
                .Skip(model.PageNumber * model.PageSize).Take(model.PageSize).Select(u =>
                {
                    return new MarketingModel
                    {
                        Username = u.Username,
                        Appointments = appointments.Data?.Where(a => a.UserId == u.Id)?
                            .Select(a =>
                                a.Duration > 15
                                    ? a.Invoice.IsPaid ? "Paid VIP Consultation" : "Unpaid VIP Consultation"
                                    : "Complementry Consultation")
                            .ToList(),
                        Taxes = (bool) taxes.Data?.Where(a => a.UserId == u.Id)
                            ?.Select(t => ((TaxStatus) t.Status).ToString()).Any()
                            ? taxes.Data?.Where(a => a.UserId == u.Id)
                                ?.Select(t => ((TaxStatus) t.Status).ToString())
                                .ToList()
                            : new List<string>() {"Registered"},
                        Invoices = invoices.Data?.Where(a => a.UserId == u.Id)?
                            .Select(t => ((InvoiceStatus) t.Status).ToString()).ToList()
                    };
                }),users.Data.Count,model.PageNumber,model.PageSize);
        }
    }
}