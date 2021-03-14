using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Business.Services.Google;
using Microsoft.AspNetCore.Mvc;

namespace ERP.CoreService.Api.Controllers.Core
{
    
    [Route("api/google")]
    [ApiController]
    public class GoogleController
    {

        private readonly PlaceApi _placeApi;

        public GoogleController(PlaceApi placeApi)
        {
            _placeApi = placeApi;
        }
        
        [HttpGet("places/{type}/{value}")]
        public Task<Result<object>> PredicatePlace([FromRoute] string type,[FromRoute] string value)
            => _placeApi.PredicatePlace(type,value);

    }
}