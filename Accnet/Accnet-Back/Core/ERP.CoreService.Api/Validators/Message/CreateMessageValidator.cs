using System;
using ERP.CoreService.Core.Models.Message;
using FluentValidation;

namespace ERP.CoreService.Api.Validators.Message
{
    public class CreateMessageValidator : AbstractValidator<CreateMessageModel>
    {
        public CreateMessageValidator()
        {
            RuleFor(dto => dto.ToUser)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEqual(Guid.Empty)
                .WithMessage(ResponseMessage.InvalidUserId);
        }
    }
}