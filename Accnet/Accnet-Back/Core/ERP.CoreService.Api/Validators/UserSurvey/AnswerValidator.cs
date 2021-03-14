using System;
using ERP.CoreService.Core.Models.UserSurvey;
using FluentValidation;

namespace ERP.CoreService.Api.Validators.UserSurvey
{
    public class AnswerValidator : AbstractValidator<SurveyAnswerModel>
    {
        public AnswerValidator()
        {
        }
    }
}