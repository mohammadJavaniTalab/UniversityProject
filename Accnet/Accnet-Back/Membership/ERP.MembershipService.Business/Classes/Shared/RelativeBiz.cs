using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CoreLib;
using CoreLib.Services;
using ERP.MembershipService.Business.Interfaces.Shared;
using ERP.MembershipService.Core.Models;
using ERP.MembershipService.Core.Models.User;
using ERP.MembershipService.DataAccess.EFModels;

namespace ERP.MembershipService.Business.Classes.Shared
{
    public class RelativeBiz : Base, IRelativeBiz
    {
        private readonly IRepository _repository;

        public RelativeBiz(IMapperService mapper, IRepository repository, IMapper autoMapper,
            ILogger logger, IGeneralDataService generalDataService) : base(mapper, logger,
            generalDataService, autoMapper)
        {
            _repository = repository;
        }

        public Task<Result<Guid>> Add(CreateRelativeModel model)
            => Result<Guid>.TryAsync(async () =>
            {
                var relative = new Relatives
                {
                    Id = Guid.NewGuid(),
                    UserId = generalDataService.User.Id,
                    Firstname = model.Firstname,
                    Lastname = model.Lastname,
                    DateOfBirth = model.DateOfBirth,
                    RelationType = model.RelationType,
                    SinNumber = model.SinNumber
                };

                _repository.Add(relative);
                await _repository.CommitAsync();
                return Result<Guid>.Successful(relative.Id);
            });

        public Task<Result<IList<RelativeModel>>> ListByUser(BaseModel model)
            => Result<IList<RelativeModel>>.TryAsync(async () =>
            {
                var relatives = await _repository.ListAsNoTrackingAsync<Relatives>(r => r.UserId == model.Id);
                if (!relatives.Success || relatives.Data == null || !relatives.Data.Any())
                    return Result<IList<RelativeModel>>.Successful(new List<RelativeModel>());

                return Result<IList<RelativeModel>>.Successful(relatives.Data.Select(r => new RelativeModel
                {
                    Id = r.Id,
                    Firstname = r.Firstname,
                    Lastname = r.Lastname,
                    DateOfBirth = r.DateOfBirth,
                    RelationType = r.RelationType,
                    SinNumber = r.SinNumber
                }).ToList());
            });

        public Task<Result<Guid>> Delete(BaseModel model)
            => Result<Guid>.TryAsync(async () =>
            {
                var relative = await _repository.FirstOrDefaultAsync<Relatives>(r => r.Id == model.Id);

                if (!relative.Success || relative.Data == null)
                    return Result<Guid>.Failed(Error.WithData(1000, new[] {"relative not found"}));

                _repository.Remove(relative.Data);
                await _repository.CommitAsync();
                return Result<Guid>.Successful(model.Id.Value);
            });
    }
}