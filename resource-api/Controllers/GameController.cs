using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using resource_api.Models;
using resource_api.Services;

namespace resource_api.Controllers;

[ApiController]
[Authorize]
[Route("game")]
public class GameController(GameStore gameStore) : ControllerBase
{
    [HttpPost("submit")]
    public IActionResult SubmitGuess([FromBody] SubmitGuessRequest request)
    {
        var userId = GameStore.GetUserId(User);
        return Ok(gameStore.SubmitGuess(userId, request));
    }
}
