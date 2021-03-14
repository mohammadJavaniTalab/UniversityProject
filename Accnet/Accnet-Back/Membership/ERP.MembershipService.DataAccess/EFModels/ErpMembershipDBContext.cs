using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ERP.MembershipService.DataAccess.EFModels
{
    public partial class ErpMembershipDBContext : DbContext
    {
        public ErpMembershipDBContext(DbContextOptions<ErpMembershipDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Feature> Feature { get; set; }
        public virtual DbSet<FeaturePermission> FeaturePermission { get; set; }
        public virtual DbSet<LinkedUser> LinkedUser { get; set; }
        public virtual DbSet<Permission> Permission { get; set; }
        public virtual DbSet<Receipt> Receipt { get; set; }
        public virtual DbSet<Relatives> Relatives { get; set; }
        public virtual DbSet<Role> Role { get; set; }
        public virtual DbSet<RoleFeature> RoleFeature { get; set; }
        public virtual DbSet<User> User { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Data Source=35.182.151.91;Initial Catalog=ERP.Membership;Persist Security Info=True;User ID=erp-user;Password=ASDqwe123;Connection Timeout=20;Max Pool Size=500;Pooling=true;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Feature>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(32);
            });

            modelBuilder.Entity<FeaturePermission>(entity =>
            {
                entity.HasIndex(e => new { e.FeatureId, e.PermissionId })
                    .HasName("IX_FeaturePermission_FeatureId_PermissionId_Unique")
                    .IsUnique();

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.HasOne(d => d.Feature)
                    .WithMany(p => p.FeaturePermission)
                    .HasForeignKey(d => d.FeatureId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FeaturePermission_Feature");

                entity.HasOne(d => d.Permission)
                    .WithMany(p => p.FeaturePermission)
                    .HasForeignKey(d => d.PermissionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FeaturePermission_Permission");
            });

            modelBuilder.Entity<LinkedUser>(entity =>
            {
                entity.HasIndex(e => new { e.FirstUserId, e.SecondUserId })
                    .HasName("IX_LinkedUser_FirstUser_SecondUser_Unique")
                    .IsUnique();

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.CreationDate)
                    .HasColumnType("smalldatetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.RelationType)
                    .IsRequired()
                    .HasMaxLength(64);

                entity.HasOne(d => d.FirstUser)
                    .WithMany(p => p.LinkedUserFirstUser)
                    .HasForeignKey(d => d.FirstUserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_LinkedUser_User");

                entity.HasOne(d => d.SecondUser)
                    .WithMany(p => p.LinkedUserSecondUser)
                    .HasForeignKey(d => d.SecondUserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_LinkedUser_User1");
            });

            modelBuilder.Entity<Permission>(entity =>
            {
                entity.HasIndex(e => e.Name)
                    .HasName("IX_Permission_Name_Unique")
                    .IsUnique();

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(32);
            });

            modelBuilder.Entity<Receipt>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Receipt)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Receipt_User");
            });

            modelBuilder.Entity<Relatives>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.DateOfBirth).HasColumnType("smalldatetime");

                entity.Property(e => e.Firstname)
                    .IsRequired()
                    .HasMaxLength(64);

                entity.Property(e => e.Lastname)
                    .IsRequired()
                    .HasMaxLength(64);

                entity.Property(e => e.RelationType)
                    .IsRequired()
                    .HasMaxLength(64);

                entity.Property(e => e.SinNumber)
                    .IsRequired()
                    .HasMaxLength(64);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Relatives)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Relatives_User");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(32);
            });

            modelBuilder.Entity<RoleFeature>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.HasOne(d => d.Feature)
                    .WithMany(p => p.RoleFeature)
                    .HasForeignKey(d => d.FeatureId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RoleFeature_Feature");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.RoleFeature)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RoleFeature_Role");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => new { e.Mobile, e.Email })
                    .HasName("IX_User_Mobile_Email_Unique")
                    .IsUnique();

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.Property(e => e.Address).HasMaxLength(512);

                entity.Property(e => e.City).HasMaxLength(64);

                entity.Property(e => e.CreationDate)
                    .HasColumnType("smalldatetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.DateOfBirth).HasColumnType("smalldatetime");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(128);

                entity.Property(e => e.Firstname)
                    .IsRequired()
                    .HasMaxLength(128);

                entity.Property(e => e.Gender)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.Lastname)
                    .IsRequired()
                    .HasMaxLength(128);

                entity.Property(e => e.Latitude).HasColumnType("decimal(12, 9)");

                entity.Property(e => e.Longtitude).HasColumnType("decimal(12, 9)");

                entity.Property(e => e.Mobile)
                    .IsRequired()
                    .HasMaxLength(64);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(1024);

                entity.Property(e => e.PoBox).HasMaxLength(64);

                entity.Property(e => e.PostalCode).HasMaxLength(64);

                entity.Property(e => e.Province).HasMaxLength(64);

                entity.Property(e => e.SinNumber).HasMaxLength(32);

                entity.Property(e => e.UnitNumber).HasMaxLength(64);

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(128);

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.User)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_Role");
            });
        }
    }
}
