using System;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using CoreLib.Services;
using ERP.CoreService.DataAccess.EFModels;
using ERP.MembershipService.ApiClient.Models.User;

namespace ERP.CoreService.Business.Services.Email
{
    public class CoreSmtpClient
    {
        public async Task SendInvoice(Invoice invoice, FullUserModel user)
        {
            await Send(user.Email, GenerateInvoice(invoice, user), "AccNet Online - Invoice Paid", true);
        }

        public async Task SendRegistrationEmail(string email, string username, string password, string fullName)
        {
            var rootDir = Assembly.GetExecutingAssembly().Location;
            rootDir = rootDir.Replace("ERP.CoreService.Business.dll", "");
            rootDir += "Resource/register-confirmation.html";
            var emailBody = await File.ReadAllTextAsync(rootDir);
            emailBody = emailBody.Replace("+++++", username);
            emailBody = emailBody.Replace("-----", password);
            emailBody = emailBody.Replace("=====", fullName);
            await Send(email, emailBody, "AccNet Online - Registration Confirmation", true);
        }

        public async Task SendEFileTaxes(string email, string fullName)
        {
            var rootDir = Assembly.GetExecutingAssembly().Location;
            rootDir = rootDir.Replace("ERP.CoreService.Business.dll", "");
            rootDir += "Resource/efile-taxes.html";
            var emailBody = await File.ReadAllTextAsync(rootDir);
            emailBody = emailBody.Replace("=====", fullName);
            await Send(email, emailBody, "AccNet Online - Your taxes are being filed", true);
        }

        public async Task SendChangePassword(string email, string fullName, string username, string password)
        {
            var rootDir = Assembly.GetExecutingAssembly().Location;
            rootDir = rootDir.Replace("ERP.CoreService.Business.dll", "");
            rootDir += "Resource/change-password.html";
            var emailBody = await File.ReadAllTextAsync(rootDir);
            emailBody = emailBody.Replace("=====", fullName);
            emailBody = emailBody.Replace("+++++", username);
            emailBody = emailBody.Replace("-----", password);
            await Send(email, emailBody, "AccNet Online - Change your password", true);
        }

        public async Task SendAppointmentBookNotif(string email, string fullName, string date)
        {
            var rootDir = Assembly.GetExecutingAssembly().Location;
            rootDir = rootDir.Replace("ERP.CoreService.Business.dll", "");
            rootDir += "Resource/appointment-book.html";
            var emailBody = await File.ReadAllTextAsync(rootDir);
            emailBody = emailBody.Replace("=====", fullName);
            emailBody = emailBody.Replace("+++++", date);
            await Send("notifications@accnetonline.com", emailBody, "AccNet Online - Appointment Book", true);
        }

        public async Task SendComplimentryConsultation(string email, string fullName, string date)
        {
            var rootDir = Assembly.GetExecutingAssembly().Location;
            rootDir = rootDir.Replace("ERP.CoreService.Business.dll", "");
            rootDir += "Resource/complimentry-consultations.html";
            var emailBody = await File.ReadAllTextAsync(rootDir);
            emailBody = emailBody.Replace("=====", fullName);
            emailBody = emailBody.Replace("+++++", date);
            await Send(email, emailBody, "AccNet Online - Complimentary Consultation", true);
        }

        public async Task SendInvoiceReady(string email, string fullName)
        {
            var rootDir = Assembly.GetExecutingAssembly().Location;
            rootDir = rootDir.Replace("ERP.CoreService.Business.dll", "");
            rootDir += "Resource/invoice-ready.html";
            var emailBody = await File.ReadAllTextAsync(rootDir);
            emailBody = emailBody.Replace("=====", fullName);
            await Send(email, emailBody, "AccNet Online - Invoice Ready", true);
        }

