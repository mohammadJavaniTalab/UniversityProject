using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using CoreLib;
using DocuSign.eSign.Api;
using DocuSign.eSign.Model;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Business.Services.Docusign;
using ERP.CoreService.Core.Base;
using ERP.CoreService.Core.Models;
using ERP.CoreService.DataAccess.EFModels;
using ERP.MembershipService.ApiClient;
using ERP.MembershipService.ApiClient.Models;
using ERP.MembershipService.ApiClient.Models.Organization;
using ERP.MembershipService.ApiClient.Models.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Internal;
using Statistics = ERP.CoreService.Business.Statistics;

namespace ERP.CoreService.Api.Controllers.Membership
{
    [Route("api/blob")]
    [ApiController]
    public class BlobController : ControllerBase
    {
        private readonly IBlobBiz _blobBiz;
        private readonly IUserSurveyBiz _userSurveyBiz;
        private readonly IMembershipServiceApi _membershipServiceApi;
        private readonly DocusignHttpClient _docusignHttpClient;
        private readonly ITaxBiz _taxBiz;


        #region ForPDF

        private const string accountId = "a9f28cf2-d3cd-446d-af7d-5a33faeeb0e9";
        private const string docName = "World_Wide_Corp_lorem.pdf";

        // Additional constants
        private const string basePath = "https://demo.docusign.net/restapi";

        // Change the port number in the Properties / launchSettings.json file:
        //     "iisExpress": {
        //        "applicationUrl": "http://localhost:5050",
        private const string returnUrl = "http://accnetonline.com/client/taxes";

        #endregion


        public BlobController(IBlobBiz blobBiz, IMembershipServiceApi membershipServiceApi,
            DocusignHttpClient docusignHttpClient, ITaxBiz taxBiz,
            IUserSurveyBiz userSurveyBiz)
        {
            _taxBiz = taxBiz;
            _docusignHttpClient = docusignHttpClient;
            _userSurveyBiz = userSurveyBiz;
            _blobBiz = blobBiz;
            _membershipServiceApi = membershipServiceApi;
        }

        [HttpPost("upload")]
        public Task<Result<Guid>> Upload(IFormFile file)
            => Result<Guid>.TryAsync(async () =>
            {
                if (file == null || file.Length == 0 || file.Length > 10000000)
                    return Result<Guid>.Failed(Error.WithCode(BaseErrorCodes.InvalidModel));

                if (file.ContentType.ToLower().Contains("jpg") || file.ContentType.ToLower().Contains("png") ||
                    file.ContentType.ToLower().Contains("pdf") || file.ContentType.ToLower().Contains("jpeg") ||
                    file.ContentType.ToLower().Contains("xls") || file.ContentType.ToLower().Contains("xlsx") ||
                    file.ContentType.ToLower().Contains("doc") || file.ContentType.ToLower().Contains("docx") ||
                    file.ContentType.ToLower().Contains("csv"))
                    using (var stream = new MemoryStream())
                    {
                        await file.CopyToAsync(stream);
                        await stream.FlushAsync();
                        var blobId = await _blobBiz.Add(stream.ToArray(), file.FileName, file.ContentType);
                        stream.Close();
                        stream.Dispose();
                        return blobId;
                    }

                return Result<Guid>.Failed(Error.WithData(1000, new[] {"file format is not supported"}));
            });

        [HttpGet("download/{blobId:Guid}")]
        public async Task<IActionResult> Download([FromRoute] Guid blobId)
        {
            var result = await _blobBiz.Get(new BaseCoreModel {Id = blobId});
            if (!result.Success || result.Data == null)
                return new BadRequestObjectResult("");
            return File((result.Data.File), result.Data.ContentType);
        }

        [HttpGet("user-survey/download/{userid:Guid}/{surveyid:Guid}")]
        public async Task<IActionResult> DownloadUserSurvey([FromRoute] Guid userid, [FromRoute] Guid surveyid)
        {
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);

            var setting = await _membershipServiceApi.AuthAuthApiService.Setting(new BaseModel {Id = userId});
            if (setting.Data.Role.Name.ToLower().Contains("normaluser") && userid != userId)
                return NotFound();


