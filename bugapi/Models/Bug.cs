using System;

public class Bug
{
    public int bug_id { get; set; }
    public long bug_number { get; set; }
    public DateTime bug_createddate { get; set; }
    public string bug_description { get; set; }
    public DateTime bug_lastdiffed { get; set; }
    public string bug_title { get; set; }
    public int bug_createdby { get; set; }
    public int bug_assignedto { get; set; }
    public string bug_filterassignedto { get; set; }
    public int bug_resolvedby { get; set; }
    public DateTime bug_modifieddate { get; set; }
    public int bug_stat_id { get; set; }
    public string bug_filterstat_id { get; set; }
    public int bug_proj_id { get; set; }
    public int bug_user_id { get; set; }
    public int bug_sev_id { get; set; }
    public string bug_filtersev_id { get; set; }
    public int bug_acco_id { get; set; }
    public int bug_mod_id { get; set; }
    public string bug_assignedby { get; set; }
    public string bug_status_name { get; set; }
    public string bug_seve_name { get; set; }
    public string status_name { get; set; }
    public string seve_name { get; set; }
    public string bug_attachment { get; set; }
    public string attachmentpath { get; set; }

    public int user_id { get; set; }

    public string user_username { get; set; }
    public string user_emailid { get; set; }
    public string proj_name { get; set; }

    public int com_id { get; set; }
    public int com_bug_id { get; set; }
    public string com_description { get; set; }
    public DateTime com_createddate { get; set; }
    public int com_modifiedby { get; set; }
    public int com_createdby { get; set; }
    public int com_proj_id { get; set; }
    public int com_stat_id { get; set; }
    public string com_attatch { get; set; }

    public string user_logo { get; set; }
    public string logopath { get; set; }
    public int pagesize { get; set; }
    public int pageno { get; set; }
    public int bug_pstat_id { get; set; }


}

public class Bugwrapper
{
    public Bug root { get; set; }
}

public class ResultMessage
{

    public string Message { get; set; }
    public string Message1 { get; set; }

}






