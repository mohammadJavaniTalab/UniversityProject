using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using TR = CoreLib.TypeRegister;

namespace ERP.MembershipService.DataAccess
{
    public class LayerServicesTypes
    {
        public IEnumerable<TR> GetServices()
        {
            var registerTypes = TR.ScanAssemblyTypes(Assembly.GetExecutingAssembly());
            return registerTypes.Concat(new CoreLib.LayerServicesTypes().GetServices(new List<Tuple<Type, Type>>()));
        }
            
    }
}
