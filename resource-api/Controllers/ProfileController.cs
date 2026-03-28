using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using resource_api.Services;

namespace resource_api.Controllers;

[ApiController]
[Authorize]
[Route("profile")]
public class ProfileController(GameStore gameStore) : ControllerBase
{
    [HttpGet("progress")]
    public IActionResult GetProgress()
    {
        var userId = GameStore.GetUserId(User);
        return Ok(gameStore.GetProgress(userId));
    }
}
