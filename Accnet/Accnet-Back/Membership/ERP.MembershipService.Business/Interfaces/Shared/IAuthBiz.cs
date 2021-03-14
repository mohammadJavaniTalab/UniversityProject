using System;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Services.Models;
using ERP.MembershipService.Core.Models;
using ERP.MembershipService.Core.Models.Auth;
using ERP.MembershipService.DataAccess.EFModels;
using User = ERP.MembershipService.DataAccess.EFModels.User;

namespace ERP.MembershipService.Business.Interfaces.Shared
{
    public interface IAuthBiz
    {
        Task<Result<object>> GenerateToken(LoginModel model);
        Task<Result<object>> GenerateToken(Guid userId);
        Task<Result<bool>> ChangePassword(ChangePasswordModel model);
        string GenerateJsonWebToken(User user,Role role);
    }
}
