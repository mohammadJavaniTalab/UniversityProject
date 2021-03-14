using System;
using System.Collections.Generic;
using ERP.MembershipService.Core.Base;

namespace ERP.MembershipService.Core.Models.User
{
    public class UpdateUserModel
    {
        public Guid Id { get; set; }
        public Guid? AvatarId { get; set; }
        public Guid RoleId { get; set; }

        public IList<Guid> Receipts { get; set; }
        public string Password { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public DateTime? DateOfBirth { get; set; }

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
}