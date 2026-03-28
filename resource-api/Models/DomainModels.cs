namespace resource_api.Models;

public record ImageAsset(
    Guid Id,
    string Url,
    string Title,
    IReadOnlyList<string> Tags);

public record PuzzleDefinition(
    Guid Id,
    Guid PackId,
    string Answer,
    string Hint,
    string Difficulty,
    IReadOnlyList<Guid> ImageIds,
    IReadOnlyList<string> AcceptedVariants);

public record PackDefinition(
    Guid Id,
    string Name,
    string Description,
    bool Published,
    int DisplayOrder);

public sealed class PlayerProgress
{
    public HashSet<Guid> SolvedPuzzleIds { get; } = [];
    public int Attempts { get; set; }
    public int Score { get; set; }
    public List<RecentPuzzleEntry> RecentPuzzles { get; } = [];
}

public record RecentPuzzleEntry(
    Guid PuzzleId,
    string Answer,
    bool Correct,
    DateTimeOffset PlayedAt);
