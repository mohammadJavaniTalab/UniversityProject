using ERP.CoreService.Core.Models.Survey;
using FluentValidation;

namespace ERP.CoreService.Api.Validators.Survey
{
    public class CreateSurveyValidator : AbstractValidator<CreateSurveyModel>
    {
        public CreateSurveyValidator()
        {
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