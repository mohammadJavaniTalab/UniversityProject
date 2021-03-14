using System.Collections.Generic;
using System.Linq;
using TR = CoreLib.TypeRegister;
using System.Reflection;
using CoreLib;
using CoreLib.Services;
using ERP.CoreService.DataAccess.EFModels;

namespace ERP.CoreService.Business
{
    public class LayerServicesTypes
    {
        public IEnumerable<TR> GetServices()
        {
            var result = TR.ScanAssemblyTypes(Assembly.GetExecutingAssembly())
                .Concat(new DataAccess.LayerServicesTypes().GetServices(ModelMapping.Mapping.maps)).ToList();
            result.Add(new TypeRegister(typeof(IRepository), typeof(Repository<ErpCoreDBContext>),
                TypeLifetime.Scoped));
            
            return result;
        }
    }
}