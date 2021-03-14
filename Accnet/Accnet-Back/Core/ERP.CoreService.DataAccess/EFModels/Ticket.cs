using System;
using System.Collections.Generic;

namespace ERP.CoreService.DataAccess.EFModels
{
    public partial class Ticket
    {
        public Ticket()
        {
            Comment = new HashSet<Comment>();
            UserSurvey = new HashSet<UserSurvey>();
        }

        public Guid Id { get; set; }
        public Guid? BlobId { get; set; }
        public Guid UserId { get; set; }
        public Guid? RepresentativeId { get; set; }
        public DateTime CreationDate { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public bool Active { get; set; }
        public byte Priority { get; set; }

        public Blob Blob { get; set; }
        public ICollection<Comment> Comment { get; set; }
        public ICollection<UserSurvey> UserSurvey { get; set; }
    }
}
