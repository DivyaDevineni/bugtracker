using System;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Npgsql;
using System.Web;
using Newtonsoft.Json;
using System.Web.Http.Cors;
using System.IO;
using System.Text;

namespace bugapi.Controllers
{

    [RoutePrefix("api/bug")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class BugController : ApiController
    {

        public static string _connectionString = ConfigurationManager.ConnectionStrings["FleetConnect"].ToString();

        ResultMessage objrm = new ResultMessage();

        [HttpPost]
        [Route("CreateBug")]
        public HttpResponseMessage CreateBug(Bug input)
        {

            StringBuilder sblogs = new StringBuilder();
            string methodname = "CreateBug";
            try
            {
                //StringBuilder sblogs = new StringBuilder();
                sblogs.AppendLine("CreateBug start");

                Bugwrapper root = new Bugwrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("CreateBug input : " + json);
                sblogs.AppendLine("db call started  : ");


                string result = BugInformation(json);

                sblogs.AppendLine("db call done  : ");
                var obj = JsonConvert.DeserializeObject<dynamic>(result);

                var data = obj;

                ////Email notification
                String strHTML = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath("~/Template/Emailnotification.html"));
                sblogs.AppendLine("reading template is done ");
                try
                {
                    //strHTML = strHTML.Replace("{{#username#}}", data.user_username.Value);


                    strHTML = strHTML.Replace("{{#bugtitle#}}", data.bug_title.Value);
                    strHTML = strHTML.Replace("{{#description#}}", data.bug_description.Value);
                    strHTML = strHTML.Replace("{{#bugid#}}", data.bug_id.Value.ToString());
                    strHTML = strHTML.Replace("{{#status#}}", data.statusname.status_name.Value);
                    //strHTML = strHTML.Replace("{{#emailid#}}", data.emailid.user_emailid.Value);
                    strHTML = strHTML.Replace("{{#assignee#}}", input.bug_assignedby);
                    strHTML = strHTML.Replace("{{#projname#}}", data.projname.proj_name.Value);


                }
                catch (Exception ex)
                {
                    sblogs.AppendLine("exception while replacing html");
                }

                try
                {
                    if (data.emailid.user_emailid.Value == "")
                    {
                        sblogs.AppendLine("SendMail  called");
                        strHTML = strHTML.Replace("{{#emailid#}}", input.bug_assignedby);
                        MailHelper.SendMail(input.bug_assignedby, "Bug", strHTML);
                    }
                    else
                    {
                        sblogs.AppendLine("SendMail else called  ");
                        strHTML = strHTML.Replace("{{#emailid#}}", data.emailid.user_emailid.Value);
                        MailHelper.SendMail(data.emailid.user_emailid.Value, "Bug", strHTML);
                    }

                }
                catch (Exception ex)
                {
                    //throw;
                    sblogs.AppendLine("SendMail exception  " + ex.Message);
                    Logging.AddtoLogFile(sblogs.ToString(), methodname);
                    return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
                }
                var jsonobj = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });

                objrm.Message = jsonobj;
                Logging.AddtoLogFile(sblogs.ToString(), methodname);
                return Request.CreateResponse(HttpStatusCode.OK, objrm);

            }
            catch (Exception ex)
            {
                sblogs.AppendLine("exception   : " + ex.Message);
                Logging.AddtoLogFile(sblogs.ToString(), methodname + "_error");
                return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
            }

        }

        [HttpPost]
        [Route("UpdateBug")]
        public HttpResponseMessage UpdateBug(Bug input)
        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "UpdateBug";
            try
            {
                //StringBuilder sblogs = new StringBuilder();
                sblogs.AppendLine("UpdateBug start");

                Bugwrapper root = new Bugwrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("UpdateBug input : " + json);
                sblogs.AppendLine("db call started  : ");

                string result = UpdateBugInformation(json);
                sblogs.AppendLine("db call done  : ");
                var obj = JsonConvert.DeserializeObject<dynamic>(result);

                var data = obj;

                ////Email notification
                String strHTML = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath("~/Template/Emailnotification.html"));
                sblogs.AppendLine("reading template is done ");
                try
                {
                    //strHTML = strHTML.Replace("{{#username#}}", data.user_username.Value);


                    strHTML = strHTML.Replace("{{#bugtitle#}}", data.bug_title.Value);
                    strHTML = strHTML.Replace("{{#description#}}", data.bug_description.Value);
                    strHTML = strHTML.Replace("{{#bugid#}}", data.bug_id.Value.ToString());
                    strHTML = strHTML.Replace("{{#status#}}", data.statusname.status_name.Value);
                    //strHTML = strHTML.Replace("{{#emailid#}}", data.emailid.user_emailid.Value);
                    strHTML = strHTML.Replace("{{#assignee#}}", input.bug_assignedby);
                    strHTML = strHTML.Replace("{{#projname#}}", data.projname.proj_name.Value);


                }
                catch (Exception ex)
                {
                    sblogs.AppendLine("exception while replacing html");
                }

                try
                {
                    if (data.emailid.user_emailid.Value == "")
                    {
                        sblogs.AppendLine("SendMail  called");
                        strHTML = strHTML.Replace("{{#emailid#}}", input.bug_assignedby);
                        MailHelper.SendMail(input.bug_assignedby, "Bug", strHTML);
                    }
                    else
                    {
                        sblogs.AppendLine("SendMail else called  ");
                        strHTML = strHTML.Replace("{{#emailid#}}", data.emailid.user_emailid.Value);
                        MailHelper.SendMail(data.emailid.user_emailid.Value, "Bug", strHTML);
                    }

                }
                catch (Exception ex)
                {
                    //throw;
                    sblogs.AppendLine("SendMail exception  " + ex.Message);
                    Logging.AddtoLogFile(sblogs.ToString(), methodname);
                    return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
                }
                var jsonobj = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });

                objrm.Message = jsonobj;
                Logging.AddtoLogFile(sblogs.ToString(), methodname);
                return Request.CreateResponse(HttpStatusCode.OK, objrm);

            }
            catch (Exception ex)
            {
                sblogs.AppendLine("exception   : " + ex.Message);
                Logging.AddtoLogFile(sblogs.ToString(), methodname + "_error");
                return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
            }
        }


        [HttpPost]
        [Route("CreateComment")]
        public HttpResponseMessage CreateComment(Bug input)
        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "CreateComment";
            try
            {
                //StringBuilder sblogs = new StringBuilder();
                sblogs.AppendLine("CreateComment start");

                Bugwrapper root = new Bugwrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("CreateComment input : " + json);
                sblogs.AppendLine("db call started  : ");

                string result = Comment(json);
                sblogs.AppendLine("db call done  : ");
                objrm.Message = result;

                sblogs.AppendLine("data send to UI   : ");
                Logging.AddtoLogFile(sblogs.ToString(), methodname);

                return Request.CreateResponse(HttpStatusCode.OK, objrm);
            }
            catch (Exception ex)
            {
                sblogs.AppendLine("exception   : " + ex.Message);
                Logging.AddtoLogFile(sblogs.ToString(), methodname + "_error");
                return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
            }
        }

        [HttpPost]
        [Route("UpdateComment")]
        public HttpResponseMessage UpdateComment(Bug input)
        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "UpdateComment";
            try
            {
                //StringBuilder sblogs = new StringBuilder();
                sblogs.AppendLine("UpdateComment start");

                Bugwrapper root = new Bugwrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("UpdateComment input : " + json);
                sblogs.AppendLine("db call started  : ");

                string result = UpdateCommentInformation(json);
                sblogs.AppendLine("db call done  : ");
                objrm.Message = result;
                sblogs.AppendLine("data send to UI   : ");
                Logging.AddtoLogFile(sblogs.ToString(), methodname);
                return Request.CreateResponse(HttpStatusCode.OK, objrm);
            }
            catch (Exception ex)
            {
                sblogs.AppendLine("exception   : " + ex.Message);
                Logging.AddtoLogFile(sblogs.ToString(), methodname + "_error");
                return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
            }
        }

        [HttpPost]
        [Route("BugList")]
        public HttpResponseMessage BugList(Bug input)

        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "BugList";
            try
            {
                //StringBuilder sblogs = new StringBuilder();
                sblogs.AppendLine("BugList start");
                Bugwrapper root = new Bugwrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });

                sblogs.AppendLine("BugList input : " + json);
               // sblogs.AppendLine("BugList input : " + json1);

                sblogs.AppendLine("db call started  : ");
                string result = Buglistbyprojid(json);
                //string result1 = Buglisttotal_byprojid(json1);

                sblogs.AppendLine("db call done  : ");
                var obj = JsonConvert.DeserializeObject<dynamic>(result);

                string path = ConfigurationManager.AppSettings["attachmentpath"].ToString();
                sblogs.AppendLine("attachmentpath   : ");
                // Assigning path to object logo path
                if (obj != null)
                {

                    for (var i = 0; i < obj.Count; i++)
                    {

                        obj[i].attachmentpath = path + "Images/Bug Attachments/" + obj[i].bug_attachment; ;

                    }

                    var jsonobj = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });

                    objrm.Message = jsonobj;
                  //   objrm.Message1 = result1;

                }

                else
                {
                    objrm.Message = result;
                    //objrm.Message1 = result1;

                }
                sblogs.AppendLine("data send to UI   : ");
                Logging.AddtoLogFile(sblogs.ToString(), methodname);
                return Request.CreateResponse(HttpStatusCode.OK, objrm);
            }
            catch (Exception ex)
            {
                sblogs.AppendLine("exception   : " + ex.Message);
                Logging.AddtoLogFile(sblogs.ToString(), methodname + "_error");
                return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
            }


        }


        [HttpPost]
        [Route("BugList_total")]
        public HttpResponseMessage BugList_total(Bug input)

        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "BugList_total";
            try
            {
                //StringBuilder sblogs = new StringBuilder();
                sblogs.AppendLine("BugList_total start");

                Bugwrapper root = new Bugwrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("BugList_total input : " + json);
                sblogs.AppendLine("db call started  : ");

                string result = Buglisttotal_byprojid(json);
                sblogs.AppendLine("db call done  : ");
                var obj = JsonConvert.DeserializeObject<dynamic>(result);

                string path = ConfigurationManager.AppSettings["attachmentpath"].ToString();

               // objrm.Message1 = obj;

                    objrm.Message1 = result;
                
                sblogs.AppendLine("data send to UI   : ");
                Logging.AddtoLogFile(sblogs.ToString(), methodname);
                return Request.CreateResponse(HttpStatusCode.OK, objrm);
            }
            catch (Exception ex)
            {
                sblogs.AppendLine("exception   : " + ex.Message);
                Logging.AddtoLogFile(sblogs.ToString(), methodname + "_error");
                return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
            }


        }


        [HttpPost]
        [Route("BugListByBugid")]
        public HttpResponseMessage BugListByBugid(Bug input)

        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "BugListByBugid";
            try
            {
                //StringBuilder sblogs = new StringBuilder();
                sblogs.AppendLine("BugListByBugid start");
                Bugwrapper root = new Bugwrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("BugListByBugid input : " + json);
                sblogs.AppendLine("db call started  : ");

                string result = Buglistbybugid(json);
                sblogs.AppendLine("db call done  : ");
                var obj = JsonConvert.DeserializeObject<dynamic>(result);

                string path = ConfigurationManager.AppSettings["attachmentpath"].ToString();
                sblogs.AppendLine("attachmentpath   : ");
                // Assigning path to object logo path
                if (obj != null)
                {

                    for (var i = 0; i < obj.Count; i++)
                    {

                        obj[i].attachmentpath = path + "Images/Bug Attachments/" + obj[i].bug_attachment; ;

                    }
                    var jsonobj = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                    objrm.Message = jsonobj;
                }

                else
                {

                    objrm.Message = result;
                }
                sblogs.AppendLine("data send to UI   : ");
                Logging.AddtoLogFile(sblogs.ToString(), methodname);

                return Request.CreateResponse(HttpStatusCode.OK, objrm);
            }
            catch (Exception ex)
            {
                sblogs.AppendLine("exception   : " + ex.Message);
                Logging.AddtoLogFile(sblogs.ToString(), methodname + "_error");
                return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
            }



        }

        [HttpPost]
        [Route("BugListByFilter")]
        public HttpResponseMessage BugListByFilter(Bug input)

        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "BugListByFilter";
            try
            {
                //StringBuilder sblogs = new StringBuilder();
                sblogs.AppendLine("BugListByFilter start");

                Bugwrapper root = new Bugwrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                var json1 = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });

                sblogs.AppendLine("BugListByFilter input : " + json);
                sblogs.AppendLine("BugListByFilter input : " + json1);
                sblogs.AppendLine("db call started  : ");

                string result = Buglistbyfilter(json);
                string result1 = Bug_listbyfilter(json1);

                sblogs.AppendLine("db call done  : ");
                var obj = JsonConvert.DeserializeObject<dynamic>(result);

                string path = ConfigurationManager.AppSettings["attachmentpath"].ToString();
                sblogs.AppendLine("attachmentpath   : ");
                // Assigning path to object logo path
                if (obj != null)
                {

                    for (var i = 0; i < obj.Count; i++)
                    {

                        obj[i].attachmentpath = path + "Images/Bug Attachments/" + obj[i].bug_attachment; ;

                    }
                    var jsonobj = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });

                    objrm.Message = jsonobj;
                    objrm.Message1 = result1;

                }

                else
                {

                    objrm.Message = result;
                    objrm.Message1 = result1;

                }

                sblogs.AppendLine("data send to UI   : ");
                Logging.AddtoLogFile(sblogs.ToString(), methodname);

                return Request.CreateResponse(HttpStatusCode.OK, objrm);
            }
            catch (Exception ex)
            {
                sblogs.AppendLine("exception   : " + ex.Message);
                Logging.AddtoLogFile(sblogs.ToString(), methodname + "_error");
                return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
            }

        }

        [HttpPost]
        [Route("CommentsByBugid")]
        public HttpResponseMessage CommentsByBugid(Bug input)

        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "CommentsByBugid";
            try
            {
                //StringBuilder sblogs = new StringBuilder();
                sblogs.AppendLine("CommentsByBugid start");

                Bugwrapper root = new Bugwrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("CommentsByBugid input : " + json);
                sblogs.AppendLine("db call started  : ");

                string result = commentsbybugid(json);
                sblogs.AppendLine("db call done  : ");
                var obj = JsonConvert.DeserializeObject<dynamic>(result);

                string path = ConfigurationManager.AppSettings["logopath"].ToString();
                string path1 = ConfigurationManager.AppSettings["attachmentpath"].ToString();


                sblogs.AppendLine("logopath   : ");
                sblogs.AppendLine("attachmentpath :");
                //int dtcount = obj.Count;
                if (obj != null)
                {
                    for (var i = 0; i < obj.Count; i++)
                    {
                        if (obj[i].user_logo == null)
                        {
                            obj[i].user_logo = "default_user_image.jpg";
                        }
                        obj[i].logopath = path + "Images/UserImages/" + obj[i].user_logo; ;
                        obj[i].attachmentpath = path1 + "Images/Bug Attachments/" + obj[i].com_attatch; ;
                    }

                    var jsonobj = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                    objrm.Message = jsonobj;
                }
                else
                {
                    objrm.Message = result;
                }
                sblogs.AppendLine("data send to UI   : ");
                Logging.AddtoLogFile(sblogs.ToString(), methodname);


                return Request.CreateResponse(HttpStatusCode.OK, objrm);
            }
            catch (Exception ex)
            {
                sblogs.AppendLine("exception   : " + ex.Message);
                Logging.AddtoLogFile(sblogs.ToString(), methodname + "_error");
                return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
            }

        }

        [HttpPost]
        [Route("getBughistory")]
        public HttpResponseMessage GetBughistory(Bug input)

        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "GetBughistory";
            try
            {
                //StringBuilder sblogs = new StringBuilder();
                sblogs.AppendLine("GetBughistory start");

                Bugwrapper root = new Bugwrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("GetBughistory input : " + json);
                sblogs.AppendLine("db call started  : ");

                string result = _GetBughistory(json);
                sblogs.AppendLine("db call done  : ");

                objrm.Message = result;

                sblogs.AppendLine("data send to UI   : ");
                Logging.AddtoLogFile(sblogs.ToString(), methodname);


                return Request.CreateResponse(HttpStatusCode.OK, objrm);
            }
            catch (Exception ex)
            {
                sblogs.AppendLine("exception   : " + ex.Message);
                Logging.AddtoLogFile(sblogs.ToString(), methodname + "_error");
                return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
            }

        }

        [HttpPost]
        [Route("EmailNotification")]
        public HttpResponseMessage EmailNotification(Bug input)

        {
            StringBuilder sblog = new StringBuilder();
            string methodname = "EmailNotification";
            try
            {
                sblog.AppendLine("EmailNotification");
                Bugwrapper root = new Bugwrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                String result = Email(json);
                sblog.AppendLine("result : " + result);
                sblog.AppendLine("input json " + json);
                var obj = JsonConvert.DeserializeObject<dynamic>(result);

                var data = obj[0];

                ////Email notification
                String strHTML = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath("~/Template/Emailnotification.html"));
                sblog.AppendLine("reading template is done ");
                try
                {
                    //strHTML = strHTML.Replace("{{#username#}}", data.user_username.Value);

                    strHTML = strHTML.Replace("{{#projname#}}", data.proj_name.Value);
                    strHTML = strHTML.Replace("{{#bugtitle#}}", data.bug_title.Value);
                    strHTML = strHTML.Replace("{{#description#}}", data.bug_description.Value);
                    strHTML = strHTML.Replace("{{#bugid#}}", data.bug_id.Value.ToString());
                    strHTML = strHTML.Replace("{{#status#}}", data.status_name.Value);
                    if (input.user_emailid == null)
                    {
                        strHTML = strHTML.Replace("{{#assignee#}}", input.bug_assignedby);
                    }
                    else
                    {
                        strHTML = strHTML.Replace("{{#assignee#}}", input.user_emailid);
                    }


                }
                catch (Exception ex)
                {
                    sblog.AppendLine("exception while replacing html");
                }

                try
                {
                    if (data.user_emailid.Value == "")
                    {
                        sblog.AppendLine("SendMail  called");
                        strHTML = strHTML.Replace("{{#emailid#}}", data.user_emailid);
                        MailHelper.SendMail(input.user_emailid, "Bug", strHTML);
                    }
                    else
                    {
                        sblog.AppendLine("SendMail else called  ");
                        strHTML = strHTML.Replace("{{#emailid#}}", data.user_emailid.Value);
                        MailHelper.SendMail(data.user_emailid.Value, "Bug", strHTML);
                    }

                }
                catch (Exception ex)
                {
                    //throw;
                    sblog.AppendLine("SendMail exception  " + ex.Message);
                    Logging.AddtoLogFile(sblog.ToString(), methodname);
                    return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
                }
                var jsonobj = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });

                objrm.Message = jsonobj;
                Logging.AddtoLogFile(sblog.ToString(), methodname);
                return Request.CreateResponse(HttpStatusCode.OK, objrm);
            }
            catch (Exception ex)
            {
                sblog.AppendLine("SendMail exception  " + ex.Message);
                Logging.AddtoLogFile(sblog.ToString(), methodname);
                return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
            }


        }

        public string Email(string json)
        {
            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_sendmail", con);
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var parameter = command.CreateParameter();
                    parameter.ParameterName = "input";
                    parameter.NpgsqlDbType = NpgsqlTypes.NpgsqlDbType.Json;
                    parameter.Value = json;
                    command.Parameters.Add(parameter);
                    NpgsqlDataReader reader = command.ExecuteReader();
                    string resultset = string.Empty;
                    while (reader.Read())
                    {
                        if (reader[0] != null)
                        {
                            resultset = reader[0].ToString();
                        }
                    }

                    status = "ok";

                    status = resultset;
                }
            }

            catch (Exception ex)
            {

                status = ex.Message;
            }
            return status;
        }

        public string BugInformation(string json)

        {
            string status = String.Empty;

            try

            {
                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_bug_create", con);
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var parameter = command.CreateParameter();
                    parameter.ParameterName = "input";
                    parameter.NpgsqlDbType = NpgsqlTypes.NpgsqlDbType.Json;
                    parameter.Value = json;
                    command.Parameters.Add(parameter);
                    NpgsqlDataReader reader = command.ExecuteReader();
                    string resultset = string.Empty;
                    while (reader.Read())
                    {
                        if (reader[0] != null)
                        {
                            resultset = reader[0].ToString();
                        }
                    }

                    status = "ok";

                    status = resultset;

                }
            }
            catch (Exception ex)
            {

                status = ex.Message;
            }
            return status;
        }

        public string UpdateBugInformation(string json)

        {
            string status = String.Empty;

            try

            {
                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_updatebug", con);
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var parameter = command.CreateParameter();
                    parameter.ParameterName = "input";
                    parameter.NpgsqlDbType = NpgsqlTypes.NpgsqlDbType.Json;
                    parameter.Value = json;
                    command.Parameters.Add(parameter);
                    NpgsqlDataReader reader = command.ExecuteReader();
                    string resultset = string.Empty;
                    while (reader.Read())
                    {
                        if (reader[0] != null)
                        {
                            resultset = reader[0].ToString();
                        }
                    }

                    status = "ok";

                    status = resultset;


                }
            }
            catch (Exception ex)
            {

                status = ex.Message;
            }
            return status;
        }

        public string UpdateCommentInformation(string json)

        {
            string status = String.Empty;

            try

            {
                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_updatecomment", con);
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var parameter = command.CreateParameter();
                    parameter.ParameterName = "input";
                    parameter.NpgsqlDbType = NpgsqlTypes.NpgsqlDbType.Json;
                    parameter.Value = json;
                    command.Parameters.Add(parameter);
                    NpgsqlDataReader reader = command.ExecuteReader();
                    string resultset = string.Empty;
                    while (reader.Read())
                    {
                        if (reader[0] != null)
                        {
                            resultset = reader[0].ToString();
                        }
                    }

                    status = "ok";

                    status = resultset;


                }
            }
            catch (Exception ex)
            {

                status = ex.Message;
            }
            return status;
        }

        public string Comment(string json)

        {
            string status = String.Empty;

            try

            {
                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_comments_create", con);
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var parameter = command.CreateParameter();
                    parameter.ParameterName = "input";
                    parameter.NpgsqlDbType = NpgsqlTypes.NpgsqlDbType.Json;
                    parameter.Value = json;
                    command.Parameters.Add(parameter);
                    NpgsqlDataReader reader = command.ExecuteReader();
                    string resultset = string.Empty;
                    while (reader.Read())
                    {
                        if (reader[0] != null)
                        {
                            resultset = reader[0].ToString();
                        }
                    }

                    status = "ok";

                    status = resultset;

                }
            }
            catch (Exception ex)
            {

                status = ex.Message;
            }
            return status;
        }

        public string Buglistbyprojid(string json)
        {
            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_getbuglistbyprojid", con);
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var parameter = command.CreateParameter();
                    parameter.ParameterName = "input";
                    parameter.NpgsqlDbType = NpgsqlTypes.NpgsqlDbType.Json;
                    parameter.Value = json;
                    command.Parameters.Add(parameter);
                    NpgsqlDataReader reader = command.ExecuteReader();
                    string resultset = string.Empty;
                    while (reader.Read())
                    {
                        if (reader[0] != null)
                        {
                            resultset = reader[0].ToString();
                        }
                    }

                    status = "ok";

                    status = resultset;
                }
            }

            catch (Exception ex)
            {

                status = ex.Message;
            }
            return status;
        }

        public string Bug_listbyfilter(string json1)
        {
            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_gettotal_buglistbyfilter", con);
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var parameter = command.CreateParameter();
                    parameter.ParameterName = "input";
                    parameter.NpgsqlDbType = NpgsqlTypes.NpgsqlDbType.Json;
                    parameter.Value = json1;
                    command.Parameters.Add(parameter);
                    NpgsqlDataReader reader = command.ExecuteReader();
                    string resultset = string.Empty;
                    while (reader.Read())
                    {
                        if (reader[0] != null)
                        {
                            resultset = reader[0].ToString();
                        }
                    }

                    status = "ok";

                    status = resultset;
                }
            }

            catch (Exception ex)
            {

                status = ex.Message;
            }
            return status;
        }

        public string Buglisttotal_byprojid(string json)
        {
            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_get_totalbuglistbyprojid", con);
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var parameter = command.CreateParameter();
                    parameter.ParameterName = "input";
                    parameter.NpgsqlDbType = NpgsqlTypes.NpgsqlDbType.Json;
                    parameter.Value = json;
                    command.Parameters.Add(parameter);
                    NpgsqlDataReader reader = command.ExecuteReader();
                    string resultset = string.Empty;
                    while (reader.Read())
                    {
                        if (reader[0] != null)
                        {
                            resultset = reader[0].ToString();
                        }
                    }

                    status = "ok";

                    status = resultset;
                }
            }

            catch (Exception ex)
            {

                status = ex.Message;
            }
            return status;
        }

        public string Buglistbybugid(string json)
        {
            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_getbugdetailsbyid", con);
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var parameter = command.CreateParameter();
                    parameter.ParameterName = "input";
                    parameter.NpgsqlDbType = NpgsqlTypes.NpgsqlDbType.Json;
                    parameter.Value = json;
                    command.Parameters.Add(parameter);
                    NpgsqlDataReader reader = command.ExecuteReader();
                    string resultset = string.Empty;
                    while (reader.Read())
                    {
                        if (reader[0] != null)
                        {
                            resultset = reader[0].ToString();
                        }
                    }

                    status = "ok";

                    status = resultset;
                }
            }

            catch (Exception ex)
            {

                status = ex.Message;
            }
            return status;
        }

        public string commentsbybugid(string json)
        {
            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_getcomments_by_bugid", con);
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var parameter = command.CreateParameter();
                    parameter.ParameterName = "input";
                    parameter.NpgsqlDbType = NpgsqlTypes.NpgsqlDbType.Json;
                    parameter.Value = json;
                    command.Parameters.Add(parameter);
                    NpgsqlDataReader reader = command.ExecuteReader();
                    string resultset = string.Empty;
                    while (reader.Read())
                    {
                        if (reader[0] != null)
                        {
                            resultset = reader[0].ToString();
                        }
                    }

                    status = "ok";

                    status = resultset;
                }
            }

            catch (Exception ex)
            {

                status = ex.Message;
            }
            return status;
        }

        public string _GetBughistory(string json)
        {
            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_gethistory", con);
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var parameter = command.CreateParameter();
                    parameter.ParameterName = "input";
                    parameter.NpgsqlDbType = NpgsqlTypes.NpgsqlDbType.Json;
                    parameter.Value = json;
                    command.Parameters.Add(parameter);
                    NpgsqlDataReader reader = command.ExecuteReader();
                    string resultset = string.Empty;
                    while (reader.Read())
                    {
                        if (reader[0] != null)
                        {
                            resultset = reader[0].ToString();
                        }
                    }

                    status = "ok";

                    status = resultset;
                }
            }

            catch (Exception ex)
            {

                status = ex.Message;
            }
            return status;
        }

        public string Buglistbyfilter(string json)
        {
            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_getbuglistbyfilter", con);
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var parameter = command.CreateParameter();
                    parameter.ParameterName = "input";
                    parameter.NpgsqlDbType = NpgsqlTypes.NpgsqlDbType.Json;
                    parameter.Value = json;
                    command.Parameters.Add(parameter);
                    NpgsqlDataReader reader = command.ExecuteReader();
                    string resultset = string.Empty;
                    while (reader.Read())
                    {
                        if (reader[0] != null)
                        {
                            resultset = reader[0].ToString();
                        }
                    }

                    status = "ok";

                    status = resultset;
                }
            }

            catch (Exception ex)
            {

                status = ex.Message;
            }
            return status;
        }

        //[SwaggerResponse(HttpStatusCode.OK, "", typeof(account))]
        //[SwaggerResponse(HttpStatusCode.InternalServerError, "", typeof(ResultMessage))]
        //[HttpPost()]
        //[Route("UploadFiles")]
        public string UploadFiles()
        {
            string strFileName = "";
            int iUploadedCnt = 0;
            // DEFINE THE PATH WHERE WE WANT TO SAVE THE FILES.
            string sPath = "";
            //sPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Images/");
            sPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Images/Bug Attachments/");


            System.Web.HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;

            // CHECK THE FILE COUNT.
            for (int iCnt = 0; iCnt <= hfc.Count - 1; iCnt++)
            {
                System.Web.HttpPostedFile hpf = hfc[iCnt];

                if (hpf.ContentLength > 0)
                {
                    // CHECK IF THE SELECTED FILE(S) ALREADY EXISTS IN FOLDER. (AVOID DUPLICATE)

                    // SAVE THE FILES IN THE FOLDER.
                    Random rnum = new Random();
                    int generatedNo = rnum.Next(1, int.MaxValue);
                    strFileName = generatedNo + "_" + Path.GetFileName(hpf.FileName);
                    hpf.SaveAs(sPath + strFileName);
                    iUploadedCnt = iUploadedCnt + 1;

                }
            }
            // RETURN A STATUS MESSAGE.
            if (iUploadedCnt > 0)
            {
                strFileName = strFileName.Replace("\"", "").Trim();
                string path = ConfigurationManager.AppSettings["attachmentpath"].ToString();
                path = path + "Images/Bug Attachments/";
                strFileName = strFileName + "," + path + strFileName;
                //strFileName = strFileName.Replace("\"", "").Trim();
                //strFileName = strFileName.Replace('"', ' ').Trim();

                return strFileName;

            }
            else
            {
                return "failed";
            }
        }

    }

}


