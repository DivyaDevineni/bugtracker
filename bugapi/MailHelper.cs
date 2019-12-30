
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Web;

namespace bugapi
{
    public static class MailHelper
    {
        public static void SendMail(string to, string subject, string body)
        {
            SmtpClient client = new SmtpClient();
            client.Port = Convert.ToInt32(ConfigurationManager.AppSettings["emailportno"].ToString());
            client.Host = ConfigurationManager.AppSettings["emailhost"].ToString();
            client.EnableSsl = true;
            client.Timeout = 10000;
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.UseDefaultCredentials = false;
            client.Credentials = new System.Net.NetworkCredential(ConfigurationManager.AppSettings["emailusername"].ToString(), ConfigurationManager.AppSettings["emailpassword"].ToString());

            MailMessage mm = new MailMessage(ConfigurationManager.AppSettings["emailfrom"].ToString(), to, subject, body);
            mm.BodyEncoding = UTF8Encoding.UTF8;
            mm.DeliveryNotificationOptions = DeliveryNotificationOptions.OnFailure;
            mm.IsBodyHtml = true;

            client.Send(mm);

        }
    }
   }