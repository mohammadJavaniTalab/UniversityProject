using System.Data.SqlClient;
using System.Threading.Tasks;
using ERP.CoreService.DataAccess.Generator.Helpers;

namespace ERP.CoreService.DataAccess
{
     public partial interface IDbProcedureService: Generator.Helpers.IBaseDbProcedure
     {
           #region DeleteExpiredMappingData
           SqlCommand DeleteExpiredMappingData_Command ();
           ProcedureResult DeleteExpiredMappingData();
           Task<ProcedureResult> DeleteExpiredMappingDataAsync();
           #endregion
     }
}
