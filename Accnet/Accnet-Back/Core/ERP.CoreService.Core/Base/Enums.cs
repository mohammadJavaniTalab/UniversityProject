namespace ERP.CoreService.Core.Base
{
    public enum ActionType
    {
        AddToCart = 1,
        SendTicketAndCreateAppointment = 2,
        AddDependent = 3,
        AddRelative = 4,
        AddAssesssment = 5,
        CreateAppointment = 6,
        AddReciepts = 7,
        AddSpouse = 8,
        AddExtraFile = 8,
    }

    public enum TicketPriority
    {
        Low = 1,
        Medium = 2,
        High = 3
    }

    public enum AnswerType
    {
        Static = 1,
        Calendar = 2,
        Input = 3,
        Checkbox = 4
    }

    public enum InvoiceStatus
    {
        Pending = 1,
        Paid = 2,
        Cancelled = 3
    }

    public enum TaxStatus
    {
        SetConsultation = 1,
        PendingConsultation = 2,
        PaymentPending = 3,
        TaxProcessPending = 4,
        DocumentSign = 5,
        AccnetEFiling = 6,
        UserEFiling = 7,
    }

    public enum MessagePriority
    {
        Low = 1,
        Medium = 2,
        High = 3
    }
}