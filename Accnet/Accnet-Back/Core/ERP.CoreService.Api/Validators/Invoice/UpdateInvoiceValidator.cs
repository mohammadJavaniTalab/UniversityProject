using System;
using ERP.CoreService.Core.Models.Invoice;
using FluentValidation;

namespace ERP.CoreService.Api.Validators.Invoice
{
    public class UpdateInvoiceValidator : AbstractValidator<UpdateInvoiceModel>
    {
        public UpdateInvoiceValidator()
        {
            RuleFor(dto => dto.Id)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEqual(Guid.Empty)
                .WithMessage(ResponseMessage.InvalidEntityId);

            RuleFor(dto => dto.Title)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty()
                .WithMessage(ResponseMessage.InvoiceTitleCantBeEmpty);
        }
    }
}