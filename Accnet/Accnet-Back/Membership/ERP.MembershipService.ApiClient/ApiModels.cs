using System;
using ERP.MembershipService.ApiClient.Enums;
using System.Collections.Generic;
using CoreLib;
using CoreLib.Models;

namespace ERP.MembershipService.ApiClient.Models
{
    public class BaseModel

    {
        public Nullable<Guid> Id { get; set; }
    }

    public class FilterModel
 : PagingModel
    {
        public string Keyword { get; set; }
        public Nullable<Guid> RoleId { get; set; }
        public Nullable<byte> Status { get; set; }
        public Nullable<bool> Enabled { get; set; }
    }

}
namespace ERP.MembershipService.ApiClient.Models.User
{
    public class BlobMembershipModel

    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }

    public class CreateRelativeModel

    {
        public Guid UserId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string RelationType { get; set; }
        public string SinNumber { get; set; }
    }

    public class CreateUserModel

    {
        public Nullable<Guid> AvatarId { get; set; }
        public Guid RoleId { get; set; }
        public IList<Guid> Receipts { get; set; }
        public IList<Guid> Assessments { get; set; }
        public IList<Guid> ExtraFiles { get; set; }
        public bool TuitionFee { get; set; }
        public string Password { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public Nullable<DateTime> DateOfBirth { get; set; }
        public string Address { get; set; }
        public string PostalCode { get; set; }
        public string SinNumber { get; set; }
        public string Province { get; set; }
        public string City { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longtitude { get; set; }
        public LinkStatus LinkStatus { get; set; }
        public MaritalStatus MaritalStatus { get; set; }
        public string Gender { get; set; }
        public string UnitNumber { get; set; }
        public string PoBox { get; set; }
    }

    public class FullUserModel

    {
        public Guid Id { get; set; }
        public Guid RoleId { get; set; }
        public Nullable<Guid> AvatarId { get; set; }
        public DateTime CreationDate { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Gender { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string SinNumber { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public Nullable<DateTime> DateOfBirth { get; set; }
        public string City { get; set; }
        public string PoBox { get; set; }
        public string PostalCode { get; set; }
        public string Province { get; set; }
        public string UnitNumber { get; set; }
        public string Address { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longtitude { get; set; }
        public Nullable<byte> Tier { get; set; }
        public byte MaritalStatus { get; set; }
        public bool Enabled { get; set; }
        public Models.Role.RoleModel Role { get; set; }
        public IList<Models.User.BlobMembershipModel> Receipts { get; set; }
        public bool HasDoneSurvey { get; set; }
        public bool CompletedProfile { get; set; }
        public long UnreadMessages { get; set; }
        public long UnpaidInvoices { get; set; }
        public long UncheckedTaxes { get; set; }
        public long UncheckedRequestLinks { get; set; }
    }

    public class LightUserModel : BaseModel

    {
        public string Username { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Gender { get; set; }
        public Nullable<Guid> AvatarId { get; set; }
        public Models.Role.RoleModel Role { get; set; }
        public bool CompletedProfile { get; set; }
        public bool HasDoneSurvey { get; set; }
        public bool Enabled { get; set; }
        public long UnreadMessages { get; set; }
        public long UnpaidInvoices { get; set; }
        public long UncheckedTaxes { get; set; }
        public long UncheckedRequestLinks { get; set; }
    }

    public class RelativeModel

    {
        public Guid Id { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string RelationType { get; set; }
        public string SinNumber { get; set; }
    }

    public class SearchUserModel

    {
        public string Keyword { get; set; }
    }

    public class UpdateUserModel

    {
        public Guid Id { get; set; }
        public Nullable<Guid> AvatarId { get; set; }
        public Guid RoleId { get; set; }
        public IList<Guid> Receipts { get; set; }
        public string Password { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public Nullable<DateTime> DateOfBirth { get; set; }
        public string SinNumber { get; set; }
        public string PostalCode { get; set; }
        public string UnitNumber { get; set; }
        public string PoBox { get; set; }
        public string Address { get; set; }
        public string Province { get; set; }
        public string City { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longtitude { get; set; }
        public LinkStatus LinkStatus { get; set; }
        public MaritalStatus MaritalStatus { get; set; }
        public string Gender { get; set; }
        public bool Enabled { get; set; }
        public decimal WalletBalance { get; set; }
    }

    public class UpdateUserProfileModel

    {
        public Nullable<Guid> AvatarId { get; set; }
        public Guid RoleId { get; set; }
        public IList<Guid> Receipts { get; set; }
        public string Password { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public Nullable<DateTime> DateOfBirth { get; set; }
        public string SinNumber { get; set; }
        public string UnitNumber { get; set; }
        public string PoBox { get; set; }
        public string PostalCode { get; set; }
        public string Address { get; set; }
        public string Province { get; set; }
        public string City { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longtitude { get; set; }
        public MaritalStatus MaritalStatus { get; set; }
        public string Gender { get; set; }
    }

    public class UserLinkedRequestModel

    {
        public Models.User.LightUserModel User { get; set; }
    }

}
namespace ERP.MembershipService.ApiClient.Models.Role
{
    public class CreateRoleModel

    {
        public string Name { get; set; }
        public ICollection<Guid> Feature { get; set; }
    }

    public class RoleModel : BaseModel

    {
        public string Name { get; set; }
        public ICollection<Models.Feature.FeatureModel> Feature { get; set; }
    }

    public class UpdateRoleModel

    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public ICollection<Guid> Feature { get; set; }
    }

}
namespace ERP.MembershipService.ApiClient.Models.Permission
{
    public class PermissionModel

    {
        public string Name { get; set; }
        public PermissionType Id { get; set; }
    }

}
namespace ERP.MembershipService.ApiClient.Models.Organization
{
    public class AdvanceRegisterModel

    {
        public Models.User.CreateUserModel User { get; set; }
        public string RelationType { get; set; }
        public Guid SurveyId { get; set; }
    }

    public class CreateLinkedUserModel

    {
        public Nullable<Guid> FirstUserId { get; set; }
        public Guid SecondUserId { get; set; }
        public string RelationType { get; set; }
    }

    public class LinkedFullUserModel : BaseModel

    {
        public Models.User.FullUserModel FirstUser { get; set; }
        public Models.User.FullUserModel SecondUser { get; set; }
        public LinkStatus Status { get; set; }
        public string RelationType { get; set; }
    }

    public class LinkedUserModel : BaseModel

    {
        public Models.User.LightUserModel FirstUser { get; set; }
        public Models.User.LightUserModel SecondUser { get; set; }
        public LinkStatus Status { get; set; }
        public string RelationType { get; set; }
    }

    public class UpdateLinkedUserModel

    {
        public Guid Id { get; set; }
        public string RelationType { get; set; }
        public LinkStatus Status { get; set; }
    }

}
namespace ERP.MembershipService.ApiClient.Models.Feature
{
    public class CreateFeatureModel

    {
        public string Name { get; set; }
        public IList<int> Permissions { get; set; }
    }

    public class FeatureModel : BaseModel

    {
        public string Name { get; set; }
        public IList<Models.Permission.PermissionModel> Permissions { get; set; }
    }

    public class UpdateFeatureModel

    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public IList<int> Permissions { get; set; }
    }

}
namespace ERP.MembershipService.ApiClient.Models.Auth
{
    public class ChangePasswordModel

    {
        public Guid UserId { get; set; }
        public string NewPassword { get; set; }
    }

    public class LoginModel

    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Captcha { get; set; }
    }

    public class RegisterModel

    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Userrname { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string Gender { get; set; }
        public string Captcha { get; set; }
    }

}
