using System;
using ERP.CoreService.Core.Models.Invoice;
using FluentValidation;

namespace ERP.CoreService.Api.Validators.Invoice
{
    public class CreateInvoiceValidator :   AbstractValidator<CreateInvoiceModel>
    {
        public CreateInvoiceValidator()
        {
            RuleFor(dto => dto.Title)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty()
                .WithMessage(ResponseMessage.InvoiceTitleCantBeEmpty);

            RuleFor(dto => dto.UserId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEqual(Guid.Empty).WithMessage(ResponseMessage.InvalidUserId);

        }
    }
}