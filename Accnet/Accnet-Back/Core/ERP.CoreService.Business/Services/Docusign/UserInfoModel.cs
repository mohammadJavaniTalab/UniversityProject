using System;
using System.Collections.Generic;

namespace ERP.CoreService.Business.Services.Docusign
{
    public class UserInfoModel
    {
        public string sub { get; set; }
        public string name { get; set; }
        public string given_name { get; set; }
        public string family_name { get; set; }
        public string email { get; set; }

        public List<AccountModel> Type { get; set; }
        
        
    }

    public class AccountModel
    {
        public Guid account_id { get; set; }
        public bool is_default { get; set; }
        public string account_name { get; set; }
        public string base_uri { get; set; }
        
    }
}