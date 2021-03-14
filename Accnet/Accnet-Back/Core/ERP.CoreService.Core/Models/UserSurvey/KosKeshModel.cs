using System.Collections.Generic;
using ERP.MembershipService.ApiClient.Models.User;

namespace ERP.CoreService.Core.Models.UserSurvey
{
    public class KosKeshModel
    {
        public List<BlobMembershipModel> Reciepts { get; set; }
        public List<BlobModel> Assessments { get; set; }
        public List<BlobModel> ExtraFile { get; set; }
        
    }
}