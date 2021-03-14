using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using ERP.MembershipService.DataAccess.Generator.Helpers;

namespace ERP.MembershipService.DataAccess.Generator
{
    class Program
    {
        private static string CurrentDirectory { get; set; }
        static void Main(string[] args)
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
                CurrentDirectory = Directory.GetCurrentDirectory();
            else
                CurrentDirectory = Directory.GetParent(Directory.GetCurrentDirectory()).Parent.Parent.FullName;
            
            const string connectionString =
                "Data Source=35.182.151.91;Initial Catalog=ERP.Membership;Persist Security Info=True;User ID=erp-user;Password=ASDqwe123;";

            var procedures = new Handler(connectionString).GetProcedures("app");

            var code = new StringBuilder();

            GenerateInterfaceFile(procedures);

            code.AppendLine("using System;");
            code.AppendLine("using System.Data;");
            code.AppendLine("using System.Data.SqlClient;");
            code.AppendLine("using System.Threading.Tasks;");
            code.AppendLine("using Generator.Helpers;");

            code.AppendLine("namespace ERP.MembershipService.DataAccess");
            code.AppendLine("{");
            //            code.AppendLine("     public partial interface IDbProcedureService: Generator.Helpers.IBaseDbProcedure");
            //            code.AppendLine("     {");
            //
            //            for (int i = 0; i < procedures.OrderBy(e => e.Name).Count(); i++)
            //            {
            //                var proc = procedures.ElementAt(i);
            //                var arguments = BuildArguments(proc);
            //
            //                code.AppendLine($"           #region {proc.Name.Substring(2)}");
            //                code.AppendLine($"           SqlCommand {proc.Name.Substring(2)}_Command ({arguments});");
            //                code.AppendLine($"           ProcedureResult {proc.Name.Substring(2)}({arguments});");
            //
            //                code.AppendLine($"           Task<ProcedureResult> {proc.Name.Substring(2)}Async({arguments});");
            //                code.AppendLine($"           #endregion");
            //            }
            //
            //            code.AppendLine("     }");

            code.AppendLine(
                "     partial class DbProcedureService: Generator.Helpers.BaseDbProcedure, IDbProcedureService");
            code.AppendLine("     {");
            code.AppendLine("         public DbProcedureService(CoreLib.IAppSettings config)");
            code.AppendLine(
                $"                :base(config.ConnectionString)");
            code.AppendLine("         {");
            code.AppendLine("         }");

            code.AppendLine(
                "         protected override void BatchExecute_OnExecuteCommand(SqlCommand command, Action rollback)");
            code.AppendLine("         {");
            code.AppendLine("             int returnValue = base.GetReturnValue(command);");
            code.AppendLine("             if (returnValue < 0)");
            code.AppendLine("             {");
            code.AppendLine("                rollback();");
            code.AppendLine(
                "                throw new CoreLib.AppException($\"Error on execute stored procedure '{command.CommandText}'.\");");
            code.AppendLine("             }");
            code.AppendLine("         }");

            code.AppendLine("         protected override void OnExecuteCommand(SqlCommand command)");
            code.AppendLine("         {");
            code.AppendLine("             int returnValue = base.GetReturnValue(command);");
            code.AppendLine("             if (returnValue < 0)");
            code.AppendLine(
                "                throw new CoreLib.AppException($\"Error on execute stored procedure '{command.CommandText}'.\");");
            code.AppendLine("         }");


            for (int i = 0; i < procedures.OrderBy(e => e.Name).Count(); i++)
            {
                var proc = procedures.ElementAt(i);
                var arguments = BuildArguments(proc);
                code.AppendLine($"        #region {proc.Name.Substring(2)}");
                code.AppendLine($"        public SqlCommand {proc.Name.Substring(2)}_Command ({arguments}){{");
                code.AppendLine($"            var cmd = new SqlCommand(\"{proc.ToString()}\");");
                code.AppendLine($"            cmd.CommandType = CommandType.StoredProcedure;");
                code.AppendLine(BuildCommandParameters(proc));
                code.AppendLine($"            return cmd;");
                code.AppendLine($"        }}");

                code.AppendLine($"        public ProcedureResult {proc.Name.Substring(2)}({arguments})");
                code.AppendLine($"        => Execute({proc.Name.Substring(2)}_Command({BuildCallArgs(proc)}));");

                code.AppendLine($"        public Task<ProcedureResult> {proc.Name.Substring(2)}Async({arguments})");
                code.AppendLine($"        => ExecuteAsync({proc.Name.Substring(2)}_Command({BuildCallArgs(proc)}));");
                code.AppendLine($"        #endregion");
            }

