using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using CoreLib.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore.Internal;
using ERP.MembershipService.Core.Models;

namespace ERP.MembershipService.ApiClient.Generator
{
    class Program
    {
        static List<string> Models = new List<string>();
        static List<string> Enums = new List<string>();
        private static string CurrentDirectory { get; set; }

        static void Main(string[] args)
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
                CurrentDirectory = Directory.GetCurrentDirectory()
                    .Contains($"{Path.DirectorySeparatorChar}bin{Path.DirectorySeparatorChar}")
                    ? Directory.GetParent(Directory.GetCurrentDirectory()).Parent.Parent.FullName
                    : Directory.GetParent(Directory.GetCurrentDirectory()).FullName + $"{Path.DirectorySeparatorChar}x";
            else
            {
                CurrentDirectory = Directory.GetCurrentDirectory()
                    .Contains($"{Path.DirectorySeparatorChar}bin{Path.DirectorySeparatorChar}")
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
                .AppendLine("using CoreLib.Models;")
                .AppendLine("using System.Collections.Generic;")
                .AppendLine("using ERP.MembershipService.ApiClient.Models;")
                .AppendLine("using ERP.MembershipService.ApiClient.Enums;")
                .AppendLine();

            sbClass
                .AppendLine("using System;")
                .AppendLine("using System.Threading.Tasks;")
                .AppendLine("using CoreLib;")
                .AppendLine("using CoreLib.Models;")
                .AppendLine("using CoreLib.Services;")
                .AppendLine("using System.Collections.Generic;")
                .AppendLine("using ERP.MembershipService.ApiClient.Models;")
                .AppendLine("using ERP.MembershipService.ApiClient.Enums;")
                .AppendLine("using System.Net.Http;")
                .AppendLine();

            sbServiceTypes
                .AppendLine("using System.Collections.Generic;")
                .AppendLine("using TR = CoreLib.TypeRegister;")
                .AppendLine()
                .AppendLine("namespace ERP.MembershipService.ApiClient")
                .AppendLine("{")
                .AppendLine("    public class LayerServicesTypes")
                .AppendLine("    {")
                .AppendLine("        public IEnumerable<TR> GetServices()")
                .AppendLine("            => new List<TR> {");

            var assembly = Assembly.GetAssembly(typeof(MembershipService.Api.Controllers.Auth.AuthController));
            var types = assembly.GetTypes();
            var controllers = types.Where(t => t.BaseType == typeof(Microsoft.AspNetCore.Mvc.ControllerBase)).ToArray();
            controllers.GroupBy(c => c.Namespace).ToList().ForEach(g =>
            {
                sbClass.AppendLine($"namespace ERP.MembershipService.ApiClient.{g.Key.Split('.').Last()}")
                    .AppendLine("{");
                sbInterface.AppendLine($"namespace ERP.MembershipService.ApiClient.{g.Key.Split('.').Last()}")
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
                            .Where(m => m.GetParameters().All(p =>
                                !p.ParameterType.Namespace.Contains("Microsoft.AspNetCore")));

                    foreach (var method in methods)
                    {
                        var methodName = method.Name;
                        if (methodName.ToLower().Contains("download"))
                            continue;
                        var postAttr = method.CustomAttributes.FirstOrDefault(attr =>
                            attr.AttributeType == typeof(Microsoft.AspNetCore.Mvc.HttpPostAttribute));
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
            sbClass.AppendLine($"namespace ERP.MembershipService.ApiClient");
            sbClass.AppendLine("{");
            sbInterface.AppendLine($"namespace ERP.MembershipService.ApiClient");
            sbInterface.AppendLine("{");
            sbClass.AppendLine("    public class MembershipServiceApi : IMembershipServiceApi");
            sbClass.AppendLine("    {");
            sbClass.AppendLine(
                "        public MembershipServiceApi(IAppSettings setting, ISerializerService serializer, ICompressionService compressionService, IGeneralDataService generalDataService, IHttpClientFactory httpClientFactory)");
            sbClass.AppendLine("        {");

            controllers.GroupBy(c => c.Namespace).ToList().ForEach(g =>
            {
                for (var i = 0; i < g.Count(); i++)
                {
                    var ctrl = g.ToArray()[i];
                    var ctrlName = ctrl.Name.Substring(0, ctrl.Name.LastIndexOf("Controller"));
                    sbClass.AppendLine(
                        $"             this.{g.Key.Split('.').Last()}{ctrlName}ApiService = new {g.Key.Split('.').Last()}.{ctrlName}ApiService(setting.MembershipService.Host, \"ERPMembershipService\", setting.MembershipService.ApiKey, serializer, compressionService, generalDataService, httpClientFactory);");
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

            sbInterface.AppendLine("    public interface IMembershipServiceApi");
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

            var path = Path.Combine(Directory.GetParent(CurrentDirectory).FullName,
                $"ERP.MembershipService.ApiClient{Path.DirectorySeparatorChar}ApiServicesInterfaces.cs");
            File.WriteAllText(path, sbInterface.ToString());

            path = Path.Combine(Directory.GetParent(CurrentDirectory).FullName,
                $"ERP.MembershipService.ApiClient{Path.DirectorySeparatorChar}ApiServicesClasses.cs");
            File.WriteAllText(path, sbClass.ToString());

            path = Path.Combine(Directory.GetParent(CurrentDirectory).FullName,
                $"ERP.MembershipService.ApiClient{Path.DirectorySeparatorChar}LayerServicesTypes.cs");
            File.WriteAllText(path, sbServiceTypes.ToString());
        }

        static void GenerateApiModels()
        {
            var sbApiModels = new StringBuilder();
            sbApiModels
                .AppendLine("using System;")
                .AppendLine("using ERP.MembershipService.ApiClient.Enums;")
                .AppendLine("using System.Collections.Generic;")
                .AppendLine("using CoreLib;")
                .AppendLine("using CoreLib.Models;")
                //.AppendLine("namespace ERP.MembershipService.ApiClient.ApiModels")
                //.AppendLine("{")
                .AppendLine();

            var assembly = Assembly.GetAssembly(typeof(BaseModel));
            var types = assembly.GetTypes();
            types.Where(t => t.IsClass && t.FullName.Contains("ERP.MembershipService.Core.Model")).ToList()
                .ForEach(t => GetTypeName(t));

            types = assembly
                .GetTypes()
                .Where(t => Models.Contains(t.FullName))
                .ToArray();

            var groups = types.GroupBy(g => g.Namespace);
            foreach (var group in groups)
            {
                var ns = group.Key.Replace("Service.", "Service.ApiClient.").Replace("Core.", "");
                sbApiModels.AppendLine($"namespace {ns}").AppendLine("{");
                types = group.ToArray();

                foreach (var type in types)
                {
                    sbApiModels
                        .Append($"    public class {type.Name}")
                        .AppendLine(type.IsSubclassOf(typeof(Core.Models.BaseModel)) ? " : BaseModel" : "")
                        .AppendLine(type.IsSubclassOf(typeof(PagingModel)) ? " : PagingModel" : "")
                        .AppendLine("    {");

                    var props = type.GetProperties(BindingFlags.Public | BindingFlags.DeclaredOnly |
                                                   BindingFlags.Instance);
                    foreach (var prop in props)
                    {
                        var propType = GetTypeName(prop.PropertyType);
                        sbApiModels.Append(new CoreLib.Generator().GenerateValidationAttributes(prop))
                            .Append($"        public {propType} {prop.Name} ").AppendLine("{ get; set; }");
                    }

                    sbApiModels
                        .AppendLine("    }")
                        .AppendLine();
                }

                sbApiModels.AppendLine("}");
            }

            var path = Path.Combine(Directory.GetParent(CurrentDirectory).FullName,
                $"ERP.MembershipService.ApiClient{Path.DirectorySeparatorChar}ApiModels.cs");
            File.WriteAllText(path, sbApiModels.ToString());
        }

        static void GenerateEnums()
        {
            var sbEnums = new StringBuilder();
            sbEnums
                .AppendLine("namespace ERP.MembershipService.ApiClient.Enums")
                .AppendLine("{");
            var enums = Assembly
                .GetAssembly(typeof(BaseModel))
                .GetTypes()
                .Where(t => Enums.Contains(t.FullName))
                .ToArray();

            foreach (var type in enums)
            {
                sbEnums
                    .AppendLine($"    public enum {type.Name}")
                    .AppendLine("    {");

                var names = Enum.GetNames(type)
                    .Select(n => $"{n} = {(int) Enum.Parse(type, n)}")
                    .Aggregate((a, b) => $"{a},\n        {b}");

                sbEnums
                    .AppendLine($"        {names}")
                    .AppendLine("    }");
            }

            sbEnums.AppendLine("}");

            var path = Path.Combine(Directory.GetParent(CurrentDirectory).FullName,
                $"ERP.MembershipService.ApiClient{Path.DirectorySeparatorChar}Enums.cs");
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

            if (name.Contains("ERP.MembershipService.Core.Model") && !Models.Contains(name))
                Models.Add(name);

            var generics = string.Empty;

            foreach (var gArgType in t.GetGenericArguments())
                generics += GetTypeName(gArgType) + ",";

            if (!string.IsNullOrWhiteSpace(generics))
                name = $"{name}<{generics.TrimEnd(',')}>";

            return name.Replace("System.Threading.Tasks.", "")
                .Replace("System.Collections.Generic.", "")
                .Replace("System.", "")
                .Replace("ERP.MembershipService.Core.ApiModels.", "")
                .Replace("ERP.MembershipService.Core.Models.Request.", "Models.Request.")
                .Replace("ERP.MembershipService.Core.Models.Response.", "Models.Response.")
                .Replace("ERP.MembershipService.Core.Models.Auth.", "Models.Auth.")
                .Replace("ERP.MembershipService.Core.Models.Feature.", "Models.Feature.")
                .Replace("ERP.MembershipService.Core.Models.Organization.", "Models.Organization.")
                .Replace("ERP.MembershipService.Core.Models.Permission.", "Models.Permission.")
                .Replace("ERP.MembershipService.Core.Models.Role.", "Models.Role.")
                .Replace("ERP.MembershipService.Core.Models.User.", "Models.User.")
                .Replace("ERP.MembershipService.Core.Models.", "")
                .Replace("ERP.MembershipService.Core.Base.", "")
                .Replace("ERP.MembershipService.", "");
        }

        public static readonly Dictionary<Type, string> aliases = new Dictionary<Type, string>()
        {
            {typeof(string), "string"},
            {typeof(int), "int"},
            {typeof(byte), "byte"},
            {typeof(sbyte), "sbyte"},
            {typeof(short), "short"},
            {typeof(ushort), "ushort"},
            {typeof(long), "long"},
            {typeof(uint), "uint"},
            {typeof(ulong), "ulong"},
            {typeof(float), "float"},
            {typeof(double), "double"},
            {typeof(decimal), "decimal"},
            {typeof(object), "object"},
            {typeof(bool), "bool"},
            {typeof(char), "char"}
        };
    }
}