using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SignalRSample.Models;

namespace SignalRSample.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Order> Orders { get; set; }
        public DbSet<ChatRoom> ChatRooms { get; set; }

        // Insert Data on Database creation
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Set Scehema Name e.g. -> signalRSample.DatabaseTableName
            modelBuilder.HasDefaultSchema("signalRSample");

            // For "The entity type 'IdentityUserLogin<string>' requires a primary key to be defined." error message while migration
            base.OnModelCreating(modelBuilder);
        }
    }
}