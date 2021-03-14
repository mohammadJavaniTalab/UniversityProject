using System.Threading.Tasks;
using CoreLib;

namespace ERP.CoreService.DataAccess.Stores
{
    public class MappingDataStore : IMappingDataStore
    {
        private readonly IDbProcedureService dbProcedureService;
        
        public MappingDataStore(IDbProcedureService dbProcedureService)
        {
            this.dbProcedureService = dbProcedureService;
        }
        
        public async Task<Result> DeleteExpiredMappingData()
        {
            await dbProcedureService.DeleteExpiredMappingDataAsync();
            return Result.Successful();
        }
    }
    
    public interface IMappingDataStore
    {
        Task<Result> DeleteExpiredMappingData();
    }
}