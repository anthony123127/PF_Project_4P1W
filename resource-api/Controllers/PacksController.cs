using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using resource_api.Services;

namespace resource_api.Controllers;

[ApiController]
[Authorize]
[Route("packs")]
public class PacksController : ControllerBase
{
    private readonly GameStore _gameStore;

    public PacksController(GameStore gameStore)
    {
        _gameStore = gameStore;
    }

    [HttpGet]
    public IActionResult GetPacks([FromQuery] bool random = false)
    {
        return Ok(_gameStore.GetPublishedPacks(random));
    }

    [HttpPost("{packId:guid}/restart")]
    public IActionResult RestartPack(Guid packId)
    {
        var userId = GameStore.GetUserId(User);
        _gameStore.ResetPackProgress(userId, packId);
        return NoContent();
    }
}