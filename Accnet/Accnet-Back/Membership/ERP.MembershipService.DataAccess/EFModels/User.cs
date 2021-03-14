using System;
using System.Collections.Generic;

namespace ERP.MembershipService.DataAccess.EFModels
{
    public partial class User
    {
        public User()
        {
            LinkedUserFirstUser = new HashSet<LinkedUser>();
            LinkedUserSecondUser = new HashSet<LinkedUser>();
            Receipt = new HashSet<Receipt>();
            Relatives = new HashSet<Relatives>();
        }

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
        public decimal? Latitude { get; set; }
        public decimal? Longtitude { get; set; }
        public byte? Tier { get; set; }
        public byte MaritalStatus { get; set; }
        public bool Enabled { get; set; }

        public Role Role { get; set; }
        public ICollection<LinkedUser> LinkedUserFirstUser { get; set; }
        public ICollection<LinkedUser> LinkedUserSecondUser { get; set; }
        public ICollection<Receipt> Receipt { get; set; }
        public ICollection<Relatives> Relatives { get; set; }
    }
}
