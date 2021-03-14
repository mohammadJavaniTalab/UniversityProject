using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.DI;
using ERP.CoreService.DataAccess.Generator.Helpers;

namespace ERP.CoreService.DataAccess
{
     [TypeLifeTime(TypeLifetime.Singleton)]
     partial class DbProcedureService: Generator.Helpers.BaseDbProcedure, IDbProcedureService
     {
         public DbProcedureService(CoreLib.IAppSettings appSettings)
                :base(appSettings.ConnectionString)
         {
         }
         protected override void BatchExecute_OnExecuteCommand(SqlCommand command, Action rollback)
         {
             int returnValue = base.GetReturnValue(command);
             if (returnValue < 0)
             {
                rollback();
                throw new CoreLib.AppException($"Error on execute stored procedure '{command.CommandText}'.");
             }
         }
         protected override void OnExecuteCommand(SqlCommand command)
         {
             int returnValue = base.GetReturnValue(command);
             if (returnValue < 0)
                throw new CoreLib.AppException($"Error on execute stored procedure '{command.CommandText}'.");
         }
        #region DeleteExpiredMappingData
        public SqlCommand DeleteExpiredMappingData_Command (){
            var cmd = new SqlCommand("app.spDeleteExpiredMappingData");
            cmd.CommandType = CommandType.StoredProcedure;
			cmd.Parameters.Add(new SqlParameter { ParameterName = "ReturnValue", Direction = ParameterDirection.ReturnValue, Size = int.MaxValue, SqlDbType = SqlDbType.Int });
            return cmd;
        }
        public ProcedureResult DeleteExpiredMappingData()
        => Execute(DeleteExpiredMappingData_Command());
        public Task<ProcedureResult> DeleteExpiredMappingDataAsync()
        => ExecuteAsync(DeleteExpiredMappingData_Command());
        #endregion
     }
     }
