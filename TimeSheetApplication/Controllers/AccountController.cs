using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;
using TimeSheetApplication.Contracts;
using TimeSheetApplication.Model;

namespace TimeSheetApplication.Controllers
{
    public class AccountController : Controller
    {
        
        private IEmployeeUnitOfWork _employeeUnitOfWork { get; }
        private readonly TimesheetContext _db;
        private readonly UserManager<IdentityUser> _usermanager;
        private readonly SignInManager<IdentityUser> _signinmanager;
        public AccountController(IEmployeeUnitOfWork employeeUnitOfWork  ,UserManager<IdentityUser> usermanager, SignInManager<IdentityUser> signinmanager, TimesheetContext db)
        {
            _db = db;
            _usermanager = usermanager;
            _signinmanager = signinmanager;
            _employeeUnitOfWork = employeeUnitOfWork;
        }

        public static string GetRandNo(int length)
        {
            byte[] number = new byte[6];
            new Random().NextBytes(number);
            var random = new BigInteger(number).ToString();
            return random.Substring(random.Length - length);
        }
        [HttpPost]
        public async Task<IActionResult> Login(LoginVM model)
        {
            if (ModelState.IsValid)
            {
                var result = await _signinmanager.PasswordSignInAsync(model.UserName, model.Password, model.RememberMe, false);
               
                if (result.Succeeded)
                {
                  
                    return RedirectToAction("index", "Home");
                }
                ModelState.AddModelError(string.Empty, "invalid credentials");

            }

      
            return View(model);
        }

        public IActionResult Login()
        {
            return View();
        }
        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new IdentityUser { UserName = model.UserName };
                var result = await _usermanager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                  await _signinmanager.SignInAsync(user, isPersistent: false);
                    // var employeeinformation = _db.EmployeeInfo.Where(x => x.Username == model.UserName).FirstOrDefault();
                    EmployeeInfo employeeInfo = new EmployeeInfo(); 
                    employeeInfo.StaffNo = GetRandNo(5);
                    employeeInfo.Username = model.UserName;
                    _employeeUnitOfWork.employee.Add(employeeInfo);
                    _employeeUnitOfWork.Commit();
                    return RedirectToAction("Login", "Account");
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                }
            }
            return View(model);
        }
        [HttpPost]
        public async Task<IActionResult> logout()
        {
            await _signinmanager.SignOutAsync();
            return RedirectToAction("Login", "Account");

        }
    }
}
