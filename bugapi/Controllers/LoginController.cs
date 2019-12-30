using System;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Npgsql;
using Newtonsoft.Json;
using System.Web;
using System.Web.Http.Cors;
using System.Text;


namespace bugapi.Controllers
{
    [RoutePrefix("api/login")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]

    public class LoginController : ApiController
    {
        public static string _connectionString = ConfigurationManager.ConnectionStrings["FleetConnect"].ToString();

        ResultMessage1 objrm = new ResultMessage1();

        [HttpPost]
        [Route("Login")]
        public HttpResponseMessage CreateLogin(UserCredentials input)
        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "Login";
            try
            {
                sblogs.AppendLine("Login start");
                UserCredentialsWrapper root = new UserCredentialsWrapper();

                root.root = input;

                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("Login input : " + json);
                sblogs.AppendLine("db call started  : ");
                string result = login(json);
                sblogs.AppendLine("db call done  : ");
                var obj = JsonConvert.DeserializeObject<dynamic>(result);

                string path = ConfigurationManager.AppSettings["logopath"].ToString();

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
        [Route("Forgotpassword")]
        public HttpResponseMessage Forgotpassword(UserCredentials input)
        {

            StringBuilder sblogs = new StringBuilder();
            string methodname = "Forgotpassword";
            try
            {
                sblogs.AppendLine("Forgotpassword start");
                UserCredentialsWrapper root = new UserCredentialsWrapper();

                root.root = input;

                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("Forgotpassword input : " + json);
                sblogs.AppendLine("db call started  : ");
                string result = Forgotpassword(json);
                if (result == "{\"result\":\"true\"}")
                {
                    //random password generation
                    input.user_password = btcommon.RandomString(8);
                }
                sblogs.AppendLine("db call done  : ");

                var obj = JsonConvert.DeserializeObject<dynamic>(result);

                var data = obj;

                //Email notification
                String strHTML = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath("~/Template/Forgotpassword.html"));
                sblogs.AppendLine("reading template is done ");

                try
                {
                    //strHTML = strHTML.Replace("{{#username#}}", data.user_username.Value);
                    strHTML = strHTML.Replace("{{#emailid#}}", input.user_emailid);
                    strHTML = strHTML.Replace("{{#password#}}", input.user_password);

                }
                catch (Exception ex)
                {
                    sblogs.AppendLine("exception while replacing html");

                }

                try
                {
                    sblogs.AppendLine("SendMail  called");
                    MailHelper.SendMail(input.user_emailid, "Reset Password", strHTML);

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
        [Route("Changepassword")]
        public HttpResponseMessage Changepassword(UserCredentials input)
        {

            StringBuilder sblogs = new StringBuilder();
            string methodname = "Changepassword";
            try
            {
                sblogs.AppendLine("Changepassword start");
                UserCredentialsWrapper root = new UserCredentialsWrapper();

                root.root = input;

                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("Changepassword input : " + json);
                sblogs.AppendLine("db call started  : ");
                string result = _Changepassword(json);
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


        public string login(string json)
        {

            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_login", con);
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

        public string Forgotpassword(string json)
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

        public string _Changepassword(string json)
        {

            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_changepassword", con);
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

    }
}


