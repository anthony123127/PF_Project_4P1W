using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using resource_api.Models;
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

    [HttpGet]
    [Authorize(Roles = "admin")]
    public IActionResult GetPuzzles([FromQuery] Guid? packId = null)
    {
        return Ok(_gameStore.GetAllPuzzles(packId));
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public IActionResult UpsertPuzzle([FromBody] UpsertPuzzleRequest request)
    {
        var id = request.Id ?? Guid.NewGuid();
        var puzzle = new PuzzleDefinition(
            id, 
            request.PackId, 
            request.Answer, 
            request.Hint, 
            request.Difficulty, 
            request.ImageIds, 
            request.AcceptedVariants);
        _gameStore.UpsertPuzzle(puzzle);
        return Ok(puzzle);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "admin")]
    public IActionResult DeletePuzzle(Guid id)
    {
        _gameStore.DeletePuzzle(id);
        return NoContent();
    }
}