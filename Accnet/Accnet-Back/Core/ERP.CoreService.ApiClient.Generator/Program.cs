using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using ERP.CoreService.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace ERP.CoreService.ApiClient.Generator
{
    class Program
    {
        static List<string> Models = new List<string>();
        static List<string> Enums = new List<string>();
        
        private static string CurrentDirectory { get; set; }

        static void Main(string[] args)
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
                CurrentDirectory = Directory.GetCurrentDirectory();
            else
            {
                CurrentDirectory = Directory.GetCurrentDirectory().Contains($"{Path.DirectorySeparatorChar}bin{Path.DirectorySeparatorChar}")
                    ? Directory.GetParent(Directory.GetCurrentDirectory()).Parent.Parent.FullName
                    : Directory.GetParent(Directory.GetCurrentDirectory()).FullName + $"{Path.DirectorySeparatorChar}x";
            }
            
            GenerateApiService();
            GenerateApiModels();
            GenerateEnums();
        }

        static void GenerateApiService()
        {
            var sbInterface = new StringBuilder();
            var sbClass = new StringBuilder();
            var sbServiceTypes = new StringBuilder();

            sbInterface
                .AppendLine("using System;")
                .AppendLine("using System.Threading.Tasks;")
                .AppendLine("using CoreLib;")
                .AppendLine("using System.Collections.Generic;")
                .AppendLine("using ERP.CoreService.ApiClient.Models;")
                .AppendLine("using ERP.CoreService.ApiClient.Enums;")
                .AppendLine();

            sbClass
                .AppendLine("using System;")
                .AppendLine("using System.Threading.Tasks;")
                .AppendLine("using CoreLib;")
                .AppendLine("using CoreLib.Services;")
                .AppendLine("using System.Collections.Generic;")
                .AppendLine("using ERP.CoreService.ApiClient.Models;")
                .AppendLine("using ERP.CoreService.ApiClient.Enums;")
                .AppendLine("using System.Net.Http;")
                .AppendLine();

            sbServiceTypes
                .AppendLine("using System.Collections.Generic;")
                .AppendLine("using TR = CoreLib.TypeRegister;")
                .AppendLine()
                .AppendLine("namespace ERP.CoreService.ApiClient")
                .AppendLine("{")
                .AppendLine("    public class LayerServicesTypes")
                .AppendLine("    {")
                .AppendLine("        public IEnumerable<TR> GetServices()")
                .AppendLine("            => new List<TR> {");

            var assembly = Assembly.GetAssembly(typeof(CoreService.Api.Controllers.Core.SurveyController));
            var types = assembly.GetTypes();
            var controllers = types.Where(t => t.BaseType == typeof(Microsoft.AspNetCore.Mvc.ControllerBase)).ToArray();
            controllers.GroupBy(c => c.Namespace).ToList().ForEach(g =>
            {
                sbClass.AppendLine($"namespace ERP.CoreService.ApiClient.{g.Key.Split('.').Last()}")
                    .AppendLine("{");
                sbInterface.AppendLine($"namespace ERP.CoreService.ApiClient.{g.Key.Split('.').Last()}")
                    .AppendLine("{");
                for (var i = 0; i < g.Count(); i++)
                {
                    var ctrl = g.ToArray()[i];
                    var ctrlName = ctrl.Name.Substring(0, ctrl.Name.LastIndexOf("Controller"));

                    sbInterface
                        .AppendLine($"    public interface I{ctrlName}ApiService")
                        .AppendLine("    {");

                    sbClass
                        .AppendLine($"    public class {ctrlName}ApiService : BaseApiClient, I{ctrlName}ApiService")
                        .AppendLine("    {")
                        .Append(
                            $"        public {ctrlName}ApiService(string host, string name, string apiKey, ISerializerService serializer, ICompressionService compressionService, IGeneralDataService generalDataService, IHttpClientFactory httpClientFactory) : base(host, name, apiKey, serializer, compressionService, generalDataService, httpClientFactory) ")
                        .AppendLine("{ }")
                        .AppendLine();

                    sbServiceTypes
                        .Append(
                            $"                new TR(typeof({g.Key.Split('.').Last()}.I{ctrlName}ApiService), typeof({g.Key.Split('.').Last()}.{ctrlName}ApiService))")
                        .AppendLine(i < (controllers.Length - 1) ? "," : "");

                    var routeAttr = ctrl.CustomAttributes.FirstOrDefault(attr =>
                        attr.AttributeType == typeof(Microsoft.AspNetCore.Mvc.RouteAttribute));
                    var routePrefix = routeAttr.ConstructorArguments.FirstOrDefault().Value.ToString();
                    var methods =
                        ctrl.GetMethods(BindingFlags.Public | BindingFlags.DeclaredOnly | BindingFlags.Instance)
                            .Where(m => m.ReturnType != typeof(IActionResult) && m.ReturnType != typeof(Task<IActionResult>));

                    foreach (var method in methods)
                    {
                        var methodName = method.Name;
                        if (methodName.ToLower().Contains("download"))
                            continue;
                        if (methodName.ToLower().Contains("upload"))
                            continue;
                        var postAttr = method.CustomAttributes.FirstOrDefault(attr =>
                            attr.AttributeType == typeof(Microsoft.AspNetCore.Mvc.HttpPostAttribute));
                        if(postAttr == null)
                            continue;
                        var methodRoute = postAttr.ConstructorArguments.Any()
                            ? postAttr.ConstructorArguments.FirstOrDefault().Value.ToString()
                            : string.Empty;
                        if (methodRoute.ToLower().Contains("blob"))
                            continue;
                        var route = $"{routePrefix}/{methodRoute}";
                        var returnType = GetTypeName(method.ReturnType);
                        var returnTypeWithoutTask = returnType.Remove(returnType.Length - 1).Replace("Task<", "");

                        var parametersForMethod = method.GetParameters().Length > 0
                            ? method.GetParameters()
                                .Select(p => $"{GetTypeName(p.ParameterType)} {p.Name}")
                                .Aggregate((a, b) => $"{a}, {b}")
                            : string.Empty;

                        var parametersForCall = method.GetParameters().Length > 0
                            ? method.GetParameters()
                                .Select(p => $"{p.Name}")
                                .Aggregate((a, b) => $"{a}, {b}")
                            : string.Empty;

                        sbInterface.AppendLine($"        {returnType} {methodName}({parametersForMethod});");

                        sbClass
                            .AppendLine($"        public {returnType} {methodName}({parametersForMethod})")
                            .AppendLine($"            => base.PostAsync<{returnTypeWithoutTask}>(\"{route}\"" +
                                        (string.IsNullOrWhiteSpace(parametersForCall)
                                            ? ", null);"
                                            : $", {parametersForCall});"));
                    }

                    sbInterface.AppendLine("    }");
                    sbClass.AppendLine("    }");
                }

                sbInterface.AppendLine("}");
                sbClass.AppendLine("}");
            });

            //generate all api in one class and interface
            sbClass.AppendLine($"namespace ERP.CoreService.ApiClient");
            sbClass.AppendLine("{");
            sbInterface.AppendLine($"namespace ERP.CoreService.ApiClient");
            sbInterface.AppendLine("{");
            sbClass.AppendLine("    public class CoreServiceApi : ICoreServiceApi");
            sbClass.AppendLine("    {");
            sbClass.AppendLine(
                "        public CoreServiceApi(IAppSettings setting, ISerializerService serializer, ICompressionService compressionService, IGeneralDataService generalDataService, IHttpClientFactory httpClientFactory)");
            sbClass.AppendLine("        {");

            controllers.GroupBy(c => c.Namespace).ToList().ForEach(g =>
            {
                for (var i = 0; i < g.Count(); i++)
                {
                    var ctrl = g.ToArray()[i];
                    var ctrlName = ctrl.Name.Substring(0, ctrl.Name.LastIndexOf("Controller"));
                    sbClass.AppendLine(
                        $"             this.{g.Key.Split('.').Last()}{ctrlName}ApiService = new {g.Key.Split('.').Last()}.{ctrlName}ApiService(setting.CoreService.Host, \"ERPCoreService\", setting.CoreService.ApiKey, serializer, compressionService, generalDataService, httpClientFactory);");
                }
            });
            
            sbClass.AppendLine("        }");

            controllers.GroupBy(c => c.Namespace).ToList().ForEach(g =>
            {
                for (var i = 0; i < g.Count(); i++)
                {
                    var ctrl = g.ToArray()[i];
                    var ctrlName = ctrl.Name.Substring(0, ctrl.Name.LastIndexOf("Controller"));
                    sbClass.AppendLine(
                        $"       public {g.Key.Split('.').Last()}.{ctrlName}ApiService {g.Key.Split('.').Last()}{ctrlName}ApiService {{get; set;}}");
                }
            });
            
            sbClass.AppendLine("     }");
            
            sbInterface.AppendLine("    public interface ICoreServiceApi");
            sbInterface.AppendLine("    {");

            controllers.GroupBy(c => c.Namespace).ToList().ForEach(g =>
            {
                for (var i = 0; i < g.Count(); i++)
                {
                    var ctrl = g.ToArray()[i];
                    var ctrlName = ctrl.Name.Substring(0, ctrl.Name.LastIndexOf("Controller"));
                    sbInterface.AppendLine(
                        $"     {g.Key.Split('.').Last()}.{ctrlName}ApiService {g.Key.Split('.').Last()}{ctrlName}ApiService {{get; set;}}");
                }
            });

            //end generate all api in one class
            sbInterface.AppendLine("}").AppendLine("}");
            sbClass.AppendLine("}");
            sbServiceTypes
                .AppendLine("            };")
                .AppendLine("    }")
                .AppendLine("}");

            var path = Path.Combine(Directory.GetParent(CurrentDirectory).FullName, $"ERP.CoreService.ApiClient{Path.DirectorySeparatorChar}ApiServicesInterfaces.cs");
            File.WriteAllText(path, sbInterface.ToString());

            path = Path.Combine(Directory.GetParent(CurrentDirectory).FullName, $"ERP.CoreService.ApiClient{Path.DirectorySeparatorChar}ApiServicesClasses.cs");
            File.WriteAllText(path, sbClass.ToString());

            path = Path.Combine(Directory.GetParent(CurrentDirectory).FullName, $"ERP.CoreService.ApiClient{Path.DirectorySeparatorChar}LayerServicesTypes.cs");
            File.WriteAllText(path, sbServiceTypes.ToString());
        }

        static void GenerateApiModels()
        {
            var sbApiModels = new StringBuilder();
            sbApiModels
                .AppendLine("using System;")
                .AppendLine("using ERP.CoreService.ApiClient.Enums;")
                .AppendLine("using System.Collections.Generic;")
                .AppendLine();

            var assembly = Assembly.GetAssembly(typeof(BaseCoreModel));
            var types = assembly.GetTypes();
            types.Where(t => t.IsClass && t.FullName.Contains("ERP.CoreService.Core.Model")).ToList().ForEach(t => GetTypeName(t));

            types = assembly
                .GetTypes()
                .Where(t => Models.Contains(t.FullName))
                .ToArray();

            var groups = types.GroupBy(g => g.Namespace);
            foreach (var group in groups)
            {
                var ns = group.Key.Replace("Service.", "Service.ApiClient.").Replace("Core.","");
                sbApiModels.AppendLine($"namespace {ns}").AppendLine("{");
                types = group.ToArray();
                
                foreach (var type in types)
                {
                    sbApiModels
                        .Append($"    public class {type.Name}")
                        .AppendLine(type.IsSubclassOf(typeof(BaseCoreModel)) ? " : BaseModel" : "")
                        .AppendLine("    {");

                    var props = type.GetProperties(BindingFlags.Public | BindingFlags.DeclaredOnly | BindingFlags.Instance);
                    foreach (var prop in props)
                    {
                        var propType = GetTypeName(prop.PropertyType);
                        sbApiModels
                            .Append($"        public {propType} {prop.Name} ").AppendLine("{ get; set; }");
                    }

                    sbApiModels
                        .AppendLine("    }")
                        .AppendLine();
                }
                
                sbApiModels.AppendLine("}");
            }

            var path = Path.Combine(Directory.GetParent(CurrentDirectory).FullName, $"ERP.CoreService.ApiClient{Path.DirectorySeparatorChar}ApiModels.cs");
            File.WriteAllText(path, sbApiModels.ToString());
        }

        static void GenerateEnums()
        {
            var sbEnums = new StringBuilder();
            sbEnums
                .AppendLine("namespace ERP.CoreService.ApiClient.Enums")
                .AppendLine("{");
            var enums = Assembly
                .GetAssembly(typeof(BaseCoreModel))
                .GetTypes()
                .Where(t => Enums.Contains(t.FullName))
                .ToArray();

            foreach (var type in enums)
            {
                sbEnums
                    .AppendLine($"    public enum {type.Name}")
                    .AppendLine("    {");

                var names = Enum.GetNames(type)
                    .Select(n => $"{n} = {(int)Enum.Parse(type, n)}")
                    .Aggregate((a, b) => $"{a},\n        {b}");

                sbEnums
                    .AppendLine($"        {names}")
                    .AppendLine("    }");
            }

            sbEnums.AppendLine("}");

            var path = Path.Combine(Directory.GetParent(CurrentDirectory).FullName, $"ERP.CoreService.ApiClient{Path.DirectorySeparatorChar}Enums.cs");
            File.WriteAllText(path, sbEnums.ToString());
        }

        static string GetTypeName(Type t)
        {
            var i = t.FullName.IndexOf('`');

            var hasAlias = aliases.TryGetValue(t, out string name);
            if (hasAlias)
                return name;

            name = i >= 0 ? t.FullName.Substring(0, i) : t.FullName;

            if (t.IsEnum)
                Enums.Add(name);

            if (name.Contains("ERP.CoreService.Core.Model") && !Models.Contains(name))
                Models.Add(name);

            var generics = string.Empty;

            foreach (var gArgType in t.GetGenericArguments())
                generics = GetTypeName(gArgType) + ",";

            if (!string.IsNullOrWhiteSpace(generics))
                name = $"{name}<{generics.TrimEnd(',')}>";

            return name.Replace("System.Threading.Tasks.", "")
                       .Replace("System.Collections.Generic.", "")
                       .Replace("System.", "")
                       .Replace("ERP.CoreService.Core.ApiModels.", "")
                       .Replace("ERP.CoreService.Core.Models.Request.", "Models.Request.")
                       .Replace("ERP.CoreService.Core.Models.Response.", "Models.Response.")
                       .Replace("ERP.CoreService.Core.Models.Appointment.", "Models.Appointment.")
                       .Replace("ERP.CoreService.Core.Models.Comment.", "Models.Comment.")
                       .Replace("ERP.CoreService.Core.Models.Invoice.", "Models.Invoice.")
                       .Replace("ERP.CoreService.Core.Models.Message.", "Models.Message.")
                       .Replace("ERP.CoreService.Core.Models.Survey.", "Models.Survey.")
                       .Replace("ERP.CoreService.Core.Models.Tax.", "Models.Tax.")
                       .Replace("ERP.CoreService.Core.Models.Ticket.", "Models.Ticket.")
                       .Replace("ERP.CoreService.Core.Models.UserSurvey.", "Models.UserSurvey.")
                       .Replace("ERP.CoreService.Core.Models.User.", "Models.User.")
                       .Replace("ERP.CoreService.Core.Models.", "")
                       .Replace("ERP.CoreService.Core.Base.", "")
                       .Replace("ERP.CoreService.", "");
        }

        public static readonly Dictionary<Type, string> aliases = new Dictionary<Type, string>()
        {
            { typeof(string), "string" },
            { typeof(int), "int" },
            { typeof(byte), "byte" },
            { typeof(sbyte), "sbyte" },
            { typeof(short), "short" },
            { typeof(ushort), "ushort" },
            { typeof(long), "long" },
            { typeof(uint), "uint" },
            { typeof(ulong), "ulong" },
            { typeof(float), "float" },
            { typeof(double), "double" },
            { typeof(decimal), "decimal" },
            { typeof(object), "object" },
            { typeof(bool), "bool" },
            { typeof(char), "char" }
        };
    }
}
