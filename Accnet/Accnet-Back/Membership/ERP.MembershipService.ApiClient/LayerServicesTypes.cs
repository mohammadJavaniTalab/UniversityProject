using System.Collections.Generic;
using TR = CoreLib.TypeRegister;

namespace ERP.MembershipService.ApiClient
{
    public class LayerServicesTypes
    {
        public IEnumerable<TR> GetServices()
            => new List<TR> {
                new TR(typeof(System.ILinkedUserApiService), typeof(System.LinkedUserApiService)),
                new TR(typeof(System.IUserApiService), typeof(System.UserApiService)),
                new TR(typeof(Membership.IFeatureApiService), typeof(Membership.FeatureApiService)),
                new TR(typeof(Membership.ILinkedUserApiService), typeof(Membership.LinkedUserApiService)),
                new TR(typeof(Membership.IPermissionApiService), typeof(Membership.PermissionApiService)),
                new TR(typeof(Membership.IRelativeApiService), typeof(Membership.RelativeApiService)),
                new TR(typeof(Membership.IRoleApiService), typeof(Membership.RoleApiService)),
                new TR(typeof(Membership.IUserApiService), typeof(Membership.UserApiService)),
                new TR(typeof(Auth.IAuthApiService), typeof(Auth.AuthApiService)),
            };
    }
}
