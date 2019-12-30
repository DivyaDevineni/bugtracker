using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Net.Http;
using System.IO;
using System.Diagnostics;
using System.Configuration;

namespace bugapi
{
    public class Logging
    {
        public static string ErrorLog(HttpContextBase _httpContext, Exception e)
        {
            string returnValue = string.Empty;
            try
            {
               // returnValue = SQLErrorLog.Log(new Error(e, _httpContext.ApplicationInstance.Context));
            }
            catch (Exception)
            {
                //Utility.SendEmail(@"-------------------------------------------------- <br/> Main Exception <br/>--------------------------------------------------<br/> "
                //        + SQLErrorLog.EncodeString(new Error(e))
                //        + "-------------------------------------------------- <br/> Current Exception <br/>--------------------------------------------------<br/> "
                //        + SQLErrorLog.EncodeString(new Error(ex))
                //        , "Exception from ErrorLog " + DateTime.Now.ToString("dd MMMM yyyy"), "from ErrorLog " + DateTime.Now.ToString("dd MMMM yyyy"));
            }
            return returnValue;
        }

      

        public static bool ActivityLog(HttpContextBase _httpContext
                    , string TraceURLAccessed, string TraceData, string TraceMessage = "")
        {
            bool returnValue = false;
            try
            {
                //using (var dbCtx = new REPO())
                //{
                //    UserActivity _ActivityTrace = new UserActivity();
                //    _ActivityTrace.SessionKey = _httpContext.Session != null ? _httpContext.Session.SessionID : string.Empty;
                //    _ActivityTrace.TraceIp = _httpContext.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] ?? _httpContext.Request.UserHostAddress;
                //    _ActivityTrace.TraceDate = DateTime.UtcNow;
                //    _ActivityTrace.UrlAccessed = TraceURLAccessed;
                //    _ActivityTrace.TraceData = SQLErrorLog.EncodeString(new Error(new
                //                 Exception(TraceData)));

                //    _ActivityTrace.UserGuid = _httpContext.User != null ? _httpContext.User.Identity.Name : null; // httpContext.User.Identity.IsAuthenticated ? _httpContext.User.Identity.Name: null;
                //    var request = _httpContext.Request;

                //    if (request.Headers["userkey"] != null)
                //    {
                //        _ActivityTrace.UserGuid = request.Headers["userkey"];
                //    }

                //    _ActivityTrace.TraceMessage = (TraceMessage == "" ? TraceData : TraceMessage);

                //    dbCtx.UserActivities.Add(_ActivityTrace);

                //    if (dbCtx.SaveChanges() == -1)
                //    {
                //        throw new Exception("ERROR: Unable to Save Data to SQL server after Add Data into ActivityTrace.");
                //    }
                //    returnValue = true;
                //}
                //VisitorLog(HttpContent.Current);
            }
            catch (Exception ex)
            {
                returnValue = false;
                Logging.ErrorLog(_httpContext, ex);
            }

            return returnValue;
        }


        public static bool VisitorLog(HttpContext _httpContext)
        {
            bool returnValue = false;
            try
            {
                //using (var dbCtx = new REPO())
                //{
                //    dbCtx.VisitorLogs.Add(new VisitorLog()
                //    {
                //        BrowserAgent = _httpContext.Request.UserAgent,
                //        IpAddress = _httpContext.Request.UserHostAddress,
                //        Time = DateTime.Now
                //    });


                //    if (dbCtx.SaveChanges() == -1)
                //    {
                //        throw new Exception("ERROR: Unable to Save Data to SQL server after Add Data into Visitor Logs.");
                //    }
                //    returnValue = true;
                //}
            }
            catch (Exception ex)
            {
                returnValue = false;
                Logging.ErrorLog(new HttpContextWrapper(_httpContext), ex);
            }
            return returnValue;
        }


