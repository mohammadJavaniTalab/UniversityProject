using System;
using CoreLib;
using CoreLib.Enums;
using CoreLib.Models;
using ERP.MembershipService.Core.Base;

namespace ERP.MembershipService.Core.Models
{

    public class FilterModel  : PagingModel
    {
        public string Keyword { get; set; }

        public Guid? RoleId { get; set; }

        public byte? Status { get; set; }

        public bool? Enabled { get; set; }

    }
}