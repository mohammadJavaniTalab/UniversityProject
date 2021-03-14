using System.Collections.Generic;
using System.Data;
using ERP.CoreService.Core.Models;

namespace ERP.CoreService.Core.Extentions
{
    public static class Extentions
    {
        public static List<DataRow> AsEnumerable(this System.Data.DataTable dataTable)
        {
            var retList = new List<DataRow>();

            for (int i = 0; i < dataTable.Rows.Count; i++)
                retList.Add(dataTable.Rows[i]);

            return retList;
        }

        public static MembershipService.ApiClient.Models.FilterModel ToMembershipFilterModel(this FilterModel filter)
        {
            return new MembershipService.ApiClient.Models.FilterModel
            {
                Id = filter.Id,
                Enabled = filter.Enabled,
                Keyword = filter.Keyword,
                Status = filter.Status,
                RoleId = filter.RoleId,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }
    }
}