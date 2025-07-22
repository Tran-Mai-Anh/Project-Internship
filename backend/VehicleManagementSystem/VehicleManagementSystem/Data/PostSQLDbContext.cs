using Microsoft.EntityFrameworkCore;
using VehicleManagementSystem.Models.Entities;
namespace VehicleManagementSystem.Data
{
    public class PostSQLDbContext : DbContext
    {
        public PostSQLDbContext(DbContextOptions<PostSQLDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<VehicleData> VehicleDatas { get; set; }
        public DbSet<VehicleLocation> VehicleLocations { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Role> Role { get; set; }
        public DbSet<UserRole> UserRole { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<VehicleLocation>()
               .HasIndex(v => new { v.VehicleId, v.Timestamp })
               .HasDatabaseName("IX_VehicleLocation_VehicleId_Timestamp");

            // Vehicle belongs to User (User - Vehicle: One-to-many)
            modelBuilder.Entity<Vehicle>()
                .HasOne(v => v.User)
                .WithMany(u => u.Vehicles)
                .HasForeignKey(v => v.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // VehicleData belongs to Vehicle (One-to-Many)
            modelBuilder.Entity<VehicleData>()
                .HasOne(vd => vd.Vehicle)
                .WithMany(v => v.VehicleDatas)
                .HasForeignKey(vd => vd.VehicleId)
                .OnDelete(DeleteBehavior.Cascade);

            // VehicleLocation belongs to Vehicle (One-to-One)
            modelBuilder.Entity<VehicleLocation>()
                .HasOne(vl => vl.Vehicle)
                .WithMany(v => v.VehicleLocations)
                .HasForeignKey(vl => vl.VehicleId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);
        }
    }
}

