using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CoreLib;
using CoreLib.Models;
using CoreLib.Services;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Appointment;
using ERP.CoreService.DataAccess.EFModels;

namespace ERP.CoreService.Business.Classes
{
    public class AppointmentExceptionBiz : Base, IAppointmentExceptionBiz
    {
        private readonly IRepository _repository;

        public AppointmentExceptionBiz(IMapperService mapper, IRepository repository, IMapper autoMapper,
            ILogger logger, IGeneralDataService generalDataService) : base(mapper, logger,
            generalDataService, autoMapper)
        {
            _repository = repository;
        }

        public async Task<Result<AppointmentExceptionModel>> Edit(UpdateAppointmentExceptionModel model)
        {
            var result = await _repository.FirstOrDefaultAsync<AppointmentException>(a => a.Id == model.Id);
            if (!result.Success || result.Data == null)
                return Result<AppointmentExceptionModel>.Failed(Error.WithData(1000,
                    new[] {"AppointmentException Not Found"}));
            result.Data.FromDate = model.FromDate;
            result.Data.ToDate = model.ToDate;

            await _repository.CommitAsync();

            return Result<AppointmentExceptionModel>.Successful(new AppointmentExceptionModel
            {
                Id = model.Id,
                FromDate = model.FromDate,
                ToDate = model.ToDate
            });
        }

        public async Task<Result<bool>> Delete(BaseCoreModel model)
        {
            var result = await _repository.FirstOrDefaultAsync<AppointmentException>(a => a.Id == model.Id);
            if (!result.Success || result.Data == null)
                return Result<bool>.Failed(Error.WithData(1000,
                    new[] {"AppointmentException Not Found"}));

            _repository.Remove(result.Data);
            await _repository.CommitAsync();

            return Result<bool>.Successful(true);
        }

        public async Task<ResultList<AppointmentExceptionModel>> List(FilterModel model)
        {
            var result =
                await _repository.ListAsNoTrackingAsync<AppointmentException>(new PagingModel
                    {PageSize = 1000, PageNumber = 0});
            if (!result.Success || result.Items == null)
                return ResultList<AppointmentExceptionModel>.Failed(Error.WithData(1000,
                    new[] {"AppointmentException Not Found"}));

            return ResultList<AppointmentExceptionModel>.Successful(result.Items.Take(model.PageSize)
                .Skip(model.PageSize * model.PageNumber).Select(a => new AppointmentExceptionModel
                {
                    Id = a.Id,
                    FromDate = a.FromDate,
                    ToDate = a.ToDate
                }).ToList(), result.TotalCount, model.PageNumber, model.PageSize);
        }

        public async Task<Result<bool>> ValidateAppointment(DateTime appointmentDate)
        {
            var result = await _repository.FirstOrDefaultAsNoTrackingAsync<AppointmentException>(a =>
                a.FromDate < appointmentDate && a.ToDate > appointmentDate);

            if (result.Success && result.Data != null)
                return Result<bool>.Successful(true); // found an exception
            return Result<bool>.Successful(false);
        }

        public async Task<Result<Guid>> Add(CreateAppointmentExceptionModel model)
        {
            var id=Guid.NewGuid();
            _repository.Add(new AppointmentException
            {
                Id = id, FromDate = model.FromDate, ToDate = model.ToDate
            });
            await _repository.CommitAsync();
            
            return Result<Guid>.Successful(id);
        }
    }
}