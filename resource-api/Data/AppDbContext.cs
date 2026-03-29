using Microsoft.EntityFrameworkCore;
using ResourceApi.Models;

namespace ResourceApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Image> Images { get; set; } = null!;
        public DbSet<Tag> Tags { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Many-to-many relationship between Images and Tags
            modelBuilder.Entity<Image>()
                .HasMany(i => i.Tags)
                .WithMany()
                .UsingEntity<Dictionary<string, object>>( // Use Dictionary for join table in EF Core 5+
                    "ImageTags"); // Name of join table
        }
    }
}