            var survey = await _userSurveyBiz.GetByUserIdAndSurveyId(userid, surveyid);
            if (!survey.Success)
                return Ok(survey);


            var user = await _membershipServiceApi.SystemUserApiService.Get(
                new MembershipService.ApiClient.Models.BaseModel
                    {Id = userid});
            var linkedUsers = await _membershipServiceApi.SystemLinkedUserApiService.ListByUserFullModel(
                new MembershipService.ApiClient.Models.BaseModel {Id = userid});
            if (!user.Success || user.Data == null)
                return new BadRequestObjectResult("no user found");

            user.Data.Username = user.Data.Username.Replace(".", "");


            Console.WriteLine("111111111");

            #region Clean Uploadd And Resource Folder 

            DirectoryInfo di =
                new DirectoryInfo("/home/ubuntu/Workdir/Resource");

            foreach (FileInfo file in di.GetFiles())
            {
                if (!file.Name.Contains("user"))
                    file.Delete();
            }


            DirectoryInfo di2 =
                new DirectoryInfo("/home/ubuntu/Workdir/Upload");

            foreach (FileInfo file in di2.GetFiles())
            {
                file.Delete();
            }

            #endregion


            Console.WriteLine("2222222222");
            var child = "";
            var medical = "";
            var selfEmployed = "";

            try
            {
                var assessments = survey.Data.UserAssessmentSurvey
                    .SelectMany(a => a.UserAssessmentBlob.Select(ua => ua.Blob)).ToList();

                child = assessments.Any(a => a.UserAssessmentBlob.Any(b => b.Blob.Title.Contains("Child_ExtraFile_")))
                    ? "Uploaded"
                    : "-";
                medical = assessments.Any(a =>
                    a.UserAssessmentBlob.Any(b => b.Blob.Title.Contains("Medical_ExtraFile_")))
                    ? "Uploaded"
                    : "-";
                selfEmployed =
                    assessments.Any(
                        a => a.UserAssessmentBlob.Any(b => b.Blob.Title.Contains("SelfEmployed_ExtraFile_")))
                        ? "Uploaded"
                        : "-";
            }
            catch (Exception e)
            {
            }

            #region Create Excel from survey user

            // Create a string array with the lines of text
            var lines = new List<string> {" ,Question,Answer,Action"};

            var dependents = new List<string>();
            var relatives = new List<string>();
            var dependentIds = survey.Data.UserDependentSurvey.Select(d => d.UserId);
            if (survey.Data.UserDependentSurvey != null && survey.Data.UserDependentSurvey.Any())
            {
                if (linkedUsers.Success && linkedUsers.Data != null)
                {
                    dependents = linkedUsers.Data.Select(d =>
                        {
                            if (d.FirstUser.DateOfBirth == null)
                                d.FirstUser.DateOfBirth = DateTime.Now;
                            var pobox = "";
                            if (!string.IsNullOrEmpty(d.FirstUser.PoBox))
                                pobox = "PO" + d.FirstUser.PoBox;

                            return
                                $"{d.FirstUser.Firstname}/{d.FirstUser.Lastname}/+1{d.FirstUser.Mobile}/{d.FirstUser.DateOfBirth.Value.ToString("yyyy MMMM dd")}/{d.FirstUser.Email}/{d.FirstUser.SinNumber}/{pobox}/{d.FirstUser.Address.Replace(",", " ")} {d.FirstUser.City} {d.FirstUser.Province} {d.FirstUser.PostalCode}/{d.RelationType}";
                        })
                        .ToList();
                }
            }

            if (survey.Data.UserRelativeSurvey != null && survey.Data.UserRelativeSurvey.Any())
            {
                var userRelatives =
                    await _membershipServiceApi.MembershipRelativeApiService.ListByUser(new BaseModel {Id = userid});
                var relativesId = survey.Data.UserRelativeSurvey?.Select(ud => ud.RelativeId);
                if (linkedUsers.Success && linkedUsers.Data != null)
                {
                    relatives = userRelatives.Data.Where(ur => relativesId.Contains(ur.Id)).Select(d =>
                            $"{d.Firstname}/{d.Lastname}/{d.DateOfBirth.ToString("yyyy MMMM dd")}/{d.RelationType}/{d.SinNumber}")
                        .ToList();
                }
            }

