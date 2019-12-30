using System;

    public class ProjectByUser
    {
        public int puser_user_id { get; set; }
        public string puser_role { get; set; }
        public DateTime puser_createddate { get; set; }
        public string puser_createdby { get; set; }
        public DateTime puser_modifieddate { get; set; }
        public string puser_modifiedby { get; set; }
        public int puser_proj_id { get; set; }
        public string user_emailid { get; set; }
         public int pagesize { get; set; }
        public int pageno { get; set; }

}

public class ProjectUserwrapper
{
    public ProjectByUser root { get; set; }
}
public class ResultMessage2
{

    public string Message { get; set; }

}