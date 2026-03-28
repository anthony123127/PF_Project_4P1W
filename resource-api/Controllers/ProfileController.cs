using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using resource_api.Services;

namespace resource_api.Controllers;

[ApiController]
[Authorize]
[Route("profile")]
public class ProfileController : ControllerBase
{
    private readonly GameStore _gameStore;

    public ProfileController(GameStore gameStore) => _gameStore = gameStore;

    [HttpGet("progress")]
    public IActionResult GetProgress()
    {
        var userId = GameStore.GetUserId(User);
        return Ok(_gameStore.GetProgress(userId));
    }
}