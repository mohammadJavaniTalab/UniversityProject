using System;
using System.Collections.Generic;
using ERP.MembershipService.Core.Models.Role;

namespace ERP.MembershipService.Core.Models.User
{
    public class FullUserModel
    {
        public Guid Id { get; set; }
        public Guid RoleId { get; set; }
        public Guid? AvatarId { get; set; }
        public DateTime CreationDate { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Gender { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string SinNumber { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string City { get; set; }
        public string PoBox { get; set; }
        public string PostalCode { get; set; }
        public string Province { get; set; }
        public string UnitNumber { get; set; }
        public string Address { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longtitude { get; set; }
        public byte? Tier { get; set; }
        public byte MaritalStatus { get; set; }
        public bool Enabled { get; set; }

        public RoleModel Role { get; set; }
        public IList<BlobMembershipModel> Receipts { get; set; }
        
        public bool HasDoneSurvey { get; set; }
        public bool CompletedProfile { get; set; }
        public long UnreadMessages { get; set; }
        public long UnpaidInvoices { get; set; }
        public long UncheckedTaxes { get; set; }
        public long UncheckedRequestLinks { get; set; }


    }
}