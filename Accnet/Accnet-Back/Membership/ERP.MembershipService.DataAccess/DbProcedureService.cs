using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using ERP.MembershipService.DataAccess.Generator.Helpers;

namespace ERP.MembershipService.DataAccess
{
     partial class DbProcedureService: Generator.Helpers.BaseDbProcedure, IDbProcedureService
     {
         public DbProcedureService(CoreLib.IAppSettings config)
                :base(config.ConnectionString)
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
        #region CreateOrUpdateUser
        public SqlCommand CreateOrUpdateUser_Command (Guid? id, Guid? roleId, Guid? businessId, Guid? agencyId, Guid? localSupplierId, Guid? nationalityId, string name, string lastname, string mobile, string nationalCode, string email, string username, string password, bool? gender, bool? enabled, bool? isB2B){
            var cmd = new SqlCommand("app.spCreateOrUpdateUser");
            cmd.CommandType = CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("Id", id == null ? DBNull.Value : (object)id);
			cmd.Parameters.AddWithValue("RoleId", roleId == null ? DBNull.Value : (object)roleId);
			cmd.Parameters.AddWithValue("BusinessId", businessId == null ? DBNull.Value : (object)businessId);
			cmd.Parameters.AddWithValue("AgencyId", agencyId == null ? DBNull.Value : (object)agencyId);
			cmd.Parameters.AddWithValue("LocalSupplierId", localSupplierId == null ? DBNull.Value : (object)localSupplierId);
			cmd.Parameters.AddWithValue("NationalityId", nationalityId == null ? DBNull.Value : (object)nationalityId);
			cmd.Parameters.AddWithValue("Name", name == null ? DBNull.Value : (object)name);
			cmd.Parameters.AddWithValue("Lastname", lastname == null ? DBNull.Value : (object)lastname);
			cmd.Parameters.AddWithValue("Mobile", mobile == null ? DBNull.Value : (object)mobile);
			cmd.Parameters.AddWithValue("NationalCode", nationalCode == null ? DBNull.Value : (object)nationalCode);
			cmd.Parameters.AddWithValue("Email", email == null ? DBNull.Value : (object)email);
			cmd.Parameters.AddWithValue("Username", username == null ? DBNull.Value : (object)username);
			cmd.Parameters.AddWithValue("Password", password == null ? DBNull.Value : (object)password);
			cmd.Parameters.AddWithValue("Gender", gender == null ? DBNull.Value : (object)gender);
			cmd.Parameters.AddWithValue("Enabled", enabled == null ? DBNull.Value : (object)enabled);
			cmd.Parameters.AddWithValue("IsB2B", isB2B == null ? DBNull.Value : (object)isB2B);
			cmd.Parameters.Add(new SqlParameter { ParameterName = "ReturnValue", Direction = ParameterDirection.ReturnValue, Size = int.MaxValue, SqlDbType = SqlDbType.Int });
            return cmd;
        }
        public ProcedureResult CreateOrUpdateUser(Guid? id, Guid? roleId, Guid? businessId, Guid? agencyId, Guid? localSupplierId, Guid? nationalityId, string name, string lastname, string mobile, string nationalCode, string email, string username, string password, bool? gender, bool? enabled, bool? isB2B)
        => Execute(CreateOrUpdateUser_Command(id, roleId, businessId, agencyId, localSupplierId, nationalityId, name, lastname, mobile, nationalCode, email, username, password, gender, enabled, isB2B));
        public Task<ProcedureResult> CreateOrUpdateUserAsync(Guid? id, Guid? roleId, Guid? businessId, Guid? agencyId, Guid? localSupplierId, Guid? nationalityId, string name, string lastname, string mobile, string nationalCode, string email, string username, string password, bool? gender, bool? enabled, bool? isB2B)
        => ExecuteAsync(CreateOrUpdateUser_Command(id, roleId, businessId, agencyId, localSupplierId, nationalityId, name, lastname, mobile, nationalCode, email, username, password, gender, enabled, isB2B));
        #endregion
        #region GetAgency
        public SqlCommand GetAgency_Command (Guid? id, Guid? businessId, string domain){
            var cmd = new SqlCommand("app.spGetAgency");
            cmd.CommandType = CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("Id", id == null ? DBNull.Value : (object)id);
			cmd.Parameters.AddWithValue("BusinessId", businessId == null ? DBNull.Value : (object)businessId);
			cmd.Parameters.AddWithValue("Domain", domain == null ? DBNull.Value : (object)domain);
			cmd.Parameters.Add(new SqlParameter { ParameterName = "ReturnValue", Direction = ParameterDirection.ReturnValue, Size = int.MaxValue, SqlDbType = SqlDbType.Int });
            return cmd;
        }
        public ProcedureResult GetAgency(Guid? id, Guid? businessId, string domain)
        => Execute(GetAgency_Command(id, businessId, domain));
        public Task<ProcedureResult> GetAgencyAsync(Guid? id, Guid? businessId, string domain)
        => ExecuteAsync(GetAgency_Command(id, businessId, domain));
        #endregion
        #region GetBusiness
        public SqlCommand GetBusiness_Command (Guid? id, string domain){
            var cmd = new SqlCommand("app.spGetBusiness");
            cmd.CommandType = CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("Id", id == null ? DBNull.Value : (object)id);
			cmd.Parameters.AddWithValue("Domain", domain == null ? DBNull.Value : (object)domain);
			cmd.Parameters.Add(new SqlParameter { ParameterName = "ReturnValue", Direction = ParameterDirection.ReturnValue, Size = int.MaxValue, SqlDbType = SqlDbType.Int });
            return cmd;
        }
        public ProcedureResult GetBusiness(Guid? id, string domain)
        => Execute(GetBusiness_Command(id, domain));
        public Task<ProcedureResult> GetBusinessAsync(Guid? id, string domain)
        => ExecuteAsync(GetBusiness_Command(id, domain));
        #endregion
        #region GetSupplier
        public SqlCommand GetSupplier_Command (Guid? id, Guid? businessId, string domain){
            var cmd = new SqlCommand("app.spGetSupplier");
            cmd.CommandType = CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("Id", id == null ? DBNull.Value : (object)id);
			cmd.Parameters.AddWithValue("BusinessId", businessId == null ? DBNull.Value : (object)businessId);
			cmd.Parameters.AddWithValue("Domain", domain == null ? DBNull.Value : (object)domain);
			cmd.Parameters.Add(new SqlParameter { ParameterName = "ReturnValue", Direction = ParameterDirection.ReturnValue, Size = int.MaxValue, SqlDbType = SqlDbType.Int });
            return cmd;
        }
        public ProcedureResult GetSupplier(Guid? id, Guid? businessId, string domain)
        => Execute(GetSupplier_Command(id, businessId, domain));
        public Task<ProcedureResult> GetSupplierAsync(Guid? id, Guid? businessId, string domain)
        => ExecuteAsync(GetSupplier_Command(id, businessId, domain));
        #endregion
        #region GetUser
        public SqlCommand GetUser_Command (Guid? id, Guid? businessId, Guid? agencyId, Guid? localSupplierId, string mobile, string username, string email, string password, string apiKey, string agencyDomain, bool? onlyCheckId){
            var cmd = new SqlCommand("app.spGetUser");
            cmd.CommandType = CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("Id", id == null ? DBNull.Value : (object)id);
			cmd.Parameters.AddWithValue("BusinessId", businessId == null ? DBNull.Value : (object)businessId);
			cmd.Parameters.AddWithValue("AgencyId", agencyId == null ? DBNull.Value : (object)agencyId);
			cmd.Parameters.AddWithValue("LocalSupplierId", localSupplierId == null ? DBNull.Value : (object)localSupplierId);
			cmd.Parameters.AddWithValue("Mobile", mobile == null ? DBNull.Value : (object)mobile);
			cmd.Parameters.AddWithValue("Username", username == null ? DBNull.Value : (object)username);
			cmd.Parameters.AddWithValue("Email", email == null ? DBNull.Value : (object)email);
			cmd.Parameters.AddWithValue("Password", password == null ? DBNull.Value : (object)password);
			cmd.Parameters.AddWithValue("ApiKey", apiKey == null ? DBNull.Value : (object)apiKey);
			cmd.Parameters.AddWithValue("AgencyDomain", agencyDomain == null ? DBNull.Value : (object)agencyDomain);
			cmd.Parameters.AddWithValue("OnlyCheckId", onlyCheckId == null ? DBNull.Value : (object)onlyCheckId);
			cmd.Parameters.Add(new SqlParameter { ParameterName = "ReturnValue", Direction = ParameterDirection.ReturnValue, Size = int.MaxValue, SqlDbType = SqlDbType.Int });
            return cmd;
        }
        public ProcedureResult GetUser(Guid? id, Guid? businessId, Guid? agencyId, Guid? localSupplierId, string mobile, string username, string email, string password, string apiKey, string agencyDomain, bool? onlyCheckId)
        => Execute(GetUser_Command(id, businessId, agencyId, localSupplierId, mobile, username, email, password, apiKey, agencyDomain, onlyCheckId));
        public Task<ProcedureResult> GetUserAsync(Guid? id, Guid? businessId, Guid? agencyId, Guid? localSupplierId, string mobile, string username, string email, string password, string apiKey, string agencyDomain, bool? onlyCheckId)
        => ExecuteAsync(GetUser_Command(id, businessId, agencyId, localSupplierId, mobile, username, email, password, apiKey, agencyDomain, onlyCheckId));
        #endregion
        #region ModifyCredit
        public SqlCommand ModifyCredit_Command (Guid? businessId, Guid? agencyId, Guid? localSupplierId, Guid? userId, string username, decimal? amount, string description){
            var cmd = new SqlCommand("app.spModifyCredit");
            cmd.CommandType = CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("BusinessId", businessId == null ? DBNull.Value : (object)businessId);
			cmd.Parameters.AddWithValue("AgencyId", agencyId == null ? DBNull.Value : (object)agencyId);
			cmd.Parameters.AddWithValue("LocalSupplierId", localSupplierId == null ? DBNull.Value : (object)localSupplierId);
			cmd.Parameters.AddWithValue("UserId", userId == null ? DBNull.Value : (object)userId);
			cmd.Parameters.AddWithValue("Username", username == null ? DBNull.Value : (object)username);
			cmd.Parameters.AddWithValue("Amount", amount == null ? DBNull.Value : (object)amount);
			cmd.Parameters.AddWithValue("Description", description == null ? DBNull.Value : (object)description);
			cmd.Parameters.Add(new SqlParameter { ParameterName = "ReturnValue", Direction = ParameterDirection.ReturnValue, Size = int.MaxValue, SqlDbType = SqlDbType.Int });
            return cmd;
        }
        public ProcedureResult ModifyCredit(Guid? businessId, Guid? agencyId, Guid? localSupplierId, Guid? userId, string username, decimal? amount, string description)
        => Execute(ModifyCredit_Command(businessId, agencyId, localSupplierId, userId, username, amount, description));
        public Task<ProcedureResult> ModifyCreditAsync(Guid? businessId, Guid? agencyId, Guid? localSupplierId, Guid? userId, string username, decimal? amount, string description)
        => ExecuteAsync(ModifyCredit_Command(businessId, agencyId, localSupplierId, userId, username, amount, description));
        #endregion
     }
     }
