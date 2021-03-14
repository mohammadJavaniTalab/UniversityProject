using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using ERP.MembershipService.DataAccess.Generator.Helpers;

namespace ERP.MembershipService.DataAccess
{
     public partial interface IDbProcedureService: Generator.Helpers.IBaseDbProcedure
     {
           #region CreateOrUpdateUser
           SqlCommand CreateOrUpdateUser_Command (Guid? id, Guid? roleId, Guid? businessId, Guid? agencyId, Guid? localSupplierId, Guid? nationalityId, string name, string lastname, string mobile, string nationalCode, string email, string username, string password, bool? gender, bool? enabled, bool? isB2B);
           ProcedureResult CreateOrUpdateUser(Guid? id, Guid? roleId, Guid? businessId, Guid? agencyId, Guid? localSupplierId, Guid? nationalityId, string name, string lastname, string mobile, string nationalCode, string email, string username, string password, bool? gender, bool? enabled, bool? isB2B);
           Task<ProcedureResult> CreateOrUpdateUserAsync(Guid? id, Guid? roleId, Guid? businessId, Guid? agencyId, Guid? localSupplierId, Guid? nationalityId, string name, string lastname, string mobile, string nationalCode, string email, string username, string password, bool? gender, bool? enabled, bool? isB2B);
           #endregion
           #region GetAgency
           SqlCommand GetAgency_Command (Guid? id, Guid? businessId, string domain);
           ProcedureResult GetAgency(Guid? id, Guid? businessId, string domain);
           Task<ProcedureResult> GetAgencyAsync(Guid? id, Guid? businessId, string domain);
           #endregion
           #region GetBusiness
           SqlCommand GetBusiness_Command (Guid? id, string domain);
           ProcedureResult GetBusiness(Guid? id, string domain);
           Task<ProcedureResult> GetBusinessAsync(Guid? id, string domain);
           #endregion
           #region GetSupplier
           SqlCommand GetSupplier_Command (Guid? id, Guid? businessId, string domain);
           ProcedureResult GetSupplier(Guid? id, Guid? businessId, string domain);
           Task<ProcedureResult> GetSupplierAsync(Guid? id, Guid? businessId, string domain);
           #endregion
           #region GetUser
           SqlCommand GetUser_Command (Guid? id, Guid? businessId, Guid? agencyId, Guid? localSupplierId, string mobile, string username, string email, string password, string apiKey, string agencyDomain, bool? onlyCheckId);
           ProcedureResult GetUser(Guid? id, Guid? businessId, Guid? agencyId, Guid? localSupplierId, string mobile, string username, string email, string password, string apiKey, string agencyDomain, bool? onlyCheckId);
           Task<ProcedureResult> GetUserAsync(Guid? id, Guid? businessId, Guid? agencyId, Guid? localSupplierId, string mobile, string username, string email, string password, string apiKey, string agencyDomain, bool? onlyCheckId);
           #endregion
           #region ModifyCredit
           SqlCommand ModifyCredit_Command (Guid? businessId, Guid? agencyId, Guid? localSupplierId, Guid? userId, string username, decimal? amount, string description);
           ProcedureResult ModifyCredit(Guid? businessId, Guid? agencyId, Guid? localSupplierId, Guid? userId, string username, decimal? amount, string description);
           Task<ProcedureResult> ModifyCreditAsync(Guid? businessId, Guid? agencyId, Guid? localSupplierId, Guid? userId, string username, decimal? amount, string description);
           #endregion
     }
}
