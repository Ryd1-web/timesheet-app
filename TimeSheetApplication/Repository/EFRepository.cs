using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using TimeSheetApplication.Contracts;
using TimeSheetApplication.Model;

namespace TimeSheetApplication.Repository
{    /// <summary>
     /// The EF-dependent, generic repository for data access
     /// </summary>
     /// <typeparam name="T">Type of entity for this Repository.</typeparam>
    public class EFRepository<T> : IRepository<T> where T : class
    {
        private TimesheetContext Context = new TimesheetContext();

        public EFRepository(TimesheetContext context)
        {
            if (context == null)
                throw new ArgumentNullException("context");
            Context = context;
            dbSet = Context.Set<T>();
        }

        

        protected DbSet<T> dbSet { get; set; }

        public virtual IQueryable<T> GetAll()
        {
            return dbSet;
        }

        public virtual IEnumerable<T> Get(Expression<Func<T, bool>> filter = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
       string includeProperties = "")
        {
            IQueryable<T> query = dbSet.AsNoTracking<T>();

            if (filter != null)
            {
                query = query.Where(filter);
            }

            foreach (var includeProperty in includeProperties.Split
                (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }

            if (orderBy != null)
            {
                return orderBy(query).ToList();
            }
            else
            {
                return query.ToList();
            }
        }

        public virtual T GetById(int id)
        {
            //return DbSet.FirstOrDefault(PredicateBuilder.GetByIdPredicate<T>(id));
            return dbSet.Find(id);
        }
        public IEnumerable<T> Find(Expression<Func<T, bool>> predicate)
        {
            return dbSet.Where(predicate);
        }

        public T SingleOrDefault(Expression<Func<T, bool>> predicate)
        {
            return dbSet.SingleOrDefault(predicate);
        }

        public virtual void Add(T entity)
        {
            EntityEntry dbEntityEntry = Context.Entry(entity);
            if (dbEntityEntry.State != EntityState.Detached)
            {
                dbEntityEntry.State = EntityState.Added;
            }
            else
            {
                dbSet.Add(entity);
            }
        }
        public void AddRange(IEnumerable<T> entities)
        {
            dbSet.AddRange(entities);
        }

        public void RemoveRange(IEnumerable<T> entities)
        {
            dbSet.RemoveRange(entities);
        }
        public virtual void Update(T entity)
        {
            EntityEntry dbEntityEntry = Context.Entry(entity);
            if (dbEntityEntry.State == EntityState.Detached)
            {
                dbSet.Attach(entity);
            }
            dbEntityEntry.State = EntityState.Modified;
        }

        public virtual void Delete(T entity)
        {
            EntityEntry dbEntityEntry = Context.Entry(entity);
            if (dbEntityEntry.State != EntityState.Deleted)
            {
                dbEntityEntry.State = EntityState.Deleted;
            }
            else
            {
                dbSet.Attach(entity);
                dbSet.Remove(entity);
            }
        }

        public virtual void Delete(int id)
        {
            var entity = GetById(id);
            if (entity == null) return; // not found; assume already deleted.
            Delete(entity);
        }

        //For the consumption of Api's in ApiConstants
        public async Task<string> GetAsync(string uri) //, string authToken = ""
        {
            string jsonResult = string.Empty;

            try
            {
                HttpClient httpClient = CreateHttpClient(uri);

                var responseMessage = await httpClient.GetAsync(uri);

                if (responseMessage.IsSuccessStatusCode)
                {
                    jsonResult = await responseMessage.Content.ReadAsStringAsync().ConfigureAwait(false);
                    return jsonResult;
                }

                if (responseMessage.StatusCode == HttpStatusCode.Forbidden ||
                    responseMessage.StatusCode == HttpStatusCode.Unauthorized)
                {
                    return jsonResult;
                }
                return jsonResult;

            }
            catch (Exception e)
            {
                return jsonResult;
            }
        }

        private HttpClient CreateHttpClient(string authToken)
        {
            var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            if (!string.IsNullOrEmpty(authToken))
            {
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);
            }
            return httpClient;
        }

    }
}
