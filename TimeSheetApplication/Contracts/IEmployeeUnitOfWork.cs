using TimeSheetApplication.Contracts;

namespace TimeSheetApplication.Contracts
{
    /// <summary>
    /// Interface for the "Unit of Work"
    /// </summary>
    public interface IEmployeeUnitOfWork
    {
        // Save pending changes to the data store.
        void Commit();

        // Repositories


        IEmployeeInfoRepository employee { get; }
    }
}