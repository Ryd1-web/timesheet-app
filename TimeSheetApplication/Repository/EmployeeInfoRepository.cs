
using TimeSheetApplication.Contracts;
using TimeSheetApplication.Model;

namespace TimeSheetApplication.Repository
{
    public class EmployeeInfoRepository : EFRepository<EmployeeInfo>, IEmployeeInfoRepository
    {
        public EmployeeInfoRepository(TimesheetContext context) : base(context)
        {
        }
    }
}