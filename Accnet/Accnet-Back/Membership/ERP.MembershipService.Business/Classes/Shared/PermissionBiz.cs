using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CoreLib;
using CoreLib.Models;
using CoreLib.Services;
using ERP.MembershipService.Business.Interfaces.Shared;
using ERP.MembershipService.Core.Base;
using ERP.MembershipService.Core.Models;
using ERP.MembershipService.Core.Models.Permission;
using ERP.MembershipService.DataAccess.EFModels;

namespace ERP.MembershipService.Business.Classes.Shared
{
    public class PermissionBiz : Base , IPermissionBiz
    {
        private readonly IRepository _repository;

        public PermissionBiz(IMapperService mapper, IRepository repository,IMapper autoMapper,
            ILogger logger, IGeneralDataService generalDataService) : base(mapper, logger,
            generalDataService,autoMapper)
        {
            _repository = repository;
        }


        public Task<ResultList<PermissionModel>> List(PagingModel model)
            => ResultList<PermissionModel>.TryAsync(async () =>
            {
                var resultList = await _repository.ListAsNoTrackingAsync<Permission>(model);
                if (!resultList.Success || resultList.Items == null)
                    return ResultList<PermissionModel>.Failed(Error.WithCode(ErrorCodes.NotFound));
                var permissions = resultList.Items;
                return ResultList<PermissionModel>.Successful(permissions.Select(p => new PermissionModel
                {
                    Id = (PermissionType) p.Id,
                    Name = p.Name,
                }), resultList.TotalCount, resultList.PageNumber, resultList.PageSize);
            });
    }
}