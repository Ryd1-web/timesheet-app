using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimeSheetApplication.Contracts;
using TimeSheetApplication.Model;

namespace TimeSheetApplication.Controllers
{
    
    public class CheckInController : Controller
    {
        private IEmployeeUnitOfWork _employeeUnitOfWork { get; }

        public CheckInController(IEmployeeUnitOfWork employeeUnitOfWork)
        {
            _employeeUnitOfWork = employeeUnitOfWork;
        }

        public string GetLoggedUser()
        {

            var logUser = User.Identity.Name;
            //if (logUser == null)
            //{
            //    //logUser = "tayo.olawumi";
            //    logUser = "noah.salaudeen";
            //}

            return logUser;
        }
        public IActionResult Index()
        {

            return View();
        }

        public JsonResult ListTimeSheet()
        {
            var user = GetLoggedUser();
            var result = _employeeUnitOfWork.employee.GetAll();
            return Json(result);
        }

        [HttpPost]
        public JsonResult AddTimeSheet(string StaffNo)
        {
            if (!ModelState.IsValid)
            {

                var message = string.Join(" | ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
                return Json(new { success = false, message = message });
            }
            try
            {
                var staffNumber = _employeeUnitOfWork.employee.GetAll().Where(x => x.StaffNo == StaffNo).FirstOrDefault();
                
                EmployeeInfo employee = new EmployeeInfo();
                employee.Username = staffNumber.Username;
                employee.StaffNo = StaffNo;
               // employee.Userid = staffNumber.Userid;
                employee.TimeLoggedIn = DateTime.Now;
                employee.Status = "Employee Clocked In";
                _employeeUnitOfWork.employee.Add(employee);
                _employeeUnitOfWork.Commit();
                return Json(true);
            }
            catch (Exception ex)
            {

                return Json(ex);
            }
        }

        [HttpPost]
        public JsonResult AddClockOut(EmployeeInfo employeeinfo)
        {
            if (!ModelState.IsValid)
            {

                var message = string.Join(" | ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
                return Json(new { success = false, message = message });
            }
            try
            {

                employeeinfo.TimeLoggedOut = DateTime.Now;
                employeeinfo.Status = "Employee Clocked Out";
                _employeeUnitOfWork.employee.Update(employeeinfo);
                _employeeUnitOfWork.Commit();
                return Json(true);
            }
            catch (Exception ex)
            {

                return Json(ex);
            }
        }

        [HttpPost]
        public JsonResult UpdateTimeSheet(EmployeeInfo employeeinfo)
        {
            if (!ModelState.IsValid)
            {

                var message = string.Join(" | ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
                return Json(new { success = false, message = message });
            }
            try
            {

               
                employeeinfo.Status = "Employee Clocked In";
                _employeeUnitOfWork.employee.Update(employeeinfo);
                _employeeUnitOfWork.Commit();
                return Json(true);
            }
            catch (Exception ex)
            {

                return Json(ex);
            }
        }


    }

}