        public static bool SessionLog(string sessionId, int hunterId)
        {
            bool returnValue = false;
            try
            {
                //using (var dbCtx = new REPO())
                //{
                //    dbCtx.UserSessions.Add(new UserSession()
                //    {
                //        Id = hunterId,
                //        SessionKey = sessionId,
                //        TraceDate = DateTime.Now
                //    });


                //    if (dbCtx.SaveChanges() == -1)
                //    {
                //        throw new Exception("ERROR: Unable to Save Data to SQL server after Add Data into TreasureHunterSessions Logs.");
                //    }
                //    returnValue = true;
                //}
            }
            catch (Exception ex)
            {
                returnValue = false;
                Logging.ErrorLog(null, ex);
            }
            return returnValue;
        }


        
        #region Add to logfile for any exceiptions / details loging
        public static void AddtoLogFile(string message)
        {
            if ((ConfigurationManager.AppSettings["logenable"].ToString()).ToUpper() == "YES")
            {
                var filename = @"\Log_" + DateTime.Now.ToString("dd-MM-yyyy") + ".txt";


                var value = System.Web.Hosting.HostingEnvironment.MapPath(@"~\") + "\\Logs\\";

                // Check the log file is exist or not. If not it will  create the directory and create the file else it will write the log on exisiting file.
                if (!System.IO.Directory.Exists(value))
                {
                    System.IO.Directory.CreateDirectory(value);
                }

                var filepath = value + filename;
                if (!File.Exists(filepath))
                {
                    var writer = File.CreateText(filepath);
                    writer.Close();
                }

                StackTrace st = new StackTrace();
                StackFrame sf = st.GetFrame(1);
                var method = sf.GetMethod();

                using (var writer = new StreamWriter(filepath, true))
                {
                    var sb = new StringBuilder();
                    sb.Append(Environment.NewLine + "---" + "Method Entered :" + method.DeclaringType.FullName + "." + method.Name + " : " + DateTime.Now.ToString() + "---");
                    sb.Append(message);
                    sb.Append(Environment.NewLine + "===================="+"End at : "+ DateTime.Now.ToString() +"=========================");
                    writer.WriteLine(sb.ToString());

                }


            }
            
            

        }

        static long filecount = 0;
        public static void AddtoLogFile(string message, string methodname)
        {
            filecount++;
            try
            {
                if ((ConfigurationManager.AppSettings["logenable"].ToString()).ToUpper() == "YES")
                {
                    var filename = @"\Log_" + methodname + "_" + filecount + ".txt";

                    var value = System.Web.Hosting.HostingEnvironment.MapPath(@"~\") + "/Logs/" + DateTime.Now.ToString("dd-MM-yyyy");
                    

                    // Check the log file is exist or not. If not it will  create the directory and create the file else it will write the log on exisiting file.
                    if (!System.IO.Directory.Exists(value))
                    {
                        System.IO.Directory.CreateDirectory(value);
                    }

                    var filepath = value + filename;
                    if (!File.Exists(filepath))
                    {
                        var writer = File.CreateText(filepath);
                        writer.Close();
                    }

                    StackTrace st = new StackTrace();
                    StackFrame sf = st.GetFrame(1);
                    var method = sf.GetMethod();

                    using (var writer = new StreamWriter(filepath, true))
                    {
                        var sb = new StringBuilder();
                        sb.Append(Environment.NewLine + "---" + "Method Entered :" + method.DeclaringType.FullName + "." + method.Name + " : " + DateTime.Now.ToString() + "---");
                        sb.Append(message);
                        sb.Append(Environment.NewLine + "====================" + "End at : " + DateTime.Now.ToString() + "=========================");
                        writer.WriteLine(sb.ToString());

                    }


                }

            }
            catch (Exception ex)
            {

            }


        }

        static long exceptionfilecount = 0;
        public static void AddtoLogExceptionFile(string message, string methodname)
        {
            exceptionfilecount++;
            try
            {
                //if ((ConfigurationManager.AppSettings["logenable"].ToString()).ToUpper() == "YES")
                //{
                    var filename = @"\Log_" + methodname + "_" + exceptionfilecount + ".txt";

                    var value = System.Web.Hosting.HostingEnvironment.MapPath(@"~\") + "/Logs/" + DateTime.Now.ToString("dd-MM-yyyy");


                    // Check the log file is exist or not. If not it will  create the directory and create the file else it will write the log on exisiting file.
                    if (!System.IO.Directory.Exists(value))
                    {
                        System.IO.Directory.CreateDirectory(value);
                    }

                    var filepath = value + filename;
                    if (!File.Exists(filepath))
                    {
                        var writer = File.CreateText(filepath);
                        writer.Close();
                    }

                    StackTrace st = new StackTrace();
                    StackFrame sf = st.GetFrame(1);
                    var method = sf.GetMethod();

                    using (var writer = new StreamWriter(filepath, true))
                    {
                        var sb = new StringBuilder();
                        sb.Append(Environment.NewLine + "---" + "Method Entered :" + method.DeclaringType.FullName + "." + method.Name + " : " + DateTime.Now.ToString() + "---");
                        sb.Append(message);
                        sb.Append(Environment.NewLine + "====================" + "End at : " + DateTime.Now.ToString() + "=========================");
                        writer.WriteLine(sb.ToString());

                    }


                //}

            }
            catch (Exception ex)
            {

            }


        }



        #endregion

        public static void appendtologger(string message, StringBuilder sblog)
        {
            try
            {
                sblog.AppendLine(message);
            }
            catch (Exception ex)
            {

            }




        }







    }
}
