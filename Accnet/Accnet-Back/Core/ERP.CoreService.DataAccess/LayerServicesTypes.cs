using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using TR = CoreLib.TypeRegister;

namespace ERP.CoreService.DataAccess
{
    public class LayerServicesTypes
    {
        public IEnumerable<TR> GetServices(IList<Tuple<Type,Type>> mapping)
        {
            var registerTypes = TR.ScanAssemblyTypes(Assembly.GetExecutingAssembly());
            return registerTypes.Concat(new CoreLib.LayerServicesTypes().GetServices(mapping));
        }
    }
}
