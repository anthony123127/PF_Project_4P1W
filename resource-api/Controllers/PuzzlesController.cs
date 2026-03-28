using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using resource_api.Services;

namespace resource_api.Controllers;

[ApiController]
[Authorize]
[Route("puzzles")]
public class PuzzlesController : ControllerBase
{
    private readonly GameStore _gameStore;

    public PuzzlesController(GameStore gameStore)
    {
        _gameStore = gameStore;
    }

    [HttpGet("next")]
    public IActionResult GetNextPuzzle([FromQuery] Guid packId)
    {
        try
        {
            var userId = GameStore.GetUserId(User);
            var puzzle = _gameStore.GetNextPuzzle(userId, packId);
            return Ok(puzzle);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }
}