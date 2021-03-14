using System;
using ERP.CoreService.Core.Models.Message;
using FluentValidation;

namespace ERP.CoreService.Api.Validators.Message
{
    public class UpdateMessageValidator : AbstractValidator<UpdateMessageModel>
    {
        public UpdateMessageValidator()
        {
            RuleFor(dto => dto.Id)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEqual(Guid.Empty)
                .WithMessage(ResponseMessage.InvalidEntityId);
        }
    }
}