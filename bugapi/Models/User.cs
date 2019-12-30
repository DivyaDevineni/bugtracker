
using System;
using System.Linq;

public class Users
    {
        public int user_id { get; set; }
        public string user_firstname { get; set; }
        public string user_lastname { get; set; }
        public string user_username { get; set; }
        public string user_emailid { get; set; }
        public string user_password { get; set; }
        public int acco_id { get; set; }

        public int user_acco_id { get; set; }
        public string user_usertype { get; set; }
        public int user_creattedby { get; set; }
        public string user_mobilenumber { get; set; }
        public DateTime user_createddate { get; set; }
        public int user_proj_id { get; set; }
        public string user_isactive { get; set; }
    
         public string user_logo { get; set; }
        public string logopath { get; set; }


    }

public class UserCredentials
{
    public string user_emailid { get; set; }
    public string user_password { get; set; }
    public string user_logo { get; set; }
    public string logopath { get; set; }
}
    public class Userswrapper
    {
        public Users root { get; set; }
    }

public class UserCredentialsWrapper
{
    public UserCredentials root { get; set; }
}

public class ResultMessage1
{

    public string Message { get; set; }

}
public static class btcommon
{


    public static void ConvertToJSON()
    {
        try
        {



        }
        catch (Exception ex)
        {

        }
    }

    #region Random string Generation
    private static Random random = new Random();
    public static string RandomString(int length)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return new string(Enumerable.Repeat(chars, length)
          .Select(s => s[random.Next(s.Length)]).ToArray());
    }

    #endregion


    public static string ConvertGuidToOctectString()
    {
        string queryGuid = "";
        try
        {



            queryGuid = RandomString(8);
            queryGuid = RandomString(5) + queryGuid;
            queryGuid = RandomString(9) + queryGuid;
            queryGuid = RandomString(4) + queryGuid;



        }
        catch (Exception ex)
        {

        }

        return queryGuid;

    }

}

