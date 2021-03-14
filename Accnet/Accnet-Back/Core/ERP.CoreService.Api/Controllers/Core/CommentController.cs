using System;
using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Core.Models.Comment;
using Microsoft.AspNetCore.Mvc;

namespace ERP.CoreService.Api.Controllers.Core
{
    
    [Route("api/comment")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ICommentBiz _commentBiz;

        public CommentController(ICommentBiz commentBiz)
        {
            _commentBiz = commentBiz;
        }

        [HttpPost("add")]
        public Task<Result<Guid>> Add(CreateCommentModel model)
            => _commentBiz.Add(model);
        

        [HttpPost("edit")]
        public async Task<Result<CommentCoreModel>> Edit(UpdateCommentModel model)
            => await _commentBiz.Edit(model);

    }
}