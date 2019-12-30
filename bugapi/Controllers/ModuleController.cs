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
    [RoutePrefix("api/module")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ModuleController : ApiController
    {
        public static string _connectionString = ConfigurationManager.ConnectionStrings["FleetConnect"].ToString();

        ResultMessage6 objrm = new ResultMessage6();

        [HttpPost]
        [Route("Createmodule")]
        public HttpResponseMessage Createuser(Module input)
        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "Createmodule";
            try
            {
                sblogs.AppendLine("Createmodule start");
                Modulewrapper root = new Modulewrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("Createmodule input : " + json);
                sblogs.AppendLine("db call started  : ");
                createmodule(json);
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
        [Route("Updatemodule")]
        public HttpResponseMessage Updatemodule(Module input)
        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "Updatemodule";
            try
            {
                sblogs.AppendLine("Updatemodule start");
                Modulewrapper root = new Modulewrapper();
                root.root = input;

                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("Updatemodule input : " + json);
                sblogs.AppendLine("db call started  : ");
                string result = _Updatemodule(json);
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
        [Route("Modulesbyuser")]
        public HttpResponseMessage Getmodulesbyuser(Module input)
        {

            StringBuilder sblogs = new StringBuilder();
            string methodname = "Modulesbyuser";
            try
            {
                sblogs.AppendLine("Modulesbyuser start");
                Modulewrapper root = new Modulewrapper();
                root.root = input;

                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("Modulesbyuser input : " + json);
                sblogs.AppendLine("db call started  : ");
                string result = _Getmodulesbyuser(json);
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
        [Route("Getmodulesbyid")]
        public HttpResponseMessage Getmodulesbyid(Module input)
        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "Getmodulesbyid";
            try
            {
                sblogs.AppendLine("Getmodulesbyid start");
                Modulewrapper root = new Modulewrapper();
                root.root = input;

                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("Getmodulesbyid input : " + json);
                sblogs.AppendLine("db call started  : ");
                string result = _Getmodulesbyid(json);
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
        [Route("Getmodulesbyproj")]
        public HttpResponseMessage Getmodulesbyproj(Module input)
        {

            StringBuilder sblogs = new StringBuilder();
            string methodname = "Getmodulesbyproj";
            try
            {
                sblogs.AppendLine("Getmodulesbyproj start");
                Modulewrapper root = new Modulewrapper();
                root.root = input;
                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("Getmodulesbyproj input : " + json);
                sblogs.AppendLine("db call started  : ");
                string result = _Getmodulesbyproj(json);
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
        [Route("Deactivate")]
        public HttpResponseMessage Deactivate(Module input)
        {
            StringBuilder sblogs = new StringBuilder();
            string methodname = "Deactivate";
            try
            {

                sblogs.AppendLine("Deactivate start");
                Modulewrapper root = new Modulewrapper();
                root.root = input;

                var json = JsonConvert.SerializeObject(root, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-ddThh:mm:ssZ" });
                sblogs.AppendLine("Deactivate input : " + json);
                sblogs.AppendLine("db call started  : ");
                string result = _Deactivate(json);
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

        public string createmodule(string json)
        {

            string status = String.Empty;

            try
            {
                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_createmodule", con);
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

        public string _Updatemodule(string json)
        {

            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_updatemodule", con);
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

        public string _Getmodulesbyuser(string json)
        {

            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_getmodulesbyuser", con);
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

        public string _Getmodulesbyid(string json)
        {

            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_getmodulebyid", con);
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

        public string _Getmodulesbyproj(string json)
        {

            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_getmodulesbyproj", con);
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

        public string _Deactivate(string json)
        {

            string status = String.Empty;

            try
            {

                using (NpgsqlConnection con = new NpgsqlConnection(_connectionString))
                {

                    con.Open();


                    var command = new Npgsql.NpgsqlCommand("_bt_deactivatemodule", con);
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
