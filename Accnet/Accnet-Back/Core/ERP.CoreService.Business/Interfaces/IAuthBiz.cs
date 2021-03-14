using System.Threading.Tasks;
using CoreLib;
using ERP.MembershipService.ApiClient.Models;
using ERP.MembershipService.ApiClient.Models.Auth;
using ERP.MembershipService.ApiClient.Models.User;

namespace ERP.CoreService.Business.Interfaces
{
    public interface IAuthBiz
    {
        Task<Result<object>> Login(LoginModel model);
        Task<Result<string>> RefreshToken(FullUserModel model);
    }
}