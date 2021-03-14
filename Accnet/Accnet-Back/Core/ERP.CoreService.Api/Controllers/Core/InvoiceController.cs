using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CoreLib;
using DocuSign.eSign.Api;
using DocuSign.eSign.Model;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Invoice;
using Microsoft.AspNetCore.Mvc;

namespace ERP.CoreService.Api.Controllers.Core
{
    
    [Route("api/invoice")]
    [ApiController]
    public class InvoiceController: ControllerBase
    {
        private readonly IInvoiceBiz _invoiceBiz;
        private const string accessToken = "eyJ0eXAiOiJNVCIsImFsZyI6IlJ.....QQdL-upMmbwg"; 
        private const string accountId = "daf5048a-xxxx-xxxx-xxxx-d5ae2a842017"; 
        private const string signerName = "John Signer"; 
        private const string signerEmail = "john.signer@example.com";
        private const string docName = "World_Wide_Corp_lorem.pdf";
        private const string username = "mghodousi@accnetinc.com";
        private const string password = "magh1990";

        // Additional constants
        private const string signerClientId = "1000";
        private const string basePath = "https://demo.docusign.net/restapi";


        public InvoiceController(IInvoiceBiz invoiceBiz)
        {
            _invoiceBiz = invoiceBiz;
        }

        [HttpPost("add")]
        public Task<Result<Guid>> Add(CreateInvoiceModel model)
            => _invoiceBiz.Add(model);


        [HttpPost("get")]
        public async Task<Result<InvoiceCoreModel>> Get(BaseCoreModel coreModel)
            => await _invoiceBiz.Get(coreModel);


        [HttpPost("list")]
        public async Task<ResultList<InvoiceCoreModel>> List(FilterModel model)
            => await _invoiceBiz.List(model);


        [HttpPost("edit")]
        public async Task<Result<InvoiceCoreModel>> Edit(UpdateInvoiceModel model)
            => await _invoiceBiz.Edit(model);

        [HttpPost("sign")]
        public IActionResult Sign(BaseCoreModel coreModel)
        {
            
            // Embedded Signing Ceremony
            // 1. Create envelope request obj
            // 2. Use the SDK to create and send the envelope
            // 3. Create Envelope Recipient View request obj
            // 4. Use the SDK to obtain a Recipient View URL
            // 5. Redirect the user's browser to the URL

            // 1. Create envelope request object
            //    Start with the different components of the request
            Document document = new Document
            { DocumentBase64 = Convert.ToBase64String(global::System.IO.File.ReadAllBytes("Path")),
              Name = "Lorem Ipsum", FileExtension = "pdf", DocumentId = "1"
            };
            Document[] documents = new Document[] { document };

            // Create the signer recipient object 
            Signer signer = new Signer
            { Email = signerEmail, Name = signerName, ClientUserId = signerClientId,
              RecipientId = "1", RoutingOrder = "1"
            };

            // Create the sign here tab (signing field on the document)
            SignHere signHereTab = new SignHere
            { DocumentId = "1", PageNumber = "1", RecipientId = "1",
              TabLabel = "Sign Here Tab", XPosition = "195", YPosition = "147"
            };
            SignHere[] signHereTabs = new SignHere[] { signHereTab };

            // Add the sign here tab array to the signer object.
            signer.Tabs = new Tabs { SignHereTabs = new List<SignHere>(signHereTabs) };
            // Create array of signer objects
            Signer[] signers = new Signer[] { signer };
            // Create recipients object
            Recipients recipients = new Recipients { Signers = new List<Signer>(signers) };
            // Bring the objects together in the EnvelopeDefinition
            EnvelopeDefinition envelopeDefinition = new EnvelopeDefinition
            { EmailSubject = "Please sign the document",
              Documents = new List<Document>( documents ),
              Recipients = recipients,
              Status = "sent"
            };
            // 2. Use the SDK to create and send the envelope
            DocuSign.eSign.Client.ApiClient apiClient = new DocuSign.eSign.Client.ApiClient(basePath);
            apiClient.Configuration.AddDefaultHeader("Authorization", "Bearer " + accessToken);
            EnvelopesApi envelopesApi = new EnvelopesApi(apiClient.Configuration);
            EnvelopeSummary results = envelopesApi.CreateEnvelope(accountId, envelopeDefinition);

            // 3. Create Envelope Recipient View request obj
            string envelopeId = results.EnvelopeId;
            RecipientViewRequest viewOptions = new RecipientViewRequest
            { ReturnUrl = "localhost:5000", ClientUserId = signerClientId,
                AuthenticationMethod = "none",
                UserName = signerName, Email = signerEmail
            };

            // 4. Use the SDK to obtain a Recipient View URL
            ViewUrl viewUrl = envelopesApi.CreateRecipientView(accountId, envelopeId, viewOptions);

            // 5. Redirect the user's browser to the URL
            return Redirect(viewUrl.Url);

        }

    }
}