            lines.AddRange(survey.Data.UserAnswer.OrderBy(ua => ua.Answer.Question.Number).Select(us =>
            {
                var line = "";
                line =
                    $"Question {(int) us.Answer.Question.Number},{us.Answer.Question.Text.Replace(",", "").Replace("\n", "")},";

                if (us.Answer.Question.Number == 23)
                    line += $"{child},";
                else if(us.Answer.Question.Number == 24)
                    line += $"{medical},";
                else if(us.Answer.Question.Number == 25)
                    line += $"{selfEmployed},";

                else if ((AnswerType) us.Answer.Type != AnswerType.Static &&
                         (AnswerType) us.Answer.Type != AnswerType.Checkbox)
                    line += $"{us.Text.Replace(",", "").Replace("\n", "")},";
                else
                    line += $"{us.Answer.Text.Replace(",", "").Replace("\n", "")},";


                line += us.Answer.Action.Select(a => $"{a.Type}").Any()
                    ? $"{us.Answer?.Action?.Select(a => ((ActionType) a.Type).ToString()).Aggregate((a, b) => $"{a},{b}")} , "
                    : " , ";

                if (us.Answer.Action.Any(a => a.Type == (int) ActionType.AddSpouse))
                    line += $"{dependents.FirstOrDefault(d => d.ToLower().Contains("spouse"))} , ";


                if (us.Answer.Action.Any(a => a.Type == (int) ActionType.AddDependent))
                    line +=
                        dependents.Where(d => !d.ToLower().Contains("spouse")).Any()
                            ? $"{dependents.Where(d => !d.ToLower().Contains("spouse")).Aggregate((a, b) => $"{a} ******** {b}")} ,"
                            : " ,";
                if (us.Answer.Action.Any(a => a.Type == (int) ActionType.AddRelative))
                    line += relatives.Any() ? $"{relatives.Aggregate((a, b) => $"{a} ********* {b}")}" : " ,";
                Console.WriteLine(line);
                return line;
            }).ToList());
            // Set a variable to the Documents path.


            Console.WriteLine("3333333333");

            // Write the string array to a new file named "WriteLines.txt".
            using (StreamWriter outputFile =
                new StreamWriter($"/home/ubuntu/Workdir/Resource/{survey.Data.Survey.Name}.csv"))
            {
                foreach (string line in lines)
                    await outputFile.WriteLineAsync(line);
            }

            var userDetail = user.Data;
            var linkedUsersDetail = linkedUsers.Data;
            using (StreamWriter outputFile =
                new StreamWriter($"/home/ubuntu/Workdir/Resource/{userDetail.Username}.csv"))
            {
                Console.WriteLine("3333333333.22222222");
                var spouse =
                    linkedUsersDetail.FirstOrDefault(a =>
                        a.RelationType == "Spouse" || a.RelationType == "Partner");
                Console.WriteLine("3333333333.333333");

                if (spouse == null)
                    spouse = new LinkedFullUserModel {FirstUser = new FullUserModel()};

                var province = Statistics.Provinces.FirstOrDefault(p => p.name == user.Data.Province);
                if (province == null)
                    province = new Statistics.Province {name = user.Data.Province, code = user.Data.Province};
                if (user.Data.DateOfBirth == null)
                    user.Data.DateOfBirth = DateTime.Now;
                await outputFile.WriteLineAsync(
                    $"{user.Data.SinNumber},{user.Data.Lastname},{user.Data.Firstname},{user.Data.DateOfBirth.Value.ToString("d")},,{user.Data.Address.Replace(",", " ")},{user.Data.PoBox},{user.Data.City},{province?.code},{user.Data.PostalCode},{user.Data.Mobile},{spouse.FirstUser.SinNumber},{spouse.FirstUser.Lastname},{spouse.FirstUser.Firstname}");
            }

            Console.WriteLine("3333333333.5555555");

            #endregion


