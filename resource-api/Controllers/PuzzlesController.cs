using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using resource_api.Services;

namespace resource_api.Controllers;

[ApiController]
[Authorize]
[Route("puzzles")]
public class PuzzlesController(GameStore gameStore) : ControllerBase
{
    [HttpGet("next")]
    public IActionResult GetNextPuzzle([FromQuery] Guid packId)
    {
        var userId = GameStore.GetUserId(User);
        return Ok(gameStore.GetNextPuzzle(userId, packId));
    }
}
