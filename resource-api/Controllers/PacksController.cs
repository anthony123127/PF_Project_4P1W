using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using resource_api.Services;

namespace resource_api.Controllers;

[ApiController]
[Authorize]
[Route("packs")]
public class PacksController(GameStore gameStore) : ControllerBase
{
    [HttpGet]
    public IActionResult GetPacks([FromQuery] bool random = false)
    {
        return Ok(gameStore.GetPublishedPacks(random));
    }

    [HttpPost("{packId:guid}/restart")]
    public IActionResult RestartPack(Guid packId)
    {
        var userId = GameStore.GetUserId(User);
        gameStore.ResetPackProgress(userId, packId);
        return NoContent();
    }
}
