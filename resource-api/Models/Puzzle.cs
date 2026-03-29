using System.ComponentModel.DataAnnotations;

namespace ResourceApi.Models
{
    public class Puzzle
    {
        public int Id { get; set; }

        [Required]
        public string Answer { get; set; } = null!;

        public string? Hint { get; set; }

        public int Difficulty { get; set; }

        // Navigation
        public List<Image> Images { get; set; } = new();
        public List<Pack> Packs { get; set; } = new();
    }
}