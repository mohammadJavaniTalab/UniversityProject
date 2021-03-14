using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.MembershipService.DataAccess.Generator.Helpers
{
    public interface IBaseDbProcedure
    {
        Task<ProcedureResult[]> BatchExecuteAsync(params SqlCommand[] commands);

        ProcedureResult[] BatchExecute(params SqlCommand[] commands);
    }

    public abstract class BaseDbProcedure : IBaseDbProcedure
    {
        public BaseDbProcedure(string connectionString)
        {
            _connectionString = connectionString;
        }

        protected readonly string _connectionString;

        protected int GetReturnValue(SqlCommand command)
            => command.Parameters.OfType<SqlParameter>().Any(p => p.ParameterName.Equals("ReturnValue")) ? Convert.ToInt32(command.Parameters["ReturnValue"].Value) : 0;

        protected virtual void BatchExecute_OnExecuteCommand(SqlCommand command, Action rollback)
        {
        }

        protected virtual void OnExecuteCommand(SqlCommand command)
        {

        }

        protected ProcedureResult Execute(SqlCommand command)
        {
            DataSet dataSet = new DataSet();
            using (var connection = new SqlConnection(_connectionString))
            {
                command.Connection = connection;
                try
                {
                    connection.Open();
                    using (var reader = command.ExecuteReader())
                    {
                        do
                        {
                            using (var table = dataSet.Tables.Add())
                            {
                                table.Load(reader);
                            }
                        } while (!reader.IsClosed);
                    }

                    OnExecuteCommand(command);

                }
                finally
                {
                    connection.Close();
                }
            }
            return new ProcedureResult(command, dataSet);
        }

        protected async Task<ProcedureResult> ExecuteAsync(SqlCommand command)
        {
            DataSet dataSet = new DataSet();
            using (var connection = new SqlConnection(_connectionString))
            {
                command.Connection = connection;
                try
                {
                    await connection.OpenAsync();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        do
                        {
                            using (var table = dataSet.Tables.Add())
                            {
                                table.Load(reader);
                            }
                        } while (!reader.IsClosed);
                    }

                    OnExecuteCommand(command);

                }
                finally
                {
                    connection.Close();
                }
            }
            return new ProcedureResult(command, dataSet);
        }

        public async Task<ProcedureResult[]> BatchExecuteAsync(params SqlCommand[] commands)
        {
            if (commands.Length < 1)
                return new ProcedureResult[] { };

            var result = new ProcedureResult[commands.Length];

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var tran = connection.BeginTransaction())
                {
                    try
                    {
                        for (int i = 0; i < commands.Length; i++)
                        {
                            commands[i].Connection = connection;
                            commands[i].Transaction = tran;
                            using (var reader = await commands[i].ExecuteReaderAsync())
                            {
                                var dataSet = new DataSet();
                                do
                                {
                                    using (var table = dataSet.Tables.Add())
                                    {
                                        table.Load(reader);
                                    }
                                } while (!reader.IsClosed);

                                result[i] = new ProcedureResult(commands[i], dataSet);
                             
                                BatchExecute_OnExecuteCommand(commands[i], () => { });
                             
                            }

                        }

                        tran.Commit();
                    }
                    
                    catch (Exception e)
                    {
                        
                        tran.Rollback();

                        for (int i = 0; i < result.Length; i++)
                        {
                            if (result[i] != null)
                                result[i]?.DataSet.Dispose();
                        }

                        result = null;

                        throw e;
                    }
                    finally
                    {
                        if (connection.State != ConnectionState.Closed)
                            connection.Close();
                    }
                    return result;
                }
            }
        }

        public ProcedureResult[] BatchExecute(params SqlCommand[] commands)
        {
            if (commands.Length < 1)
                return new ProcedureResult[] { };

            var result = new ProcedureResult[commands.Length];

            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (var tran = connection.BeginTransaction())
                {
                    try
                    {
                        for (int i = 0; i < commands.Length; i++)
                        {
                            commands[i].Connection = connection;
                            commands[i].Transaction = tran;
                            using (var reader = commands[i].ExecuteReader())
                            {
                                var dataSet = new DataSet();
                                do
                                {
                                    using (var table = dataSet.Tables.Add())
                                    {
                                        table.Load(reader);
                                    }
                                } while (!reader.IsClosed);

                            
                                result[i] = new ProcedureResult(commands[i], dataSet);

                                BatchExecute_OnExecuteCommand(commands[i], () => {});
                            }
                        }

                        tran.Commit();
                    }
                    
                    catch (Exception e)
                    {
                        tran.Rollback();

                        for (int i = 0; i < result.Length; i++)
                        {
                            if (result[i] != null)
                                result[i]?.DataSet.Dispose();
                        }

                        result = null;

                        throw e;
                    }
                    finally
                    {
                        if (connection.State != ConnectionState.Closed)
                            connection.Close();
                    }
                    return result;
                }
            }
        }
    }
}
