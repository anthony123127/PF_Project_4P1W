namespace auth_api.Models.DTOs;

public record RegisterDto(string Username, string Email, string Password);
public record LoginDto(string Username, string Password);
public record UserDto(string Id, string Username, string Email, string Token, IList<string> Roles);
