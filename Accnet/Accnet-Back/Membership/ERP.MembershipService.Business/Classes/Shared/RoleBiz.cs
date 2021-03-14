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
using ERP.MembershipService.Core.Models.Role;
using ERP.MembershipService.DataAccess.EFModels;

namespace ERP.MembershipService.Business.Classes.Shared
{
    public class RoleBiz : Base, IRoleBiz
    {
        private readonly IRepository _repository;

        public RoleBiz(IMapperService mapper, IRepository repository, IMapper autoMapper,
            ILogger logger, IGeneralDataService generalDataService) : base(mapper, logger,
            generalDataService, autoMapper)
        {
            _repository = repository;
        }

        public Task<Result<RoleModel>> Get(BaseModel model)
            => Result<RoleModel>.TryAsync(async () =>
            {
                var result = await _repository.FirstOrDefaultAsNoTrackingAsync<Role>(r => r.Id == model.Id.Value, r =>
                    r.RoleFeature.Select(rf => rf.Feature.FeaturePermission.Select(fp => fp.Permission)));
                if (!result.Success || result.Data == null)
                    return Result<RoleModel>.Failed(Error.WithCode(ErrorCodes.NotFound));
                var role = result.Data;
                return Result<RoleModel>.Successful(new RoleModel
                {
                    Id = role.Id,
                    Name = role.Name,
                    Feature = role.RoleFeature?.Select(rf => new FeatureModel
                    {
                        Id = rf.Feature.Id,
                        Name = rf.Feature.Name,
                        Permissions = rf.Feature?.FeaturePermission?.Select(fp => new PermissionModel
                        {
                            Id = (PermissionType) fp.Permission.Id,
                            Name = fp.Permission.Name
                        }).ToList()
                    }).ToList()
                });
            });

        public Task<Result<Guid>> Add(CreateRoleModel model)
            => Result<Guid>.TryAsync(async () =>
            {
                var featureIds = model.Feature;
                var resultList = await _repository.ListAsync<Feature>(f => featureIds.Contains(f.Id));
                if (!resultList.Success || resultList.Data == null)
                    return Result<Guid>.Failed(Error.WithCode(ErrorCodes.InvalidModel));

                var features = resultList.Data;
                if (features.Count != featureIds.Count())
                    return Result<Guid>.Failed(Error.WithCode(ErrorCodes.InvalidModel));

                var roleId = Guid.NewGuid();
                var role = new Role
                {
                    Id = roleId, Name = model.Name, RoleFeature = features.Select(f => new RoleFeature
                    {
                        RoleId = roleId, FeatureId = f.Id, Id = Guid.NewGuid()
                    }).ToList()
                };
                _repository.Add(role);
                await _repository.CommitAsync();
                return Result<Guid>.Successful(roleId);
            });

        public Task<ResultList<RoleModel>> List(FilterModel model)
            => ResultList<RoleModel>.TryAsync(async () =>
            {
                var resultList = await _repository.ListAsNoTrackingAsync<Role>(
                    r => string.IsNullOrEmpty(model.Keyword) || r.Name.ToLower().Contains(model.Keyword),
                    new PagingModel {PageNumber = 0, PageSize = 100}, r =>
                        r.RoleFeature.Select(rf => rf.Feature.FeaturePermission.Select(fp => fp.Permission)));
                if (!resultList.Success || resultList.Items == null)
                    return ResultList<RoleModel>.Failed(Error.WithCode(ErrorCodes.NotFound));
                var roles = resultList.Items;
                return ResultList<RoleModel>.Successful(roles.OrderBy(r => r.Name).Take(model.PageSize)
                    .Skip(model.PageNumber * model.PageSize).Select(role => new RoleModel
                    {
                        Id = role.Id,
                        Name = role.Name,
                        Feature = role.RoleFeature?.Select(rf => new FeatureModel
                        {
                            Id = rf.Feature.Id,
                            Name = rf.Feature.Name,
                            Permissions = rf.Feature?.FeaturePermission?.Select(fp => new PermissionModel
                            {
                                Id = (PermissionType) fp.Permission.Id,
                                Name = fp.Permission.Name
                            }).ToList()
                        }).ToList()
                    }), resultList.TotalCount, model.PageNumber, model.PageSize);
            });

        public Task<Result<RoleModel>> Edit(UpdateRoleModel model)
            => Result<RoleModel>.TryAsync(async () =>
            {
                var result = await _repository.FirstOrDefaultAsync<Role>(r => r.Id == model.Id, r =>
                    r.RoleFeature.Select(rf => rf.Feature.FeaturePermission.Select(fp => fp.Permission)));

                if (!result.Success || result.Data == null)
                    return Result<RoleModel>.Failed(Error.WithCode(ErrorCodes.NotFound));

                var featureIds = model.Feature;
                var resultList = await _repository.ListAsync<Feature>(f => featureIds.Contains(f.Id));
                if (!resultList.Success || resultList.Data == null)
                    return Result<RoleModel>.Failed(Error.WithCode(ErrorCodes.InvalidModel));

                var features = resultList.Data;
                if (features.Count != featureIds.Count())
                    return Result<RoleModel>.Failed(Error.WithCode(ErrorCodes.InvalidModel));

                var role = result.Data;
                role.Name = model.Name;
                _repository.RemoveRange(role.RoleFeature);
                role.RoleFeature = model.Feature.Select(f => new RoleFeature
                {
                    RoleId = role.Id, FeatureId = f, Id = Guid.NewGuid()
                }).ToList();
                await _repository.CommitAsync();
                return Result<RoleModel>.Successful(_autoMapper.Map<RoleModel>(role));
            });
    }
}