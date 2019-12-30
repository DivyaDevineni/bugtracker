using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;



public class Module
{
    public int mod_id { get; set; }

    public string mod_name { get; set; }

    public int mod_proj_id { get; set; }

    public int user_id { get; set; }

    public int mod_createdby { get; set; }

    public DateTime mod_createddate { get; set; }

    public int mod_modifiedby { get; set; }

    public DateTime mod_modifieddate { get; set; }

    public bool mod_isactive { get; set; }

    public int pagesize { get; set; }

    public int pageno { get; set; }

}

public class Modulewrapper
{
    public Module root { get; set; }
}
public class ResultMessage6
{

    public string Message { get; set; }

}
