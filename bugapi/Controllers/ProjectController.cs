using System;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Npgsql;
using Newtonsoft.Json;
using System.Web.Http.Cors;
using System.Text;
namespace bugapi.Controllers
{
    [RoutePrefix("api/project")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ProjectController : ApiController
    {
        public static string _connectionString = ConfigurationManager.ConnectionStrings["FleetConnect"].ToString();

        ResultMessage3 objrm = new ResultMessage3();

        [HttpPost]
        [Route("CreateProject")]
        public HttpResponseMessage CreateProject(Project input)
        {

            StringBuilder sblogs = new StringBuilder();
            string methodname = "CreateProject";
            try
            {
                //StringBuilder sblogs = new StringBuilder();
                sblogs.AppendLine("CreateProject start");
                Projectwrapper root = new Projectwrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("CreateProject input : " + json);
                sblogs.AppendLine("db call started  : ");
                string result = CreateProject(json);
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
        [Route("updateProject")]
        public HttpResponseMessage updateProject(Project input)
        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "updateProject";
            try
            {
                //StringBuilder sblogs = new StringBuilder();
                sblogs.AppendLine("updateProject start");
                Projectwrapper root = new Projectwrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("GetProjById input : " + json);
                sblogs.AppendLine("db call started  : ");
                UpdateProject(json);
                sblogs.AppendLine("db call done  : ");
                sblogs.AppendLine("data send to UI   : ");
                Logging.AddtoLogFile(sblogs.ToString(), methodname);
                return Request.CreateResponse(HttpStatusCode.OK, "Success");
            }
            catch (Exception ex)
            {
                sblogs.AppendLine("exception   : " + ex.Message);
                Logging.AddtoLogFile(sblogs.ToString(), methodname + "_error");
                return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
            }


        }

        [HttpPost]
        [Route("GetProjById")]
        public HttpResponseMessage GetProjById(Project input)
        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "GetProjById";
            try
            {
                //StringBuilder sblogs = new StringBuilder();
                sblogs.AppendLine("GetProjById start");
                Projectwrapper root = new Projectwrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("GetProjById input : " + json);
                sblogs.AppendLine("db call started  : ");
                string result = ProjDetailsById(json);
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
        [Route("GetTrashedProjByUserId")]
        public HttpResponseMessage GetTrashedProjByUserId(ProjectByUser input)
        {
            ProjectUserwrapper root = new ProjectUserwrapper();
            root.root = input;
            var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
            string result = TrashedProjDetailsByuserId(json);
            objrm.Message = result;
            return Request.CreateResponse(HttpStatusCode.OK, objrm);


        }

        [HttpPost]
        [Route("getprojectsbyuserid")]
        public HttpResponseMessage getprojectsbyuserid(ProjectByUser input)
        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "getprojectsbyuserid";
            try
            {
                //StringBuilder sblogs = new StringBuilder();
                sblogs.AppendLine("getprojectsbyuserid start");
                ProjectUserwrapper root = new ProjectUserwrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("getprojectsbyuserid input : " + json);
                sblogs.AppendLine("db call started  : ");
                string result = getprojectsbyuserid_service(json);
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
        [Route("getprojectsbyuser")]
        public HttpResponseMessage getprojectsbyuser(ProjectByUser input)
        {

            StringBuilder sblogs = new StringBuilder();
            string methodname = "getprojectsbyuser";
            try
            {
                //StringBuilder sblogs = new StringBuilder();
                sblogs.AppendLine("getprojectsbyuser start");
                ProjectUserwrapper root = new ProjectUserwrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("getprojectsbyuserid input : " + json);
                sblogs.AppendLine("db call started  : ");
                string result = getprojectsbyuser(json);
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
        [Route("UpdateProjStatus")]
        public HttpResponseMessage UpdateStatus(Project input)
        {

            StringBuilder sblogs = new StringBuilder();
            string methodname = "UpdateProjStatus";
            try
            {
                //StringBuilder sblogs = new StringBuilder();
                sblogs.AppendLine("UpdateProjStatus start");
                Projectwrapper root = new Projectwrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("getprojectsbyuserid input : " + json);
                sblogs.AppendLine("db call started  : ");
                string result = GetProjStatus(json);
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

        public string CreateProject(string json)
        {

            string status = String.Empty;

            try
            {
                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_project_create", con);
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

        public string UpdateProject(string json)
        {

            string status = String.Empty;

            try
            {
                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_updateproject", con);
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var parameter = command.CreateParameter();
                    parameter.ParameterName = "input";
                    parameter.NpgsqlDbType = NpgsqlTypes.NpgsqlDbType.Json;
                    parameter.Value = json;
                    command.Parameters.Add(parameter);
                    int output = command.ExecuteNonQuery();
                    status = "ok";

                }
            }
            catch (Exception ex)
            {

                status = ex.Message;
            }
            return status;
        }

        public string ProjDetailsById(string json)
        {

            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_getprojectdetailsbyid", con);
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

        public string TrashedProjDetailsByuserId(string json)
        {

            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_gettrashedproj_byuserid", con);
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

        public string getprojectsbyuserid_service(string json)
        {

            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_getprojectsbyuserid", con);
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

        public string getprojectsbyuser(string json)
        {

            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_getprojectsbyuser", con);
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

        public string GetProjStatus(string json)
        {

            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_deleteproject", con);
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
