using System;
using ERP.CoreService.Core.Models.Tax;
using FluentValidation;

namespace ERP.CoreService.Api.Validators.Tax
{
    public class CreateTaxValidator : AbstractValidator<CreateTaxModel>
    {
        public CreateTaxValidator()
        {

            RuleFor(dto => dto.UserId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEqual(Guid.Empty)
                .WithMessage(ResponseMessage.InvalidUserId);
        }
    }
}