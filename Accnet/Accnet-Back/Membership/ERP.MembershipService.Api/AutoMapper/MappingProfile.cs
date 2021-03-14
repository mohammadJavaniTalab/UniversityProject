using AutoMapper;
using ERP.MembershipService.Core.Base;
using ERP.MembershipService.Core.Models.Feature;
using ERP.MembershipService.Core.Models.Organization;
using ERP.MembershipService.Core.Models.Role;
using ERP.MembershipService.Core.Models.User;
using ERP.MembershipService.DataAccess.EFModels;

namespace ERP.MembershipService.Api.AutoMapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            #region User

            CreateMap<LightUserModel, User>();

            CreateMap<User, LightUserModel>();


            CreateMap<UpdateUserModel, User>();

            CreateMap<CreateUserModel, User>();

            #endregion

            #region Role

            CreateMap<RoleModel, Role>();

            CreateMap<Role, RoleModel>();

            CreateMap<UpdateRoleModel, Role>();

            CreateMap<CreateRoleModel, Role>();

            #endregion

            #region Feature

            CreateMap<FeatureModel, Feature>();

            CreateMap<Feature, FeatureModel>();

            CreateMap<UpdateFeatureModel, Feature>();

            CreateMap<CreateFeatureModel, Feature>();

            #endregion

            #region Organization

            CreateMap<LinkedUserModel, LinkedUser>();

            CreateMap<LinkedUser, LinkedUserModel>();
            
            CreateMap<UpdateLinkedUserModel, LinkedUser>();

            CreateMap<CreateLinkedUserModel, LinkedUser>();

            #endregion
        }
    }
}