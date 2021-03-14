using System;
using System.Collections.Generic;

namespace ERP.CoreService.Core.Models.User
{
    public class  CreateSpouseModel
    {

        public Guid? UserId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public string Mobile { get; set; }
        public string SinNumber { get; set; }
        public string Password { get; set; }
        public List<Guid> Assessments { get; set; }
        public List<Guid> Receipts { get; set; }
        public List<Guid> ExtraFiles { get; set; }
        public DateTime DateOfBirth { get; set; }
    }
}