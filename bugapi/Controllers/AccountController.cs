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
    [RoutePrefix("api/account")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class AccountController : ApiController
    {
        public static string _connectionString = ConfigurationManager.ConnectionStrings["FleetConnect"].ToString();

        ResultMessage objrm = new ResultMessage();



  
        [HttpPost]
        [Route("CreateAccount")]
        public HttpResponseMessage CreateAccount(Account input)
        {

            StringBuilder sblogs = new StringBuilder();
            string methodname = "CreateAccount";
            try
            {
                sblogs.AppendLine("CreateAccount start");
                Accountwrapper root = new Accountwrapper();

                root.root = input;

                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("CreateAccount input : " + json);
                sblogs.AppendLine("db call started  : ");
                AccountCreation(json);
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

        public string AccountCreation(string json)
        {

            string status = String.Empty;

            try
            {
                
                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();
                    
                    var command = new Npgsql.NpgsqlCommand("_bt_account_create", con);
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
    }
}
