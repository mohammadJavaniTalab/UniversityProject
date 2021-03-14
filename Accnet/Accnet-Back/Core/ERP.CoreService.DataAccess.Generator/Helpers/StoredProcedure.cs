using System.Collections.Generic;
using System.Linq;

namespace ERP.CoreService.DataAccess.Generator.Helpers
{
    public class StoredProcedure
    {
        public StoredProcedure(string fullName, IEnumerable<Parameter> parameters)
        {
            this.Parameters = parameters;
            var splited = fullName.Split('.');
            SchemaName = splited.FirstOrDefault();
            Name = splited.LastOrDefault();
        }

        public override string ToString()
            => $"{SchemaName}.{Name}";

        public string SchemaName { get; private set; }

        public string Name { get; private set; }

        public IEnumerable<Parameter> Parameters { get; private set; }
    }
}
