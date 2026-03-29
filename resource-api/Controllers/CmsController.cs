using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using resource_api.Models;
using resource_api.Services;

namespace resource_api.Controllers;

[ApiController]
[Authorize(Roles = "admin")]
[Route("cms")]
public class CmsController : ControllerBase
{
    private readonly GameStore _gameStore;

    public CmsController(GameStore gameStore)
    {
        _gameStore = gameStore;
    }

    [HttpGet("tags")]
    public IActionResult GetTags()
    {
        var tags = _gameStore.GetAllTags();
        return Ok(tags.Select((name, index) => new { id = index + 1, name }));
    }

    [HttpGet("images")]
    public IActionResult GetImages()
    {
        var images = _gameStore.GetAllImages();
        return Ok(images.Select(img => new {
            id = img.Id,
            url = img.Url,
            tags = img.Tags.Select((name, index) => new { id = index + 1, name })
        }));
    }

    [HttpPost("images")]
    [Consumes("multipart/form-data")]
    public IActionResult UploadImage([FromForm] IFormFile file)
    {
        // Mock upload: in a real app, save to disk/cloud.
        // For this project, we'll just add a placeholder image with a random Unsplash URL
        // or just return success if we can't actually store files in this environment.
        var id = Guid.NewGuid();
        var url = "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=600&q=80"; // Placeholder
        var image = new ImageAsset(id, url, "Uploaded Image", []);
        _gameStore.UpsertImage(image);
        return Ok(image);
    }

    [HttpPost("images/{imageId:guid}/tags")]
    public IActionResult AddTagToImage(Guid imageId, [FromBody] string tagName)
    {
        var images = _gameStore.GetAllImages();
        var image = images.FirstOrDefault(i => i.Id == imageId);
        if (image == null) return NotFound();

        var newTags = image.Tags.ToList();
        if (!newTags.Contains(tagName))
        {
            newTags.Add(tagName);
            _gameStore.UpsertImage(image with { Tags = newTags });
        }
        return Ok();
    }

    [HttpDelete("images/{imageId:guid}/tags/{tagName}")]
    public IActionResult RemoveTagFromImage(Guid imageId, string tagName)
    {
        var images = _gameStore.GetAllImages();
        var image = images.FirstOrDefault(i => i.Id == imageId);
        if (image == null) return NotFound();

        var newTags = image.Tags.ToList();
        if (newTags.Remove(tagName))
        {
            _gameStore.UpsertImage(image with { Tags = newTags });
        }
        return Ok();
    }
}
