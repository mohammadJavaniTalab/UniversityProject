using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using CoreLib;
using CoreLib.Services;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Core.Base;
using ERP.CoreService.Core.Models;
using Blob = ERP.CoreService.DataAccess.EFModels.Blob;

namespace ERP.CoreService.Business.Classes
{
    public class BlobBiz : Base, IBlobBiz
    {
        private readonly IRepository _repository;

        public BlobBiz(IServiceProvider provider,
            IGeneralDataService generalDataService,
            IMapperService mapper,
            IRepository repository,
            IMapper autoMapper,
            IAppSettings appSettings,
            ILogger logger) : base(mapper, logger,
            generalDataService, autoMapper)
        {
            _repository = repository;
        }

        public Task<Result<Guid>> Add(byte[] file, string fileName, string contentType)
            => Result<Guid>.TryAsync(async () =>
            {
                var blob = new DataAccess.EFModels.Blob()
                {
                    Id = Guid.NewGuid(),
                    Title = fileName,
                    CreationDate = DateTime.Now,
                    ContentType = contentType,
                    File = file
                };
                _repository.Add(blob);
                await _repository.CommitAsync();

                return Result<Guid>.Successful(blob.Id);
            });

        public Task<Result<DataAccess.EFModels.Blob>> Get(BaseCoreModel coreModel)
            => Result<DataAccess.EFModels.Blob>.TryAsync(async () =>
            {
                var result = await _repository.FirstOrDefaultAsNoTrackingAsync<DataAccess.EFModels.Blob>(b => b.Id == coreModel.Id);
                if (result.Data == null)
                    return Result<DataAccess.EFModels.Blob>.Failed(Error.WithCode(ErrorCodes.NotFound));

                return Result<DataAccess.EFModels.Blob>.Successful(result.Data);
            });

        public Task<Result<IList<Blob>>> ListById(List<Guid> blobIds)
            => Result<IList<Blob>>.TryAsync(async () =>
            {
                var blobs =await _repository.ListAsNoTrackingAsync<Blob>(b => blobIds.Contains(b.Id));
                
                return Result<IList<Blob>>.Successful(blobs.Data);
            });
    }
}