using System;
using TimeSheetApplication.Contracts;
using TimeSheetApplication.Helpers;
using TimeSheetApplication.Model;

namespace TimeSheetApplication
{
    public class EmployeeUnitOfWork : IEmployeeUnitOfWork, IDisposable
    {
        private readonly TimesheetContext DbContext = new TimesheetContext();
        private IRepositoryProvider RepositoryProvider { get; }

        // Define repository interfaces
      

        public IEmployeeInfoRepository employee => GetEntityRepository<IEmployeeInfoRepository>();

        public EmployeeUnitOfWork(IRepositoryProvider repositoryProvider)
        {
            repositoryProvider.DbContext = DbContext;
            RepositoryProvider = repositoryProvider; 
        }
        
        public void Commit()
        {
            DbContext.SaveChanges();
        }

        private IRepository<T> GetStandardRepository<T>() where T : class
        {
            return RepositoryProvider.GetRepositoryForEntityType<T>();
        }
        
        private T GetEntityRepository<T>() where T : class
        {
            return RepositoryProvider.GetRepository<T>();
        }
        
        #region IDisposable

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (DbContext != null)
                {
                    DbContext.Dispose();
                }
            }
        }

        #endregion
    }
}