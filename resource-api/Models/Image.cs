using System.ComponentModel.DataAnnotations;

namespace ResourceApi.Models
{
    public class Image
    {
        public int Id { get; set; }

        [Required]
        public string Url { get; set; } = null!;

        public List<Tag> Tags { get; set; } = new();
    }
}