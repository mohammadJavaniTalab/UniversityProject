using System;
using System.Collections.Generic;
using System.Linq;

namespace ERP.MembershipService.DataAccess.Generator.Helpers
{
    public class Parameter
    {
        public override string ToString()
            => Name;

        public string TypeSchema { get; set; }

        public string TypeName { get; set; }

        public bool IsTableType { get; set; }

        public int Size { get; set; }

        public string Name { get; set; }

        public bool IsOutput { get; set; }

        public string GetCSharpDataType(params string[] userTableTypes)
        {
            if (IsTableType)
                return "System.Data.DataTable";

            var typeMap = new List<KeyValuePair<string, string>>(new KeyValuePair<string, string>[] {
                new KeyValuePair<string, string>("bigint", "long?"),
                new KeyValuePair<string, string>("binary", "byte[]"),
                new KeyValuePair<string, string>("bit", "bool?"),
                new KeyValuePair<string, string>("char", "char?"),
                new KeyValuePair<string, string>("date", "DateTime?"),
                new KeyValuePair<string, string>("datetime", "DateTime?"),
                new KeyValuePair<string, string>("datetime2", "DateTime?"),
                new KeyValuePair<string, string>("datetimeoffset", "TimeSpan?"),
                new KeyValuePair<string, string>("decimal", "decimal?"),
                new KeyValuePair<string, string>("float", "float?"),
                new KeyValuePair<string, string>("geography", "string"),
                new KeyValuePair<string, string>("geometry", "string"),
                new KeyValuePair<string, string>("hierarchyid", "string"),
                new KeyValuePair<string, string>("image", "byte[]"),
                new KeyValuePair<string, string>("int", "int?"),
                new KeyValuePair<string, string>("money", "decimal?"),
                new KeyValuePair<string, string>("nchar", "char?"),
                new KeyValuePair<string, string>("ntext", "string"),
                new KeyValuePair<string, string>("numeric", "decimal?"),
                new KeyValuePair<string, string>("nvarchar", "string"),
                new KeyValuePair<string, string>("real", "decimal?"),
                new KeyValuePair<string, string>("smalldatetime", "DateTime?"),
                new KeyValuePair<string, string>("smallint", "short?"),
                new KeyValuePair<string, string>("smallmoney", "decimal?"),
                new KeyValuePair<string, string>("sql_variant", "object"),
                new KeyValuePair<string, string>("sysname", "object"),
                new KeyValuePair<string, string>("text", "string"),
                new KeyValuePair<string, string>("time", "DateTime?"),
                new KeyValuePair<string, string>("timestamp", "DateTime?"),
                new KeyValuePair<string, string>("tinyint", "byte?"),
                new KeyValuePair<string, string>("uniqueidentifier", "Guid?"),
                new KeyValuePair<string, string>("varbinary", "byte[]"),
                new KeyValuePair<string, string>("varchar", "string"),
                new KeyValuePair<string, string>("xml", "string")
            });
            
            //typeMap.AddRange(userTableTypes.Select(t => new KeyValuePair<string, string>("System.Data.DataTable", t)));

            var map = typeMap.FirstOrDefault(e => (this.TypeSchema.Equals("sys", StringComparison.OrdinalIgnoreCase) && e.Key.Equals(this.TypeName)) || e.Key.Equals($"{this.TypeSchema}.{this.TypeName}", StringComparison.OrdinalIgnoreCase));

            string s = string.IsNullOrWhiteSpace(map.Value) ? "object" : map.Value.Trim();

            if (s.TrimEnd('?') == "char" && this.Size != 1)
                s = "string";
            return s;
        }
    }
}
