using System.Collections.Generic;
using System.Data;

namespace ERP.MembershipService.DataAccess.Generator.Helpers
{
    internal static class Extentions
    {
        public static List<DataRow> AsEnumerable(this System.Data.DataTable dataTable)
        {
            var retList = new List<DataRow>();

            for (int i = 0; i < dataTable.Rows.Count; i++)
                retList.Add(dataTable.Rows[i]);

            return retList;
        }
    }
}