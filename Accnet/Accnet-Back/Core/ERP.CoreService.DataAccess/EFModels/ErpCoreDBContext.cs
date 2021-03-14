using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ERP.CoreService.DataAccess.EFModels
{
    public partial class ErpCoreDBContext : DbContext
    {

        public ErpCoreDBContext(DbContextOptions<ErpCoreDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Action> Action { get; set; }
        public virtual DbSet<Answer> Answer { get; set; }
        public virtual DbSet<Appointment> Appointment { get; set; }
        public virtual DbSet<AppointmentException> AppointmentException { get; set; }
        public virtual DbSet<Blob> Blob { get; set; }
        public virtual DbSet<Comment> Comment { get; set; }
        public virtual DbSet<ExtraTaxFile> ExtraTaxFile { get; set; }
        public virtual DbSet<Invoice> Invoice { get; set; }
        public virtual DbSet<Message> Message { get; set; }
        public virtual DbSet<MustAnswered> MustAnswered { get; set; }
        public virtual DbSet<PaypalOrder> PaypalOrder { get; set; }
        public virtual DbSet<Question> Question { get; set; }
        public virtual DbSet<Survey> Survey { get; set; }
        public virtual DbSet<Tax> Tax { get; set; }
        public virtual DbSet<TaxFile> TaxFile { get; set; }
        public virtual DbSet<Ticket> Ticket { get; set; }
        public virtual DbSet<UserAnswer> UserAnswer { get; set; }
        public virtual DbSet<UserAssessmentBlob> UserAssessmentBlob { get; set; }
        public virtual DbSet<UserAssessmentSurvey> UserAssessmentSurvey { get; set; }
        public virtual DbSet<UserDependentSurvey> UserDependentSurvey { get; set; }
        public virtual DbSet<UserRelativeSurvey> UserRelativeSurvey { get; set; }
        public virtual DbSet<UserSurvey> UserSurvey { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Data Source=35.182.151.91;Initial Catalog=ERP.Core;Persist Security Info=True;User ID=erp-user;Password=ASDqwe123;Connection Timeout=20;Max Pool Size=500;Pooling=true;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Action>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Value).HasColumnType("decimal(10, 3)");

                entity.HasOne(d => d.Answer)
                    .WithMany(p => p.Action)
                    .HasForeignKey(d => d.AnswerId)
                    .HasConstraintName("FK_Action_Answer");
            });

            modelBuilder.Entity<Answer>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.ModifiedDate)
                    .HasColumnType("smalldatetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Number).HasColumnType("decimal(4, 2)");

                entity.Property(e => e.Text)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.HasOne(d => d.Question)
                    .WithMany(p => p.Answer)
                    .HasForeignKey(d => d.QuestionId)
                    .HasConstraintName("FK_Answer_Question1");
            });

            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.CreationDate)
                    .HasColumnType("smalldatetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Date)
                    .HasColumnType("smalldatetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(64);

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasMaxLength(64);

                entity.HasOne(d => d.Invoice)
                    .WithMany(p => p.Appointment)
                    .HasForeignKey(d => d.InvoiceId)
                    .HasConstraintName("FK_Appointment_Invoice");
            });

            modelBuilder.Entity<AppointmentException>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.FromDate).HasColumnType("smalldatetime");

                entity.Property(e => e.ToDate).HasColumnType("smalldatetime");
            });

            modelBuilder.Entity<Blob>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.ContentType)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.CreationDate)
                    .HasColumnType("smalldatetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.File).IsRequired();

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(256);
            });

            modelBuilder.Entity<Comment>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.CreationDate)
                    .HasColumnType("smalldatetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Text)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.HasOne(d => d.Blob)
                    .WithMany(p => p.Comment)
                    .HasForeignKey(d => d.BlobId)
                    .HasConstraintName("FK_Comment_Blob");

                entity.HasOne(d => d.Ticket)
                    .WithMany(p => p.Comment)
                    .HasForeignKey(d => d.TicketId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Comment_Ticket");
            });

            modelBuilder.Entity<ExtraTaxFile>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Efile).HasColumnName("EFile");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(64);

                entity.HasOne(d => d.Blob)
                    .WithMany(p => p.ExtraTaxFile)
                    .HasForeignKey(d => d.BlobId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ExtraTaxFile_Blob");

                entity.HasOne(d => d.TaxFile)
                    .WithMany(p => p.ExtraTaxFile)
                    .HasForeignKey(d => d.TaxFileId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ExtraTaxFile_TaxFile");
            });

            modelBuilder.Entity<Invoice>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Amount).HasColumnType("decimal(12, 3)");

                entity.Property(e => e.CreationDate)
                    .HasColumnType("smalldatetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(2048);

                entity.Property(e => e.TaxAmount).HasColumnType("decimal(12, 3)");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(64);

                entity.HasOne(d => d.PaypalOrder)
                    .WithMany(p => p.Invoice)
                    .HasForeignKey(d => d.PaypalOrderId)
                    .HasConstraintName("FK_Invoice_PaypalOrder");
            });

            modelBuilder.Entity<Message>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Body)
                    .IsRequired()
                    .HasMaxLength(1024);

                entity.Property(e => e.CreationDate)
                    .HasColumnType("smalldatetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(64);
            });

            modelBuilder.Entity<MustAnswered>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.HasOne(d => d.Answer)
                    .WithMany(p => p.MustAnswered)
                    .HasForeignKey(d => d.AnswerId)
                    .HasConstraintName("FK_MustAnswered_Answer");

                entity.HasOne(d => d.Question)
                    .WithMany(p => p.MustAnswered)
                    .HasForeignKey(d => d.QuestionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MustAnswered_Question");
            });

            modelBuilder.Entity<PaypalOrder>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Amount).HasColumnType("decimal(12, 3)");

                entity.Property(e => e.ApproveLink)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.CaptureLink)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.OrderId)
                    .IsRequired()
                    .HasMaxLength(64);

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasMaxLength(10);
            });

            modelBuilder.Entity<Question>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.ModifiedDate)
                    .HasColumnType("smalldatetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Number).HasColumnType("decimal(4, 2)");

                entity.Property(e => e.Text)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.HasOne(d => d.Survey)
                    .WithMany(p => p.Question)
                    .HasForeignKey(d => d.SurveyId)
                    .HasConstraintName("FK_Question_Survey");
            });

            modelBuilder.Entity<Survey>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.CreationDate)
                    .HasColumnType("smalldatetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Description).HasMaxLength(256);

                entity.Property(e => e.ModifiedDate)
                    .HasColumnType("smalldatetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(64);
            });

            modelBuilder.Entity<Tax>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Amount).HasColumnType("decimal(12, 3)");

                entity.Property(e => e.CreationDate)
                    .HasColumnType("smalldatetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(64);

                entity.HasOne(d => d.TaxFile)
                    .WithMany(p => p.Tax)
                    .HasForeignKey(d => d.TaxFileId)
                    .HasConstraintName("FK_Tax_TaxFile");

                entity.HasOne(d => d.UserSurvey)
                    .WithMany(p => p.Tax)
                    .HasForeignKey(d => d.UserSurveyId)
                    .HasConstraintName("FK_Tax_UserSurvey");
            });

            modelBuilder.Entity<TaxFile>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.HasOne(d => d.EngagementBlob)
                    .WithMany(p => p.TaxFileEngagementBlob)
                    .HasForeignKey(d => d.EngagementBlobId)
                    .HasConstraintName("FK_TaxFile_Blob");

                entity.HasOne(d => d.TaxFormBlob)
                    .WithMany(p => p.TaxFileTaxFormBlob)
                    .HasForeignKey(d => d.TaxFormBlobId)
                    .HasConstraintName("FK_TaxFile_Blob1");

                entity.HasOne(d => d.UserSignedEngagement)
                    .WithMany(p => p.TaxFileUserSignedEngagement)
                    .HasForeignKey(d => d.UserSignedEngagementId)
                    .HasConstraintName("FK_TaxFile_Blob2");

                entity.HasOne(d => d.UserSignedTaxForm)
                    .WithMany(p => p.TaxFileUserSignedTaxForm)
                    .HasForeignKey(d => d.UserSignedTaxFormId)
                    .HasConstraintName("FK_TaxFile_Blob3");
            });

            modelBuilder.Entity<Ticket>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.CreationDate)
                    .HasColumnType("smalldatetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Text)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(64);

                entity.HasOne(d => d.Blob)
                    .WithMany(p => p.Ticket)
                    .HasForeignKey(d => d.BlobId)
                    .HasConstraintName("FK_Ticket_Blob");
            });

            modelBuilder.Entity<UserAnswer>(entity =>
            {
                entity.HasIndex(e => new { e.AnswerId, e.UserSurveyId })
                    .HasName("IX_UserAnswer_AnswerId_UserSurveyId_Unique")
                    .IsUnique();

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Text).HasMaxLength(128);

                entity.HasOne(d => d.Answer)
                    .WithMany(p => p.UserAnswer)
                    .HasForeignKey(d => d.AnswerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UserAnswer_Answer");

                entity.HasOne(d => d.UserSurvey)
                    .WithMany(p => p.UserAnswer)
                    .HasForeignKey(d => d.UserSurveyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UserAnswer_UserSurvey");
            });

            modelBuilder.Entity<UserAssessmentBlob>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.HasOne(d => d.Blob)
                    .WithMany(p => p.UserAssessmentBlob)
                    .HasForeignKey(d => d.BlobId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UserAssessmentBlob_Blob");

                entity.HasOne(d => d.UserAssesmentSurvey)
                    .WithMany(p => p.UserAssessmentBlob)
                    .HasForeignKey(d => d.UserAssesmentSurveyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UserAssessmentBlob_UserAssessmentSurvey");
            });

            modelBuilder.Entity<UserAssessmentSurvey>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.HasOne(d => d.UserSurvey)
                    .WithMany(p => p.UserAssessmentSurvey)
                    .HasForeignKey(d => d.UserSurveyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UserAssessmentSurvey_UserSurvey");
            });

            modelBuilder.Entity<UserDependentSurvey>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.HasOne(d => d.UserSurvey)
                    .WithMany(p => p.UserDependentSurvey)
                    .HasForeignKey(d => d.UserSurveyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UserDependentSurvey_UserSurvey");
            });

            modelBuilder.Entity<UserRelativeSurvey>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.HasOne(d => d.UserSurvey)
                    .WithMany(p => p.UserRelativeSurvey)
                    .HasForeignKey(d => d.UserSurveyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UserRelativeSurvey_UserSurvey");
            });

            modelBuilder.Entity<UserSurvey>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.HasOne(d => d.Invoice)
                    .WithMany(p => p.UserSurvey)
                    .HasForeignKey(d => d.InvoiceId)
                    .HasConstraintName("FK_UserSurvey_Invoice");

                entity.HasOne(d => d.Survey)
                    .WithMany(p => p.UserSurvey)
                    .HasForeignKey(d => d.SurveyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UserSurvey_Survey");

                entity.HasOne(d => d.Ticket)
                    .WithMany(p => p.UserSurvey)
                    .HasForeignKey(d => d.TicketId)
                    .HasConstraintName("FK_UserSurvey_Ticket");
            });
        }
    }
}
