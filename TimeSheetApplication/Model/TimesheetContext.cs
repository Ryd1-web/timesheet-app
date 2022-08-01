using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace TimeSheetApplication.Model
{
    public partial class TimesheetContext : IdentityDbContext<IdentityUser>
    {
        public TimesheetContext()
        {
        }

        public TimesheetContext(DbContextOptions<TimesheetContext> options)
            : base(options)
        {
        }

        public virtual DbSet<EmployeeInfo> EmployeeInfo { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                //optionsBuilder.UseSqlServer("Server=EZEKIELLUCKY\\LUCKY;Database=Timesheet;Trusted_Connection=True;");
                optionsBuilder.UseSqlServer("Server=EMIOLA\\EMIOLA;Database=Timesheet;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<EmployeeInfo>(entity =>
            {
                entity.HasKey(e => e.Userid)
                    .HasName("PK__Employee__1797D0246CBB363B");

                entity.Property(e => e.TimeLoggedOut).HasColumnType("datetime");

                entity.Property(e => e.StaffNo)
                   .HasColumnName("StaffNo")
                   .HasMaxLength(20)
                   .IsUnicode(false);

                entity.Property(e => e.Status)
                   .HasColumnName("Status")
                   .HasMaxLength(20)
                   .IsUnicode(false);

                entity.Property(e => e.TimeLoggedIn)
                    .HasColumnName("timeLoggedIn")
                    .HasColumnType("datetime");

                entity.Property(e => e.Username)
                    .HasMaxLength(20)
                    .IsUnicode(false);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
