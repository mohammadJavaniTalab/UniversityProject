using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;

namespace ERP.MembershipService.DataAccess.Generator.Helpers
{
    public class ProcedureResult
    {
        public ProcedureResult(SqlCommand command, DataSet dataSet)
        {
            _dataSet = dataSet;
            _items = command.Parameters.Cast<SqlParameter>()
                   .Select(p => new KeyValuePair<string, object>(p.ParameterName, p.Value))
                   .ToDictionary(e => e.Key, e => e.Value);
            
            if(command.CommandType == CommandType.StoredProcedure && command.Parameters.OfType<SqlParameter>().Any(p => p.ParameterName.Equals("ReturnValue")))
                _returnValue = Convert.ToInt32(GetParameterValue("ReturnValue"));
        }

        readonly DataSet _dataSet;
        readonly int _returnValue = 0;
        readonly IDictionary<string, object> _items;

        private IEnumerable<TModel> convertToModel<TModel>(DataTable table)
            where TModel : class
        {
            //var rows = table.AsEnumerable().ToArray();
            var properties = typeof(TModel).GetProperties(BindingFlags.Instance | BindingFlags.Public).ToDictionary(e => e.Name);
            var cols = table.Columns
                            .Cast<DataColumn>()
                            .Where(e => properties.Any(p => p.Key.Equals(e.ColumnName)))
                            .ToArray();
            
            return table.AsEnumerable().ConvertAll<TModel>(row =>
            {
                try
                {
                    var model = Activator.CreateInstance<TModel>();

                    for (int i = 0; i < cols.Length; i++)
                    {
                        if (row[cols[i]] != DBNull.Value)
                            properties[cols[i].ColumnName].SetValue(model, row[cols[i]]);
                    }

                    return model;
                }
                catch (Exception e)
                {
                    return null;
                }
            }).Where(e => e != null);
        }

        public object GetParameterValue(string parameterName)
        {
            object objValue = null;
            _items.TryGetValue(parameterName, out objValue);
            if (objValue != null && objValue.GetType() == typeof(DBNull))
                objValue = null;

            return objValue;
        }

        public bool Succeed
            => _returnValue >= 0;

        public int ReturnValue
            => Math.Abs(_returnValue);

        public DataSet DataSet => _dataSet;

        public IEnumerable<T> List<T>(int tableIndex)
            where T : class
            => convertToModel<T>(_dataSet.Tables[tableIndex]);

        public IEnumerable<T> List<T>(string tableName)
            where T : class
            => convertToModel<T>(_dataSet.Tables[tableName]);

        public IEnumerable<T> List<T>(int tableIndex, Func<DataRow, T> selector)
            => _dataSet.Tables[tableIndex].Rows.Cast<DataRow>().Select(selector).ToArray();

        public IEnumerable<T> List<T>(string tableName, Func<DataRow, T> selector)
            => _dataSet.Tables[tableName].Rows.Cast<DataRow>().Select(selector).ToArray();
    }
}
