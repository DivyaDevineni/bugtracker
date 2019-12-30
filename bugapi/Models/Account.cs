using System;

    public class Account
    {
        public int acco_id { get; set; }
        public string acco_name { get; set; }
        public string acco_emailid { get; set; }
        public DateTime acco_createddate { get; set; }
        public DateTime acco_modifieddate { get; set; }

    }

    public class Accountwrapper
    {
        public Account root { get; set; }
    }
    public class ResultMessage4
    {

        public string Message { get; set; }

    }