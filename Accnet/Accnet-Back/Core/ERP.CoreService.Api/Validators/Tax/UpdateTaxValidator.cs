using System;
using ERP.CoreService.Core.Models.Tax;
using FluentValidation;

namespace ERP.CoreService.Api.Validators.Tax
{
    public class UpdateTaxValidator : AbstractValidator<UpdateTaxModel>
    {
        public UpdateTaxValidator()
        {
            RuleFor(dto => dto.Id)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEqual(Guid.Empty)
                .WithMessage(ResponseMessage.InvalidEntityId);

            RuleFor(dto => dto.BlobId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEqual(Guid.Empty)
                .WithMessage(ResponseMessage.InvalidUserId);
        }
    }
}