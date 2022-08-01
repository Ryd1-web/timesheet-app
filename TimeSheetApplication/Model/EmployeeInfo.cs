using System;
using System.Collections.Generic;

namespace TimeSheetApplication.Model
{
    public partial class EmployeeInfo
    {
        public int Userid { get; set; }
        public string StaffNo { get; set; }

        public string Status { get; set; }
        public string Username { get; set; }
        public DateTime? TimeLoggedOut { get; set; }
        public DateTime? TimeLoggedIn { get; set; }
        
    }
}