            code.AppendLine("     }");

            code.AppendLine("     }");
            
            var path = Path.Combine(Directory.GetParent(CurrentDirectory).FullName, "ERP.MembershipService.DataAccess/DbProcedureService.cs");
            File.WriteAllText(path, code.ToString());
        }

        static void GenerateInterfaceFile(IEnumerable<StoredProcedure> procedures)
        {
            var code = new StringBuilder();

            code.AppendLine("using System;");
            code.AppendLine("using System.Data;");
            code.AppendLine("using System.Data.SqlClient;");
            code.AppendLine("using System.Threading.Tasks;");
            code.AppendLine("using Generator.Helpers;");

            code.AppendLine("namespace ERP.MembershipService.DataAccess");
            code.AppendLine("{");
            code.AppendLine("     public partial interface IDbProcedureService: Generator.Helpers.IBaseDbProcedure");
            code.AppendLine("     {");

            for (int i = 0; i < procedures.OrderBy(e => e.Name).Count(); i++)
            {
                var proc = procedures.ElementAt(i);
                var arguments = BuildArguments(proc);

                code.AppendLine($"           #region {proc.Name.Substring(2)}");
                code.AppendLine($"           SqlCommand {proc.Name.Substring(2)}_Command ({arguments});");
                code.AppendLine($"           ProcedureResult {proc.Name.Substring(2)}({arguments});");

                code.AppendLine($"           Task<ProcedureResult> {proc.Name.Substring(2)}Async({arguments});");
                code.AppendLine($"           #endregion");
            }

            code.AppendLine("     }");
            code.AppendLine("}");
            
            var path = Path.Combine(Directory.GetParent(CurrentDirectory).FullName, "ERP.MembershipService.DataAccess/IDbProcedureService.cs");
            File.WriteAllText(path, code.ToString());
        }

        static string QuotedStr(string s) => "\"" + s + "\"";

        static string BuildArguments(StoredProcedure proc)
        {
            var text = new StringBuilder();
            for (int i = 0; i < proc.Parameters.Where(e => !e.IsOutput).OrderBy(e => e.Name).Count(); i++)
            {
                var prm = proc.Parameters.ElementAt(i);
                if (prm != null)
                {
                    var s = $"{prm.GetCSharpDataType()} {prm.Name.Substring(1, 1).ToLower()}{prm.Name.Substring(2)}, ";
                    text.Append(s);
                }
            }

            return text.ToString().TrimEnd(' ', ',');
        }

        static string BuildCallArgs(StoredProcedure proc)
        {
            var text = new StringBuilder();
            for (int i = 0; i < proc.Parameters.Where(e => !e.IsOutput).OrderBy(e => e.Name).Count(); i++)
            {
                var prm = proc.Parameters.ElementAt(i);
                var s = $"{prm.Name.Substring(1, 1).ToLower()}{prm.Name.Substring(2)}, ";
                text.Append(s);
            }

            return text.ToString().TrimEnd(' ', ',');
        }

        static string BuildCommandParameters(StoredProcedure proc)
        {
            var text = new StringBuilder();

            for (int i = 0; i < proc.Parameters.OrderBy(e => e.Name).Count(); i++)
            {
                var prm = proc.Parameters.ElementAt(i);
                var s = "";
                var argName = $"{prm.Name.Substring(1, 1).ToLower()}{prm.Name.Substring(2)}";

                if (!prm.IsOutput)
                    s =
                        $"\t\t\tcmd.Parameters.AddWithValue({QuotedStr(prm.Name.TrimStart('@'))}, {argName} == null ? DBNull.Value : (object){argName});";
                else
                    s =
                        $"\t\t\tcmd.Parameters.Add(new SqlParameter {{  ParameterName = {QuotedStr(prm.Name.TrimStart('@'))}, Direction= ParameterDirection.Output, Size = int.MaxValue}});";

                text.AppendLine(s);
            }

            text.AppendLine(
                "\t\t\tcmd.Parameters.Add(new SqlParameter { ParameterName = \"ReturnValue\", Direction = ParameterDirection.ReturnValue, Size = int.MaxValue, SqlDbType = SqlDbType.Int });");
            return text.ToString().TrimEnd('\r', '\n');
        }
    }
}