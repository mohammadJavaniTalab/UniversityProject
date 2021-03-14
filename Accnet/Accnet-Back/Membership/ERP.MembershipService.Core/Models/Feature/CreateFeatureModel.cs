using System;
using System.Collections.Generic;

namespace ERP.MembershipService.Core.Models.Feature
{
    public class CreateFeatureModel
    {
        public string Name { get; set; }
        public IList<int> Permissions { get; set; }

    }
}