using System;

public class Project
{
    public int proj_id { get; set; }
    public string proj_name { get; set; }
    public string proj_description { get; set; }
    public DateTime proj_createddate { get; set; }
    public int proj_createdby { get; set; }
    public DateTime proj_startdate { get; set; }
    public DateTime proj_estimatedenddate { get; set; }
    public string proj_imagepath { get; set; }
    public string proj_status { get; set; }
    public int user_id { get; set; }
    public int acco_id { get; set; }
    public string user_emailid { get; set; }

}
public class Projectwrapper
{
    public Project root { get; set; }

}
public class ResultMessage3
{

    public string Message { get; set; }

}