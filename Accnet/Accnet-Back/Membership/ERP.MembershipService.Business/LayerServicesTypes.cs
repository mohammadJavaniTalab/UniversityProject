using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using CoreLib;
using CoreLib.Services;
using ERP.MembershipService.DataAccess.EFModels;

namespace ERP.MembershipService.Business
{
    public class LayerServicesTypes
    {
        public IEnumerable<TypeRegister> GetServices()
        {
            var types = TypeRegister.ScanAssemblyTypes(Assembly.GetExecutingAssembly());
            types.Add(new TypeRegister(typeof(IRepository), typeof(Repository<ErpMembershipDBContext>), TypeLifetime.Scoped));
            return types.Concat(new DataAccess.LayerServicesTypes().GetServices());
        }
    }
}