            Console.WriteLine("3333333333.88888888");

            var blobIds = user.Data.Receipts.Select(r => r.Id).ToList();
            try
            {
                if (dependentIds.Any())
                {
                    var dependentsFulldto =
                        await _membershipServiceApi.SystemUserApiService.FullListByIds(dependentIds);
                    var reciepts = dependentsFulldto.Data.SelectMany(d => d.Receipts).Where(d => d != null)
                        .Select(r => r.Id).ToList();
                    blobIds.AddRange(reciepts);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }


            var result = await _blobBiz.ListById(blobIds);
            if (!result.Success || result.Data == null)
                result.Data = new List<Blob>();
            Console.WriteLine("44444444444444");

            try
            {
                var assessments = survey.Data.UserAssessmentSurvey
                    .SelectMany(a => a.UserAssessmentBlob.Select(ua => ua.Blob)).ToList();
                assessments.ForEach(ass => result.Data.Add(ass));
            }
            catch (Exception e)
            {
                Console.WriteLine("no assessment ");
            }

            var filePaths = new List<string>();
            for (int i = 0; i < result.Data.Count; i++)
            {
                var blob = result.Data[i];

                blob.ContentType = blob.ContentType.Replace("image/", ".");
                blob.ContentType = blob.ContentType.Replace("application/", ".");
                if (blob.ContentType.Contains("spreadsheetml"))
                {
                    blob.ContentType = "";
                }

                var filepath = "/home/ubuntu/Workdir/Resource/" +
                               new Random().Next(1, 100) + blob.Title +
                               blob.ContentType;
                filePaths.Add(filepath);
                await global::System.IO.File.WriteAllBytesAsync(filepath, blob.File);
            }

            Thread.Sleep(2000);


            ZipFile.CreateFromDirectory(
                "/home/ubuntu/Workdir/Resource",
                $"/home/ubuntu/Workdir/Upload/{user.Data.Username}.zip");
            Console.WriteLine("555555555555");


            const string contentType = "application/zip";
            HttpContext.Response.ContentType = contentType;
            return new FileContentResult(
                await global::System.IO.File.ReadAllBytesAsync(
                    $"/home/ubuntu/Workdir/Upload/{user.Data.Username}.zip"),
                contentType)
            {
                FileDownloadName = $"{user.Data.Username}.zip"
            };
        }

