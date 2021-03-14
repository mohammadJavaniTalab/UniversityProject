using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace ERP.CoreService.DataAccess.Generator.Helpers
{
    public class Handler
    {
        public Handler(string connectionString)
        {
            _connectionString = connectionString;
        }

        #region Constants
        readonly string _connectionString;// = "Data Source=192.168.0.40;Initial Catalog=IranHost.com_Primary;Persist Security Info=True;User ID=devsa;Password=123456;";

        const string Query = @"SELECT p.schema_id SchemaID
                                        , p.[object_id] ProcedureID
	                                    , COALESCE(a.parameter_id, -1) ParameterID
                                        , COALESCE(a.system_type_id, -1) TypeID
                                        , h.[name] + '.' + p.[name] Name
                                        , ISNULL(th.[name], '') TypeSchema
                                        , ISNULL(t.[name], '') TypeName
                                        , t.is_table_type IsTableType
                                        , ISNULL(a.max_length, 0) Size
                                        , ISNULL(a.[name], '') ParameterName
                                        , CAST(ISNULL(a.is_output, 0) AS BIT) IsOutput
                                    FROM sys.procedures p
                                    INNER JOIN sys.schemas h ON p.[schema_id] = h.[schema_id]
                                    LEFT JOIN sys.parameters a ON p.[object_id] = a.[object_id]
                                    LEFT JOIN sys.types t ON a.user_type_id = t.user_type_id
                                    LEFT JOIN sys.schemas th ON t.[schema_id] = th.[schema_id]
                                    WHERE h.[name] <> 'sys'";
        #endregion

        public IEnumerable<StoredProcedure> GetProcedures(params string[] schema)
        {
            using (var table = new DataTable())
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    using (var command = new SqlCommand(schema?.Any() == true ? $"{Query} AND h.[name] IN ({string.Join(",", schema.Select(e => $"'{e}'"))})" : Query))
                    {
                        command.Connection = connection;
                        command.CommandType = CommandType.Text;
                        connection.Open();
                        using (var reader = command.ExecuteReader())
                        {
                            table.Load(reader);
                            reader.Close();
                        }
                    }
                    if (connection.State != ConnectionState.Closed)
                        connection.Close();
                }

                return table.Rows
                            .Cast<DataRow>()
                            .GroupBy(row => (row["Name"] ?? "").ToString())
                            .Select(group =>
                            {
                                var parameters = group.Where(row => !string.IsNullOrWhiteSpace((row["TypeName"] ?? "").ToString()))
                                .Select(row => new Parameter
                                {
                                    TypeSchema = row["TypeSchema"].ToString(),
                                    TypeName = row["TypeName"].ToString(),
                                    IsTableType = Convert.ToBoolean(row["IsTableType"]),
                                    Size = Convert.ToInt32(row["Size"]),
                                    Name = row["ParameterName"].ToString(),
                                    IsOutput = Convert.ToBoolean(row["IsOutput"])
                                })
                                .ToArray();

                                return new StoredProcedure(group.Key, parameters);

                            })
                            .OrderBy(p => p.SchemaName)
                            .ThenBy(p => p.Name)
                            .ToArray();
            }
        }
    }
}
