using System.ComponentModel.DataAnnotations;

namespace ResourceApi.Models
{
    public class Pack
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = null!;

        public string? Description { get; set; }

        public bool IsPublished { get; set; } = false;

        public List<Puzzle> Puzzles { get; set; } = new();
    }
}
