using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CoreLib;
using CoreLib.Models;
using CoreLib.Services;
using ERP.MembershipService.Business.Interfaces.Shared;
using ERP.MembershipService.Core.Base;
using ERP.MembershipService.Core.Models;
using ERP.MembershipService.Core.Models.Feature;
using ERP.MembershipService.Core.Models.Permission;
using ERP.MembershipService.DataAccess.EFModels;

namespace ERP.MembershipService.Business.Classes.Shared
{
    public class FeatureBiz : Base, IFeatureBiz
    {
        private readonly IRepository _repository;

        public FeatureBiz(IMapperService mapper, IRepository repository, IMapper autoMapper,
            ILogger logger, IGeneralDataService generalDataService) : base(mapper, logger,
            generalDataService, autoMapper)
        {
            _repository = repository;
        }

        public Task<Result<FeatureModel>> Get(BaseModel model)
            => Result<FeatureModel>.TryAsync(async () =>
            {
                var result = await _repository.FirstOrDefaultAsNoTrackingAsync<Feature>(r => r.Id == model.Id.Value,
                    r =>
                        r.RoleFeature.Select(rf => rf.Feature.FeaturePermission.Select(fp => fp.Permission)));
                if (!result.Success || result.Data == null)
                    return Result<FeatureModel>.Failed(Error.WithCode(ErrorCodes.NotFound));
                var feature = result.Data;
                return Result<FeatureModel>.Successful(new FeatureModel
                {
                    Id = feature.Id,
                    Name = feature.Name,
                    Permissions = feature.FeaturePermission?.Select(rf => new PermissionModel
                    {
                        Id = (PermissionType) rf.Permission.Id,
                        Name = rf.Permission.Name
                    }).ToList()
                });
            });

        public Task<Result<Guid>> Add(CreateFeatureModel model)
            => Result<Guid>.TryAsync(async () =>
            {
                var duplicateFeature =
                    await _repository.FirstOrDefaultAsNoTrackingAsync<Feature>(f => f.Name == model.Name);
                if (duplicateFeature.Success && duplicateFeature.Data != null)
                    return Result<Guid>.Failed(Error.WithData(1000, new[] {"Duplicate Feature Name"}));

                var permissionIds = model.Permissions;
                var resultList = await _repository.ListAsync<Permission>(f => permissionIds.Contains(f.Id));
                if (!resultList.Success || resultList.Data == null)
                    return Result<Guid>.Failed(Error.WithCode(ErrorCodes.InvalidModel));

                var permissions = resultList.Data;
                if (permissions.Count != permissionIds.Count())
                    return Result<Guid>.Failed(Error.WithCode(ErrorCodes.InvalidModel));

                var featureId = Guid.NewGuid();
                var feature = new Feature
                {
                    Id = featureId, Name = model.Name,
                    FeaturePermission = permissions.Select(f => new FeaturePermission
                    {
                        FeatureId = featureId, PermissionId = f.Id, Id = Guid.NewGuid()
                    }).ToList()
                };
                _repository.Add(feature);
                await _repository.CommitAsync();
                return Result<Guid>.Successful(featureId);
            });


        public Task<ResultList<FeatureModel>> List(FilterModel model)
            => ResultList<FeatureModel>.TryAsync(async () =>
            {
                var resultList = await _repository.ListAsNoTrackingAsync<Feature>(
                    f =>
                        string.IsNullOrEmpty(model.Keyword) || f.Name.ToLower().Contains(model.Keyword.ToLower()),
                    new PagingModel {PageNumber = 0, PageSize = 200}, r =>
                        r.FeaturePermission.Select(fp => fp.Permission));
                if (!resultList.Success || resultList.Items == null)
                    return ResultList<FeatureModel>.Failed(Error.WithCode(ErrorCodes.NotFound));
                var features = resultList.Items;
                return ResultList<FeatureModel>.Successful(features.OrderBy(f => f.Name).Take(model.PageSize)
                    .Skip(model.PageSize * model.PageNumber).Select(feature => new FeatureModel
                    {
                        Id = feature.Id,
                        Name = feature.Name,
                        Permissions = feature.FeaturePermission?.Select(rf => new PermissionModel
                        {
                            Id = (PermissionType) rf.Permission.Id,
                            Name = rf.Permission.Name,
                        }).ToList()
                    }), resultList.TotalCount, model.PageNumber, model.PageSize);
            });

        public Task<Result<FeatureModel>> Edit(UpdateFeatureModel model)
            => Result<FeatureModel>.TryAsync(async () =>
            {
                var duplicateFeature =
                    await _repository.FirstOrDefaultAsNoTrackingAsync<Feature>(f =>
                        f.Id != model.Id && f.Name == model.Name);
                if (duplicateFeature.Success && duplicateFeature.Data != null)
                    return Result<FeatureModel>.Failed(Error.WithData(1000, new[] {"Duplicate Feature Name"}));

                var result = await _repository.FirstOrDefaultAsync<Feature>(r => r.Id == model.Id, r =>
                    r.RoleFeature.Select(rf => rf.Feature.FeaturePermission.Select(fp => fp.Permission)));

                if (!result.Success || result.Data == null)
                    return Result<FeatureModel>.Failed(Error.WithCode(ErrorCodes.NotFound));

                var permissionIds = model.Permissions;
                var resultList = await _repository.ListAsync<Permission>(f => permissionIds.Contains(f.Id));
                if (!resultList.Success || resultList.Data == null)
                    return Result<FeatureModel>.Failed(Error.WithCode(ErrorCodes.InvalidModel));

                var permissions = resultList.Data;
                if (permissions.Count != permissionIds.Count())
                    return Result<FeatureModel>.Failed(Error.WithCode(ErrorCodes.InvalidModel));

                var feature = result.Data;
                feature.Name = model.Name;
                _repository.RemoveRange(feature.FeaturePermission);
                feature.FeaturePermission = model.Permissions.Select(f => new FeaturePermission
                {
                    FeatureId = feature.Id, PermissionId = f
                }).ToList();
                await _repository.CommitAsync();
                return Result<FeatureModel>.Successful(_autoMapper.Map<FeatureModel>(feature));
            });
    }
}