        public async Task SendPaypalPayment(string email, string fullName)
        {
            var rootDir = Assembly.GetExecutingAssembly().Location;
            rootDir = rootDir.Replace("ERP.CoreService.Business.dll", "");
            rootDir += "Resource/paypal-payment.html";
            var emailBody = await File.ReadAllTextAsync(rootDir);
            emailBody = emailBody.Replace("=====", fullName);
            await Send(email, emailBody, "AccNet Online - Thanks for the payment", true);
        }

        public async Task SendPaysForInvoicesNotif(string email, string fullName, string date)
        {
            var rootDir = Assembly.GetExecutingAssembly().Location;
            rootDir = rootDir.Replace("ERP.CoreService.Business.dll", "");
            rootDir += "Resource/pays-for-invoice.html";
            var emailBody = await File.ReadAllTextAsync(rootDir);
            emailBody = emailBody.Replace("=====", fullName);
            emailBody = emailBody.Replace("+++++", date);
            await Send(email, emailBody, "AccNet Online - Invoice Paid", true);
        }



        public async Task SendSurveySubmittedNotif(string userEmail,string userMobile, string fullName, string date)
        {
            var rootDir = Assembly.GetExecutingAssembly().Location;
            rootDir = rootDir.Replace("ERP.CoreService.Business.dll", "");
            rootDir += "Resource/survey-submitted.html";
            var emailBody = await File.ReadAllTextAsync(rootDir);
            emailBody = emailBody.Replace("=====", fullName);
            emailBody = emailBody.Replace("+++++", date);
            emailBody = emailBody.Replace("-----", userEmail);
            emailBody = emailBody.Replace("#####", userMobile);
            await Send("notifications@accnetonline.com", emailBody, "AccNet Online - Survey Submitted", true);
        }

        public async Task SendTaxesFilling(string email, string fullName)
        {
            var rootDir = Assembly.GetExecutingAssembly().Location;
            rootDir = rootDir.Replace("ERP.CoreService.Business.dll", "");
            rootDir += "Resource/taxes-filing.html";
            var emailBody = await File.ReadAllTextAsync(rootDir);
            emailBody = emailBody.Replace("=====", fullName);
            await Send(email, emailBody, "Accnet Online - File your own taxes", true);
        }

        public async Task SendTaxesReady(string email, string fullName)
        {
            var rootDir = Assembly.GetExecutingAssembly().Location;
            rootDir = rootDir.Replace("ERP.CoreService.Business.dll", "");
            rootDir += "Resource/taxes-ready.html";
            var emailBody = await File.ReadAllTextAsync(rootDir);
            emailBody = emailBody.Replace("=====", fullName);
            await Send(email, emailBody, "Accnet Online - Income Tax Ready", true);
        }

        public async Task SendVipConsultation(string email, string fullName, string date)
        {
            var rootDir = Assembly.GetExecutingAssembly().Location;
            rootDir = rootDir.Replace("ERP.CoreService.Business.dll", "");
            rootDir += "Resource/vip-consultations.html";
            var emailBody = await File.ReadAllTextAsync(rootDir);
            emailBody = emailBody.Replace("=====", fullName);
            emailBody = emailBody.Replace("+++++", date);
            await Send(email, emailBody, "Accnet Online - VIP Consultation", true);
        }

        public async Task SendAccnetEfile(string email, string fullName)
        {
            var rootDir = Assembly.GetExecutingAssembly().Location;
            rootDir = rootDir.Replace("ERP.CoreService.Business.dll", "");
            rootDir += "Resource/accnet-efile.html";
            var emailBody = await File.ReadAllTextAsync(rootDir);
            emailBody = emailBody.Replace("=====", fullName);
            await Send("notifications@accnetonline.com", emailBody, "Accnet Online - Accnet EFile", true);
        }

        public async Task SendUserEfile(string email, string fullName)
        {
            var rootDir = Assembly.GetExecutingAssembly().Location;
            rootDir = rootDir.Replace("ERP.CoreService.Business.dll", "");
            rootDir += "Resource/user-efile.html";
            var emailBody = await File.ReadAllTextAsync(rootDir);
            emailBody = emailBody.Replace("=====", fullName);
            await Send("notifications@accnetonline.com", emailBody, "Accnet Online - User EFile", true);
        }

