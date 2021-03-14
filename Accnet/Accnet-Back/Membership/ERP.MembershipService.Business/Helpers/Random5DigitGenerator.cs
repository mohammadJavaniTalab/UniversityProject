using System;
using System.Linq;
using System.Text;

namespace ERP.MembershipService.Business.Helpers
{
    internal class Random5DigitGenerator
    {
        private static readonly Random random = new Random();
        public static string New()
            => Enumerable.Range(0, 5)
            .Aggregate(new StringBuilder(), (sb, n) => sb.Append(random.Next(1, 9)), sb => sb.ToString());
    }
}
