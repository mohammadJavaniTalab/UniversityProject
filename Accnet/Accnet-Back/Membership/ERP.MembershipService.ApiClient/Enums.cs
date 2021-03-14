namespace ERP.MembershipService.ApiClient.Enums
{
    public enum MaritalStatus
    {
        Married = 1,
        Widowed = 2,
        Divorced = 3,
        Single = 4
    }
    public enum LinkStatus
    {
        Pending = 1,
        AdminAccepted = 2,
        UserAccepted = 3,
        Cancelled = 4
    }
    public enum PermissionType
    {
        CreateMessage = 1,
        ReadMessage = 2,
        UpdateMessage = 3,
        DeleteMessage = 4,
        CreateInvoice = 5,
        ReadInvoice = 6,
        UpdateInvoice = 7,
        DeleteInvoice = 8,
        CreateTicket = 9,
        ReadTicket = 10,
        UpdateTicket = 11,
        DeleteTicket = 12,
        CreateUser = 13,
        ReadUser = 14,
        UpdateUser = 15,
        DeleteUser = 16,
        CreateOrganization = 17,
        ReadOrganization = 18,
        UpdateOrganization = 19,
        DeleteOrganization = 20,
        CreateSurvey = 21,
        ReadSurvey = 22,
        UpdateSurvey = 23,
        DeleteSurvey = 24,
        CreateTax = 25,
        ReadTax = 26,
        UpdateTax = 27,
        DeleteTax = 28,
        UpdateCredit = 29,
        Admin = 30,
        User = 31
    }
}
