using System;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Npgsql;
using Newtonsoft.Json;
using System.Web.Http.Cors;
using System.IO;
using System.Web;
using System.Text;

namespace bugapi.Controllers
{
    [RoutePrefix("api/user")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class UserController : ApiController
    {
        public static string _connectionString = ConfigurationManager.ConnectionStrings["FleetConnect"].ToString();

        ResultMessage1 objrm = new ResultMessage1();

        [HttpPost]
        [Route("Createuser")]
        public HttpResponseMessage Createuser(Users input)
        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "Createuser";
            try
            {
                //StringBuilder sblogs = new StringBuilder();
                sblogs.AppendLine("Createuser start");

                Userswrapper root = new Userswrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                String isexists = generatepassword(json);
                if (isexists == "{\"result\":\"false\"}")
                {
                    //random password generation
                    input.user_password = btcommon.RandomString(8);
                }
                root.root = input;
                var json1 = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("Createuser input : " + json);
                sblogs.AppendLine("db call started  : ");
                String result = Createuser(json1);
                sblogs.AppendLine("db call done  : ");

                var obj = JsonConvert.DeserializeObject<dynamic>(result);

                var data = obj;

                //Email notification
                // string signup = ConfigurationManager.AppSettings["signup"].ToString();
                String strHTML = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath("~/Template/UserNotification.html"));
                sblogs.AppendLine("reading template is done ");

                try
                {
                    //strHTML = strHTML.Replace("{{#username#}}", data.user_username.Value);
                    strHTML = strHTML.Replace("{{#emailid#}}", data.user_emailid.Value);
                    strHTML = strHTML.Replace("{{#projname#}}", data.projname.proj_name.Value);
                    //strHTML = strHTML.Replace("{{#password#}}", data.user_password.Value);


                }
                catch (Exception ex)
                {
                    sblogs.AppendLine("exception while replacing html");

                }

                try
                {
                    sblogs.AppendLine("SendMail  called");

                    MailHelper.SendMail(data.user_emailid.Value, "Added to project", strHTML);

                }
                catch (Exception ex)
                {
                    //throw;
                    sblogs.AppendLine("SendMail exception  " + ex.Message);
                    Logging.AddtoLogFile(sblogs.ToString(), methodname);
                    return Request.CreateResponse(HttpStatusCode.OK, "Email sent Fail");
                }

                var jsonobj = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });

                objrm.Message = jsonobj;
                Logging.AddtoLogFile(sblogs.ToString(), methodname);

