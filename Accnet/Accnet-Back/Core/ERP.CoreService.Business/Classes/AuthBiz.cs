using System.Threading.Tasks;
using AutoMapper;
using CoreLib;
using CoreLib.Services;
using ERP.CoreService.Business.Interfaces;
using ERP.MembershipService.ApiClient;
using ERP.MembershipService.ApiClient.Models;
using ERP.MembershipService.ApiClient.Models.Auth;
using ERP.MembershipService.ApiClient.Models.User;

namespace ERP.CoreService.Business.Classes
{
    public class AuthBiz : Base, IAuthBiz
    {
        private readonly IMembershipServiceApi _membershipServiceApi;
        public AuthBiz(
            IMapperService mapper,
            ISerializerService serializer,
            ILogger logger,
            IAppSettings setting,
            IMapper autoMapper,
            IMembershipServiceApi membershipServiceApi,
            IGeneralDataService generalDataService) : base(mapper, logger, generalDataService,autoMapper)
        {
            _membershipServiceApi = membershipServiceApi;
        }
        
        public Task<Result<object>> Login(LoginModel model)
        {
            return Result<object>.TryAsync(async () => await _membershipServiceApi.AuthAuthApiService.GenerateToken(model));
        }
        
        public Task<Result<string>> RefreshToken(FullUserModel model)
        {
            return Result<string>.TryAsync(async () =>
            {
                var result = await _membershipServiceApi.AuthAuthApiService.RefreshToken(new BaseModel{Id = model.Id});
                return Result<string>.Successful(result.Data.ToString());
            });
        }
    }
}