using System;
using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Core.Models.Comment;

namespace ERP.CoreService.Business.Interfaces
{
    public interface ICommentBiz
    {
        Task<Result<Guid>> Add(CreateCommentModel model);
        Task<Result<CommentCoreModel>> Edit(UpdateCommentModel model);

    }
}