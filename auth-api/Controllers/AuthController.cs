using auth_api.Models;
using auth_api.Models.DTOs;
using auth_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace auth_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ITokenService _tokenService;

    public AuthController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ITokenService tokenService)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
            return BadRequest("Username is taken");

        var user = new ApplicationUser
        {
            UserName = registerDto.Username,
            Email = registerDto.Email
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded) 
            return BadRequest(result.Errors.Select(e => e.Description));

        if (!await _roleManager.RoleExistsAsync("player"))
            await _roleManager.CreateAsync(new IdentityRole("player"));

        await _userManager.AddToRoleAsync(user, "player");

        return new UserDto(
            user.Id,
            user.UserName!,
            user.Email!,
            _tokenService.CreateToken(user, new List<string> { "player" }),
            new List<string> { "player" }
        );
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _userManager.FindByNameAsync(loginDto.Username);

        if (user == null) return Unauthorized("Invalid username");

        var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

        if (!result) return Unauthorized("Invalid password");

        var roles = await _userManager.GetRolesAsync(user);

        return new UserDto(
            user.Id,
            user.UserName!,
            user.Email!,
            _tokenService.CreateToken(user, roles),
            roles
        );
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                  ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null) return Unauthorized();

        var roles = await _userManager.GetRolesAsync(user);

        return new UserDto(
            user.Id,
            user.UserName!,
            user.Email!,
            _tokenService.CreateToken(user, roles),
            roles
        );
    }
}
