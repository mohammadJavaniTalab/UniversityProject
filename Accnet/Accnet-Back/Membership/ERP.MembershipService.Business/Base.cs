using AutoMapper;
using CoreLib;
using CoreLib.Services;

namespace ERP.MembershipService.Business
{
    public class Base
    {
        protected readonly IMapperService mapper;
        protected readonly IMapper _autoMapper;
        protected readonly ILogger logger;
        protected readonly IGeneralDataService generalDataService;
        
        protected Base(IMapperService mapper, ILogger logger, IGeneralDataService generalDataService,IMapper autoMapper)
        {
            _autoMapper = autoMapper;
            this.mapper = mapper;
            this.logger = logger;
            this.generalDataService = generalDataService;
        }
    }
}