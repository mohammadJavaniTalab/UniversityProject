using System;
using ERP.CoreService.Core.Models.Survey;
using FluentValidation;

namespace ERP.CoreService.Api.Validators.Survey
{
    public class UpdateSurveyValidator : AbstractValidator<UpdateSurveyModel>
    {
        public UpdateSurveyValidator()
        {
            
            RuleFor(dto => dto.Id)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEqual(Guid.Empty)
                .WithMessage(ResponseMessage.InvalidEntityId);

            RuleFor(dto => dto.Name)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty()
                .WithMessage(ResponseMessage.SurveyMustHaveName);
            
            RuleFor(dto => dto.Questions)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty()
                .WithMessage(ResponseMessage.SurveyMustHaveQuestion);
        }
    }
}