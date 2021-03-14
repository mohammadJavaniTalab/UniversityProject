using System;
using System.Collections.Generic;

namespace ERP.MembershipService.Core.Models.Feature
{
    public class UpdateFeatureModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public IList<int> Permissions { get; set; }

    }
}