using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using resource_api.Models;
using resource_api.Services;

namespace resource_api.Controllers;

[ApiController]
[Authorize]
[Route("game")]
public class GameController : ControllerBase
{
    private readonly GameStore _gameStore;

    public GameController(GameStore gameStore)
    {
        _gameStore = gameStore;
    }

    [HttpPost("submit")]
    public IActionResult SubmitGuess([FromBody] SubmitGuessRequest request)
    {
        try
        {
            var userId = GameStore.GetUserId(User);
            var result = _gameStore.SubmitGuess(userId, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }
}