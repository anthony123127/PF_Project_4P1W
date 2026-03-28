namespace resource_api.Models;

public record PackSummaryDto(
    Guid Id,
    string Name,
    string Description,
    int PuzzleCount,
    IReadOnlyList<string> Difficulties);

public record NextPuzzleDto(
    Guid PackId,
    Guid? PuzzleId,
    IReadOnlyList<string> ImageUrls,
    string? Hint,
    string? Difficulty,
    int RemainingCount,
    bool PackCompleted);

public record SubmitGuessRequest(Guid PuzzleId, string Guess);

public record SubmitGuessResponse(
    bool Correct,
    int ScoreDelta,
    bool NextAvailable,
    string NormalizedGuess);

public record ProgressSummaryDto(
    int Solved,
    int Attempts,
    int Score,
    IReadOnlyList<RecentPuzzleDto> RecentPuzzles);

public record RecentPuzzleDto(
    Guid PuzzleId,
    string Answer,
    bool Correct,
    DateTimeOffset PlayedAt);
