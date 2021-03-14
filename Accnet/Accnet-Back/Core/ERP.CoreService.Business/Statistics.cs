using System.Collections.Generic;

namespace ERP.CoreService.Business
{
    public static class Statistics
    {
        public static string RegisterBody = @"Dear ####,
Welcome to AccNet Online Inc. If you haven’t done so already, please login to your dashboard,
navigate to the Home page, and click “Get Started” so that we can begin working on your personal
income tax return.
Login to your account at: https://www.accnetonline.com
User Name: %Username%
Password: %Password%
If you need support, login to your dashboard and locate the Support menu to send us a ticket.
Should you need any personalized attention, just e-mail me personally, or call our team.
Welcome to AccNet Online!
Kind Regards,
Eisa Emami
Director of Customer Relations
604-763-7476
crelations@accnetonline.com";

//        public static string AfterSurveyBody="";
//        public static string TicketBody="";




        public static List<Province> Provinces = new List<Province>()
        {
            new Province
            {
                code = "1",
                name = "Newfoundland & Labrador"
            },
            new Province
            {
                code = "2",
                name = "Prince Edward Island"
            },
            new Province
            {
                code = "3",
                name = "Nova Scotia"
            },
            new Province
            {
                code = "4",
                name = "New Brunswick"
            },
            new Province
            {
                code = "5",
                name = "Quebec"
            },
            new Province
            {
                code = "6",
                name = "Ontario"
            },
            new Province
            {
                code = "7",
                name = "Monitoba"
            },
            new Province
            {
                code = "8",
                name = "Saskatchewan"
            },
            new Province
            {
                code = "9",
                name = "Alberta"
            },
            new Province
            {
                code = "10",
                name = "British Columbia"
            },
            new Province
            {
                code = "11",
                name = "Yukon"
            },
            new Province
            {
                code = "12",
                name = "Northwest Territories"
            },
            new Province
            {
                code = "13",
                name = "Nunavut"
            },
        };
        
        public  class Province
        {
            public string name { get; set; }
            public string code { get; set; }
        }
    }
}