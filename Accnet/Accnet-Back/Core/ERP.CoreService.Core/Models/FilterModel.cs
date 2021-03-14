using System;
using CoreLib.Models;

namespace ERP.CoreService.Core.Models
{
    public class FilterModel : PagingModel
    {
        public string Keyword { get; set; }

        public byte? Status { get; set; }

        public bool? Enabled { get; set; }

        public Guid? RoleId { get; set; }
        public DateTime? CreationDate { get; set; }

        public DateTime? DateTime { get; set; }

        public Guid? UserId { get; set; }
        
    }
}