                return Request.CreateResponse(HttpStatusCode.OK, objrm);
            }
            catch (Exception ex)
            {
                sblogs.AppendLine("SendMail exception  " + ex.Message);
                Logging.AddtoLogFile(sblogs.ToString(), methodname);
                return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
            }

        }

        [Route("usercreation")]
        public HttpResponseMessage usercreation(Users input)
        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "usercreation";
            try
            {
                //StringBuilder sblogs = new StringBuilder();
                sblogs.AppendLine("usercreation start");

                Userswrapper root = new Userswrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("usercreation input : " + json);
                sblogs.AppendLine("db call started  : ");

                String result = createuser(json);
                sblogs.AppendLine("db call done  : ");

                var obj = JsonConvert.DeserializeObject<dynamic>(result);

                var data = obj;

                //Email notification
                String strHTML = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath("~/Template/SignUpNotification.html"));
                sblogs.AppendLine("reading template is done ");

                try
                {
                    //strHTML = strHTML.Replace("{{#username#}}", data.user_username.Value);
                    strHTML = strHTML.Replace("{{#emailid#}}", obj.user_emailid.Value);
                    strHTML = strHTML.Replace("{{#password#}}", obj.user_password.Value);

                }
                catch (Exception ex)
                {
                    sblogs.AppendLine("exception while replacing html");

                }

                try
                {
                    sblogs.AppendLine("SendMail  called");
                    MailHelper.SendMail(data.user_emailid.Value, "SignUp", strHTML);

                }
                catch (Exception ex)
                {
                    //throw;
                    sblogs.AppendLine("SendMail exception  " + ex.Message);
                    Logging.AddtoLogFile(sblogs.ToString(), methodname);
                    return Request.CreateResponse(HttpStatusCode.OK, "Email sent Fail");
                }

                var jsonobj = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                objrm.Message = jsonobj;
                Logging.AddtoLogFile(sblogs.ToString(), methodname);

                return Request.CreateResponse(HttpStatusCode.OK, objrm);
            }
            catch (Exception ex)
              {
                sblogs.AppendLine("SendMail exception  " + ex.Message);
                Logging.AddtoLogFile(sblogs.ToString(), methodname);
                return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
              }

        }

        [HttpPost]
        [Route("UserDetailsById")]
        public HttpResponseMessage UserDetailsById(Users input)
        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "UserDetailsById";
            try
            {
                //StringBuilder sblogs = new StringBuilder();
                sblogs.AppendLine("UserDetailsById start");
                Userswrapper root = new Userswrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("usercreation input : " + json);
                sblogs.AppendLine("db call started  : ");

                string result = UserInformation(json);
                sblogs.AppendLine("db call done  : ");

                var obj = JsonConvert.DeserializeObject<dynamic>(result);

                string path = ConfigurationManager.AppSettings["logopath"].ToString();
                sblogs.AppendLine("logopath   : ");

                // Assigning path to object logo path
                if (obj != null)
                {
                                  
                    obj[0].logopath = path + "Images/UserImages/" + obj[0].user_logo;
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
        [Route("UserListByAccountId")]
        public HttpResponseMessage UserListByAccountId(Users input)
        {
            Userswrapper root = new Userswrapper();
            root.root = input;
            var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
            string result = UserList(json);
            objrm.Message = result;
            return Request.CreateResponse(HttpStatusCode.OK, objrm);

        }

        [HttpPost]
        [Route("UserListByProjectId")]
        public HttpResponseMessage UserListByProjectId(Users input)
        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "UserListByProjectId";
            try
            {
                //StringBuilder sblogs = new StringBuilder();
                sblogs.AppendLine("UserListByProjectId start");

                Userswrapper root = new Userswrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("UserListByProjectId input : " + json);
                sblogs.AppendLine("db call started  : ");

                string result = UserListbyprojid(json);

                sblogs.AppendLine("db call done  : ");

                // Assigning path to object logo path
                if (result != null)
                {

                    var obj = JsonConvert.DeserializeObject<dynamic>(result);

                    string path = ConfigurationManager.AppSettings["logopath"].ToString();
                    sblogs.AppendLine("logopath   : ");

                    for (var i = 0; i < obj.Count; i++)
                    {

                        obj[i].logopath = path + "Images/UserImages/" + obj[i].user_logo; ;
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
        [Route("UpdateUserStatus")]
        public HttpResponseMessage UpdateStatus(Users input)
        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "UpdateUserStatus";
            try
            {
                //StringBuilder sblogs = new StringBuilder();
                sblogs.AppendLine("UpdateUserStatus start");

                Userswrapper root = new Userswrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("UpdateUserStatus input : " + json);
                sblogs.AppendLine("db call started  : ");
                string result = GetUserStatus(json);
                var obj = JsonConvert.DeserializeObject<dynamic>(result);

                string path = ConfigurationManager.AppSettings["logopath"].ToString();
                sblogs.AppendLine("logopath   : ");

                // Assigning path to object logo path
                if (obj != null)
                {
                    obj[0].logopath = path + "Images/UserImages/" + obj[0].user_logo;

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
        [Route("DeleteUser")]
        public HttpResponseMessage DeleteUser(Users input)
        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "DeleteUser";
            try
            {
                //StringBuilder sblogs = new StringBuilder();
                sblogs.AppendLine("DeleteUser start");
                Userswrapper root = new Userswrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("DeleteUser input : " + json);
                sblogs.AppendLine("db call started  : ");
                string result = Deleteuser(json);
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

        [HttpGet]
        [Route("GetStatus")]
        public HttpResponseMessage GetStatus()
        {


            string result = getstatus();
            objrm.Message = result;
            return Request.CreateResponse(HttpStatusCode.OK, objrm);

        }

        [HttpGet]
        [Route("GetSeverity")]
        public HttpResponseMessage GetSeverity()
        {

            string result = getseverity();
            objrm.Message = result;
            return Request.CreateResponse(HttpStatusCode.OK, objrm);
        }


        public string Createuser(string json)
        {

            string status = String.Empty;

            try
            {
                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_createuser", con);
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

        // signup notification 
        public string createuser(string json1)
        {


            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_createuser", con);
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

        // generate random password 
        public string generatepassword(string json)
        {


            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_generate_randompassword", con);
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

        public string UserInformation(string json)
        {

            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_getuserdetailsbyid", con);
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

        public string UserList(string json)
        {

            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_getuserslist", con);
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

        public string UserListbyprojid(string json)
        {

            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_getusersbyprojid", con);
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

        public string GetUserStatus(string json)
        {

            string status = String.Empty;

            try
            {
                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_updateuser", con);
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

        public string Deleteuser(string json)
        {

            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_deleteuser", con);
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
        
        public string getstatus()
        {

            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();
                    var command = new Npgsql.NpgsqlCommand("_bt_getstatus", con);
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var parameter = command.CreateParameter();
                    parameter.ParameterName = "input";
                    parameter.NpgsqlDbType = NpgsqlTypes.NpgsqlDbType.Json;
                    parameter.Value = "{}";
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

        public string getseverity()
        {

            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_getseverity", con);
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var parameter = command.CreateParameter();
                    parameter.ParameterName = "input";
                    parameter.NpgsqlDbType = NpgsqlTypes.NpgsqlDbType.Json;
                    parameter.Value = "{ }";
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

            StringBuilder sblogs = new StringBuilder();
            sblogs.AppendLine("UploadFiles start");
            string strFileName = "";
            int iUploadedCnt = 0;
            // DEFINE THE PATH WHERE WE WANT TO SAVE THE FILES.
            string sPath = "";
            try
            {
                //sPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Images/");
                sPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Images/UserImages/");

                sblogs.AppendLine("sPath : " + sPath);
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
                        sblogs.AppendLine("iUploadedCnt : " + iUploadedCnt);

                    }
                }
                // RETURN A STATUS MESSAGE.
                if (iUploadedCnt > 0)
                {
                    strFileName = strFileName.Replace("\"", "").Trim();
                    string path = ConfigurationManager.AppSettings["logopath"].ToString();
                    path = path + "Images/UserImages/";
                    strFileName = strFileName + "," + path + strFileName;
                    //strFileName = strFileName.Replace("\"", "").Trim();
                    //strFileName = strFileName.Replace('"', ' ').Trim();
                    sblogs.AppendLine("strFileName : " + strFileName);
                    return strFileName;

                }
                else
                {
                    return "failed";
                }

            }
            catch (Exception ex)
            {
                sblogs.AppendLine("exception  : " + ex.Message);
                return ex.Message;
            }

            Logging.AddtoLogFile(sblogs.ToString(), "uploadfile");

            return strFileName;
        }


    }
}