        public async Task SendTicketResponse(string email, string fullName)
        {
            var rootDir = Assembly.GetExecutingAssembly().Location;
            rootDir = rootDir.Replace("ERP.CoreService.Business.dll", "");
            rootDir += "Resource/ticket-responded.html";
            var emailBody = await File.ReadAllTextAsync(rootDir);
            emailBody = emailBody.Replace("=====", fullName);
            await Send(email, emailBody, "Accnet Online - Your Ticket Status", true);
        }


        public async Task Test(string mailAddress, string body)
        {
            await Send(mailAddress, body, "Accnet Online - Hamed Test", true);
        }


        public string GenerateInvoice(Invoice invoice, FullUserModel user)
        {
            StringBuilder invoiceHtml = new StringBuilder();
            invoiceHtml.Append("<b>INVOICE : ").Append(invoice.Id.ToString()).Append("</b><br />");
            invoiceHtml.Append("<b>DATE : </b>").Append(DateTime.Now.ToShortDateString()).Append("<br />");
            invoiceHtml.Append("<b>Invoice Amt :</b> $").Append(invoice.Amount - invoice.TaxAmount).Append("<br />");
            invoiceHtml.Append("<b>Invoice Tax Amt :</b> $").Append(invoice.TaxAmount).Append("<br />");
            invoiceHtml.Append("<b>Invoice Total Amt :</b> $").Append(invoice.Amount ).Append("<br />");
            invoiceHtml.Append("<br /><b>CUSTOMER CONTACT INFO:</b><br />");
            invoiceHtml.Append("<b>Name : </b>").Append(user.Firstname + " " + user.Lastname).Append("<br />");
            invoiceHtml.Append("<b>Phone : </b>").Append(user.Mobile).Append("<br />");
            invoiceHtml.Append("<b>Email : </b>").Append(user.Email).Append("<br />");
            invoiceHtml.Append("<b>Address : </b><br />").Append($"{user.Address} ,{user.City} ,{user.Province} ,{user.PostalCode}").Append("<br />");
            invoiceHtml.Append("<br /><b>Services:</b><br /><table><tr><th></th><th></th></tr>");
            // InvoiceItem should be a collection property which contains list of invoice lines
            foreach (Appointment invoiceLine in invoice.Appointment)
            {
                invoiceHtml.Append("<tr><td>").Append(invoiceLine.Duration + " minutes").Append("</td><td>")
                    .Append("VIP Consultation").Append("</td></tr>");
            }

            foreach (UserSurvey invoiceLine in invoice.UserSurvey)
            {
                invoiceHtml.Append("<tr><td>").Append("-").Append("</td><td>")
                    .Append("Calculating Taxes for " + invoiceLine.Survey.Name + " survey").Append("</td></tr>");
            }

            invoiceHtml.Append("</table>");
            return invoiceHtml.ToString();
        }

        private async Task Send(string email, string body, string subject, bool isHtml = false)
        {
            SmtpClient client = new SmtpClient("67.231.19.132", 26);
//                client.EnableSsl = true;
            client.UseDefaultCredentials = false;
            var nc = new NetworkCredential("support@accnetonline.com", "Accnet@123");
            client.Credentials = nc;
            MailAddress from = new MailAddress("support@accnetonline.com",
                " ",
                Encoding.UTF8);
            var to = new MailAddress(email);
            var message = new MailMessage(from, to);
            message.Body = body;
            message.IsBodyHtml = isHtml;
            message.BodyEncoding = Encoding.UTF8;
            message.Subject = subject;
            message.SubjectEncoding = Encoding.UTF8;
            await client.SendMailAsync(message);
            var a = 1;
        }
    }
}