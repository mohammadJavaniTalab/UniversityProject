using AutoMapper;
using ERP.CoreService.Core.Base;
using ERP.CoreService.Core.Models.Invoice;
using ERP.CoreService.Core.Models.Message;
using ERP.CoreService.Core.Models.Survey;
using ERP.CoreService.Core.Models.Tax;
using ERP.CoreService.Core.Models.Ticket;
using ERP.CoreService.DataAccess.EFModels;

namespace ERP.CoreService.Api.AutoMapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            #region Invoice

            CreateMap<InvoiceCoreModel, Invoice>()
                .ForMember(x => x.UserId, opt => opt.Ignore());

            CreateMap<Invoice, InvoiceCoreModel>()
                .ForMember(x => x.User, opt => opt.Ignore())
                .ForMember(x => x.Status, opt => opt.MapFrom(x => (InvoiceStatus) x.Status));


            CreateMap<UpdateInvoiceModel, Invoice>();

            CreateMap<CreateInvoiceModel, Invoice>();

            #endregion

            #region Tax

            CreateMap<TaxCoreModel, Tax>()
                .ForMember(x => x.UserId, opt => opt.Ignore());

            CreateMap<Tax, TaxCoreModel>()
                .ForMember(x => x.User, opt => opt.Ignore());

            CreateMap<UpdateTaxModel, Tax>();

            CreateMap<CreateTaxModel, Tax>();

            #endregion

            #region Message

            CreateMap<MessageCoreModel, Message>()
                .ForMember(x => x.FromUserId, opt => opt.Ignore())
                .ForMember(x => x.ToUserId, opt => opt.Ignore());


            CreateMap<Message, MessageCoreModel>()
                .ForMember(x => x.Priority, opt => opt.MapFrom(x => (MessagePriority) x.Priority))
                .ForMember(x => x.FromUser, opt => opt.Ignore())
                .ForMember(x => x.ToUser, opt => opt.Ignore());

            CreateMap<UpdateMessageModel, Message>();

            CreateMap<CreateMessageModel, Message>();

            #endregion

            #region Survey

            CreateMap<SurveyCoreModel, Survey>()
                .ForMember(x => x.CreatedBy, opt => opt.Ignore());

            CreateMap<Survey, SurveyCoreModel>()
                .ForMember(x => x.CreatedBy, opt => opt.Ignore());


            CreateMap<UpdateSurveyModel, Survey>();

            CreateMap<CreateSurveyModel, Survey>();

            #endregion
            #region Survey

            CreateMap<TicketCoreModel, Ticket>();

            CreateMap<Ticket, TicketCoreModel>()
                .ForMember(x => x.Priority, opt => opt.MapFrom(x=> (TicketPriority)x.Priority));


            CreateMap<UpdateTicketModel, Ticket>();

            CreateMap<CreateTicketModel, Ticket>();

            #endregion
        }
    }
}