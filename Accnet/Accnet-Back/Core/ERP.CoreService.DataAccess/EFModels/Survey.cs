using System;
using System.Collections.Generic;

namespace ERP.CoreService.DataAccess.EFModels
{
    public partial class Survey
    {
        public Survey()
        {
            Question = new HashSet<Question>();
            UserSurvey = new HashSet<UserSurvey>();
        }

        public Guid Id { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool? Enabled { get; set; }

        public ICollection<Question> Question { get; set; }
        public ICollection<UserSurvey> UserSurvey { get; set; }
    }
}