        [HttpGet("engagement/{accessCode}/{taxId:Guid}")]
        public async Task<IActionResult> OnPostAsync([FromRoute] string accessCode, [FromRoute] Guid taxId)
        {
            var tax = await _taxBiz.Get(new BaseCoreModel {Id = taxId});

            var result = await _membershipServiceApi.SystemUserApiService.Get(
                new MembershipService.ApiClient.Models.BaseModel
                    {Id = tax.Data.User.Id});

            var bytesAsync =
                await global::System.IO.File.ReadAllBytesAsync(
                    "/home/ubuntu/Workdir/AccnetEngagement.pdf");

            var documentBase64 = Convert.ToBase64String(bytesAsync);
            var accessToken = await _docusignHttpClient.GetAccessToken(accessCode);
            var userInfo = await _docusignHttpClient.GetUserInfo(accessToken.Data);

            Document document = new Document
            {
                DocumentBase64 = documentBase64,
                Name = "test", FileExtension = "pdf", DocumentId = "1"
            };
            Document[] documents = new Document[] {document};

            // Create the signer recipient object 
            Signer signer = new Signer
            {
                Email = userInfo.Data.email, Name = userInfo.Data.name, ClientUserId = userInfo.Data.sub,
                RecipientId = "1", RoutingOrder = "1"
            };

            // Create the sign here tab (signing field on the document)


            var dateSigned = new DocuSign.eSign.Model.DateSigned()
            {
                DocumentId = "1", PageNumber = "1", RecipientId = "1",
                TabLabel = "Date Signed Tab", XPosition = "70", YPosition = "120",
                Value = DateTime.Now.ToString("d")
            };

            var fullName1 = new DocuSign.eSign.Model.Text()
            {
                DocumentId = "1", PageNumber = "1", RecipientId = "1",
                TabLabel = "Full Name Tab", XPosition = "69", YPosition = "130",
                Value = result.Data.Firstname + " " + result.Data.Lastname
            };

            var text = new DocuSign.eSign.Model.Text()
            {
                DocumentId = "1", PageNumber = "1", RecipientId = "1",
                TabLabel = "Text Tab", XPosition = "69", YPosition = "140", Value = result.Data.Address
            };

            var fullName4 = new DocuSign.eSign.Model.Text
            {
                DocumentId = "1", PageNumber = "1", RecipientId = "1",
                TabLabel = "Full Name Tab", XPosition = "100", YPosition = "155",
                Value = result.Data.Gender + " " + result.Data.Firstname + " " + result.Data.Lastname
            };

            var text1 = new DocuSign.eSign.Model.Text()
            {
                DocumentId = "1", PageNumber = "1", RecipientId = "1",
                TabLabel = "Text Tab", XPosition = "370", YPosition = "202", Value = tax.Data.Title
            };
            var text2 = new DocuSign.eSign.Model.Text()
            {
                DocumentId = "1", PageNumber = "1", RecipientId = "1",
                TabLabel = "Text Tab", XPosition = "150", YPosition = "260", Value = tax.Data.Title
            };


            var fullName2 = new DocuSign.eSign.Model.Text
            {
                DocumentId = "1", PageNumber = "1", RecipientId = "1",
                TabLabel = "Full Name Tab", XPosition = "240", YPosition = "260",
                Value = result.Data.Firstname + " " + result.Data.Lastname
            };
            var fullName3 = new DocuSign.eSign.Model.Text
            {
                DocumentId = "1", PageNumber = "1", RecipientId = "1",
                TabLabel = "Full Name Tab", XPosition = "430", YPosition = "260",
                Value = result.Data.Firstname + " " + result.Data.Lastname
            };


            SignHere signHereTab = new SignHere
            {
                DocumentId = "1", PageNumber = "1", RecipientId = "1",
                TabLabel = "Sign Here Tab", XPosition = "400", YPosition = "650"
            };
            SignHere[] signHereTabs = new SignHere[] {signHereTab};
            DateSigned[] dateSigns = new DateSigned[] {dateSigned};
            Text[] texts = new Text[] {text, text1, text2, fullName1, fullName2, fullName3, fullName4};

            // Add the sign here tab array to the signer object.
            signer.Tabs = new Tabs
            {
                SignHereTabs = new List<SignHere>(signHereTabs),
                DateSignedTabs = new List<DateSigned>(dateSigns), TextTabs = new List<Text>(texts)
            };
            // Create array of signer objects
            Signer[] signers = new Signer[] {signer};
            // Create recipients object
            Recipients recipients = new Recipients {Signers = new List<Signer>(signers)};
            // Bring the objects together in the EnvelopeDefinition
            EnvelopeDefinition envelopeDefinition = new EnvelopeDefinition
            {
                EmailSubject = "Please sign the document",
                Documents = new List<Document>(documents),
                Recipients = recipients,
                Status = "sent"
            };
            // 2. Use the SDK to create and send the envelope
            var apiClient = new DocuSign.eSign.Client.ApiClient(basePath);
            apiClient.Configuration.AddDefaultHeader("Authorization", "Bearer " + accessToken.Data);
            EnvelopesApi envelopesApi = new EnvelopesApi(apiClient.Configuration);
            EnvelopeSummary results = envelopesApi.CreateEnvelope(accountId, envelopeDefinition);

            // 3. Create Envelope Recipient View request obj
            string envelopeId = results.EnvelopeId;
            RecipientViewRequest viewOptions = new RecipientViewRequest
            {
                ReturnUrl = returnUrl, ClientUserId = userInfo.Data.sub,
                AuthenticationMethod = "none",
                UserName = userInfo.Data.name, Email = userInfo.Data.email
            };

            // 4. Use the SDK to obtain a Recipient View URL
            ViewUrl viewUrl = envelopesApi.CreateRecipientView(accountId, envelopeId, viewOptions);

            return Ok(Result<string>.Successful(viewUrl.Url));
        }

//        [
//            HttpGet("personalTax/{accessCode}/{taxId:Guid}")]
//        public async Task<IActionResult> PersonalTax([FromRoute] string accessCode, [FromRoute] Guid taxId)
//        {
//            var tax = await _taxBiz.Get(new BaseCoreModel {Id = taxId});
//
//            var result = await _membershipServiceApi.SystemUserApiService.Get(
//                new MembershipService.ApiClient.Models.BaseModel
//                    {Id = tax.Data.User.Id});
//
//
//            var blob = (await _blobBiz.Get(new BaseCoreModel {Id = tax.Data.BlobId})).Data;
//
//            blob.ContentType = blob.ContentType.Replace("application/", ".");
//            var filepath = "/home/ubuntu/Workdir/Resource/" +
//                           blob.Id +
//                           blob.ContentType;
//            await global::System.IO.File.WriteAllBytesAsync(filepath, blob.File);
//
//
////            var bytes = Encoding.ASCII.GetBytes(data);
//            var bytesAsync =
//                await global::System.IO.File.ReadAllBytesAsync(
//                    "/home/ubuntu/Workdir/Resource/" +
//                    blob.Id +
//                    blob.ContentType);
//
//            var documentBase64 = Convert.ToBase64String(bytesAsync);
//            var accessToken = await _docusignHttpClient.GetAccessToken(accessCode);
//            var userInfo = await _docusignHttpClient.GetUserInfo(accessToken.Data);
//
//            Document document = new Document
//            {
//                DocumentBase64 = documentBase64,
//                Name = "test", FileExtension = "pdf", DocumentId = "1"
//            };
//            Document[] documents = new Document[] {document};
//
//            // Create the signer recipient object 
//            Signer signer = new Signer
//            {
//                Email = userInfo.Data.email, Name = userInfo.Data.name, ClientUserId = userInfo.Data.sub,
//                RecipientId = "1", RoutingOrder = "1"
//            };
//
//            // Create the sign here tab (signing field on the document)
//
//
//            SignHere signHereTab = new SignHere
//            {
//                DocumentId = "1", PageNumber = "1", RecipientId = "1",
//                TabLabel = "Sign Here Tab", XPosition = "400", YPosition = "650"
//            };
//            SignHere[] signHereTabs = new SignHere[] {signHereTab};
//
//            // Add the sign here tab array to the signer object.
//            signer.Tabs = new Tabs
//            {
//                SignHereTabs = new List<SignHere>(signHereTabs)
//            };
//            // Create array of signer objects
//            Signer[] signers = new Signer[] {signer};
//            // Create recipients object
//            Recipients recipients = new Recipients {Signers = new List<Signer>(signers)};
//            // Bring the objects together in the EnvelopeDefinition
//            EnvelopeDefinition envelopeDefinition = new EnvelopeDefinition
//            {
//                EmailSubject = "Please sign the document",
//                Documents = new List<Document>(documents),
//                Recipients = recipients,
//                Status = "sent"
//            };
//            // 2. Use the SDK to create and send the envelope
//            var apiClient = new DocuSign.eSign.Client.ApiClient(basePath);
//            apiClient.Configuration.AddDefaultHeader("Authorization", "Bearer " + accessToken.Data);
//            EnvelopesApi envelopesApi = new EnvelopesApi(apiClient.Configuration);
//            EnvelopeSummary results = envelopesApi.CreateEnvelope(accountId, envelopeDefinition);
//
//            // 3. Create Envelope Recipient View request obj
//            string envelopeId = results.EnvelopeId;
//            RecipientViewRequest viewOptions = new RecipientViewRequest
//            {
//                ReturnUrl = returnUrl, ClientUserId = userInfo.Data.sub,
//                AuthenticationMethod = "none",
//                UserName = userInfo.Data.name, Email = userInfo.Data.email
//            };
//
//            // 4. Use the SDK to obtain a Recipient View URL
//            ViewUrl viewUrl = envelopesApi.CreateRecipientView(accountId, envelopeId, viewOptions);
//
//            return Ok(Result<string>.Successful(viewUrl.Url));
//        }
    }
}