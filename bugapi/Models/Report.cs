using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace bugapi.Models
{
    public class Report
    {
        public int status_id { get; set; }
        public string status_name { get; set; }
        public int proj_id { get; set; }
        public int bug_stat_id { get; set; }
        public int bug_proj_id { get; set; }
        public int user_id { get; set; }
        public int pagesize { get; set; }
        public int pageno { get; set; }



    }
    public class Reportwrapper
    {
        public Report root { get; set; }
    }

    public class ResultMessage5
    {

        public string Message { get; set; }
        public string Message1 { get; set; }

    }
}