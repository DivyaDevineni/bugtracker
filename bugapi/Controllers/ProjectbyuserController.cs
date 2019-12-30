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
    [RoutePrefix("api/projectbyuser")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ProjectbyuserController : ApiController
    {
        public static string _connectionString = ConfigurationManager.ConnectionStrings["FleetConnect"].ToString();

        ResultMessage2 objrm = new ResultMessage2();



        [HttpPost]
        [Route("CreateProjectByUser")]
        public HttpResponseMessage CreateProjectByUser(ProjectByUser input)
        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "CreateProjectByUser";
            try
            {
                sblogs.AppendLine("CreateProjectByUser start");
                ProjectUserwrapper root = new ProjectUserwrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("CreateProjectByUser input : " + json);
                sblogs.AppendLine("db call started  : ");
                CreateProjectByUser(json);
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
        [Route("GetProjUserById")]
        public HttpResponseMessage GetProjByUserId(ProjectByUser input)
        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "GetProjUserById";
            try
            {
                sblogs.AppendLine("GetProjUserById start");
                ProjectUserwrapper root = new ProjectUserwrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("GetProjUserById input : " + json);
                sblogs.AppendLine("db call started  : ");
                string result = ProjByUserDetails(json);
                sblogs.AppendLine("db call started  : ");
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

        public string CreateProjectByUser(string json)
        {

            string status = String.Empty;

            try
            {
                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_projectbyuser_create", con);
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

        public string ProjByUserDetails(string json)
        {

            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_getpuserdetailsbyid", con);
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
