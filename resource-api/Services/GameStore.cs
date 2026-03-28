using System.Security.Claims;
using resource_api.Models;

namespace resource_api.Services;

public sealed class GameStore
{
    private readonly object _syncRoot = new();
    private readonly List<PackDefinition> _packs;
    private readonly List<PuzzleDefinition> _puzzles;
    private readonly List<ImageAsset> _images;
    private readonly Dictionary<string, PlayerProgress> _progressByUser = new();

    public GameStore()
    {
        _images =
        [
            new(Guid.Parse("10000000-0000-0000-0000-000000000001"), "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80", "Puppy", ["animal", "pet"]),
            new(Guid.Parse("10000000-0000-0000-0000-000000000002"), "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=600&q=80", "Paw print", ["animal", "pet"]),
            new(Guid.Parse("10000000-0000-0000-0000-000000000003"), "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80", "Dog house", ["animal", "home"]),
            new(Guid.Parse("10000000-0000-0000-0000-000000000004"), "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=600&q=80", "Collar", ["animal", "pet"]),
            new(Guid.Parse("10000000-0000-0000-0000-000000000005"), "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=600&q=80", "Sunny beach", ["nature", "travel"]),
            new(Guid.Parse("10000000-0000-0000-0000-000000000006"), "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", "Waves", ["nature", "water"]),
            new(Guid.Parse("10000000-0000-0000-0000-000000000007"), "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=600&q=80", "Surfboard", ["sport", "travel"]),
            new(Guid.Parse("10000000-0000-0000-0000-000000000008"), "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80", "Palm tree", ["nature", "travel"]),
            new(Guid.Parse("10000000-0000-0000-0000-000000000009"), "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80", "Burger", ["food"]),
            new(Guid.Parse("10000000-0000-0000-0000-000000000010"), "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80", "French fries", ["food"]),
            new(Guid.Parse("10000000-0000-0000-0000-000000000011"), "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80", "Takeout tray", ["food"]),
            new(Guid.Parse("10000000-0000-0000-0000-000000000012"), "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=600&q=80", "Ketchup", ["food"]),
            new(Guid.Parse("10000000-0000-0000-0000-000000000013"), "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80", "Bookshelf", ["school", "study"]),
            new(Guid.Parse("10000000-0000-0000-0000-000000000014"), "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80", "Notebook", ["school", "study"]),
            new(Guid.Parse("10000000-0000-0000-0000-000000000015"), "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80", "Laptop", ["school", "study"]),
            new(Guid.Parse("10000000-0000-0000-0000-000000000016"), "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80", "Reading desk", ["school", "study"])
        ];

        _packs =
        [
            new(Guid.Parse("20000000-0000-0000-0000-000000000001"), "Everyday Icons", "Warm-up puzzles built from common objects and places.", true, 1),
            new(Guid.Parse("20000000-0000-0000-0000-000000000002"), "Snack Attack", "Published food pack with straightforward answers.", true, 2),
            new(Guid.Parse("20000000-0000-0000-0000-000000000003"), "Study Session", "Draft-only examples for upcoming CMS work.", false, 3)
        ];

        _puzzles =
        [
            new(Guid.Parse("30000000-0000-0000-0000-000000000001"), _packs[0].Id, "dog", "Man's best friend.", "easy",
                [_images[0].Id, _images[1].Id, _images[2].Id, _images[3].Id], ["dog"]),
            new(Guid.Parse("30000000-0000-0000-0000-000000000002"), _packs[0].Id, "beach", "Sand, waves, and sun.", "easy",
                [_images[4].Id, _images[5].Id, _images[6].Id, _images[7].Id], ["beach", "sea shore", "seashore"]),
            new(Guid.Parse("30000000-0000-0000-0000-000000000003"), _packs[1].Id, "burger", "Fast-food favorite.", "easy",
                [_images[8].Id, _images[9].Id, _images[10].Id, _images[11].Id], ["burger", "hamburger"]),
            new(Guid.Parse("30000000-0000-0000-0000-000000000004"), _packs[2].Id, "study", "Learning mode activated.", "medium",
                [_images[12].Id, _images[13].Id, _images[14].Id, _images[15].Id], ["study", "studying"])
        ];
    }

    public IReadOnlyList<PackSummaryDto> GetPublishedPacks(bool randomize)
    {
        var packs = _packs
            .Where(pack => pack.Published)
            .Select(pack => new PackSummaryDto(
                pack.Id,
                pack.Name,
                pack.Description,
                _puzzles.Count(puzzle => puzzle.PackId == pack.Id),
                _puzzles.Where(puzzle => puzzle.PackId == pack.Id).Select(puzzle => puzzle.Difficulty).Distinct().Order().ToArray()))
            .ToList();

        if (randomize)
        {
            return packs.OrderBy(_ => Random.Shared.Next()).ToArray();
        }

        return packs.OrderBy(pack => _packs.First(def => def.Id == pack.Id).DisplayOrder).ToArray();
    }

    public NextPuzzleDto GetNextPuzzle(string userId, Guid packId)
    {
        var pack = _packs.FirstOrDefault(candidate => candidate.Id == packId && candidate.Published);
        if (pack is null)
        {
            throw new KeyNotFoundException("Pack not found.");
        }

        lock (_syncRoot)
        {
            var progress = GetOrCreateProgress(userId);
            var packPuzzles = _puzzles.Where(p => p.PackId == packId).ToList();
            var remaining = packPuzzles.Where(p => !progress.SolvedPuzzleIds.Contains(p.Id)).ToList();

            if (remaining.Count == 0)
            {
                return new NextPuzzleDto(packId, null, [], null, null, 0, true);
            }

            var puzzle = remaining.OrderBy(_ => Random.Shared.Next()).First();
            return MapPuzzle(packPuzzles, remaining, puzzle);
        }
    }

    public SubmitGuessResponse SubmitGuess(string userId, SubmitGuessRequest request)
    {
        var puzzle = _puzzles.FirstOrDefault(candidate => candidate.Id == request.PuzzleId)
            ?? throw new KeyNotFoundException("Puzzle not found.");

        lock (_syncRoot)
        {
            var progress = GetOrCreateProgress(userId);
            progress.Attempts++;

            var normalizedGuess = Normalize(request.Guess);
            var accepted = puzzle.AcceptedVariants.Select(Normalize).Append(Normalize(puzzle.Answer)).Distinct();
            var isCorrect = accepted.Contains(normalizedGuess);
            var scoreDelta = isCorrect ? ScoreForDifficulty(puzzle.Difficulty) : -1;

            progress.Score += scoreDelta;

            if (isCorrect)
            {
                progress.SolvedPuzzleIds.Add(puzzle.Id);
            }

            progress.RecentPuzzles.Insert(0, new RecentPuzzleEntry(puzzle.Id, puzzle.Answer, isCorrect, DateTimeOffset.UtcNow));
            if (progress.RecentPuzzles.Count > 8)
            {
                progress.RecentPuzzles.RemoveAt(progress.RecentPuzzles.Count - 1);
            }

            var nextAvailable = _puzzles.Any(candidate =>
                candidate.PackId == puzzle.PackId &&
                !progress.SolvedPuzzleIds.Contains(candidate.Id));

            return new SubmitGuessResponse(isCorrect, scoreDelta, nextAvailable, normalizedGuess);
        }
    }

    public ProgressSummaryDto GetProgress(string userId)
    {
        lock (_syncRoot)
        {
            var progress = GetOrCreateProgress(userId);
            return new ProgressSummaryDto(
                progress.SolvedPuzzleIds.Count,
                progress.Attempts,
                progress.Score,
                progress.RecentPuzzles
                    .Select(entry => new RecentPuzzleDto(entry.PuzzleId, entry.Answer, entry.Correct, entry.PlayedAt))
                    .ToArray());
        }
    }

    public void ResetPackProgress(string userId, Guid packId)
    {
        lock (_syncRoot)
        {
            var progress = GetOrCreateProgress(userId);
            var packPuzzleIds = _puzzles.Where(puzzle => puzzle.PackId == packId).Select(puzzle => puzzle.Id).ToHashSet();
            progress.SolvedPuzzleIds.RemoveWhere(packPuzzleIds.Contains);
        }
    }

    public static string GetUserId(ClaimsPrincipal user)
    {
        return user.FindFirstValue("sub")
            ?? user.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? user.FindFirstValue("nameid")
            ?? throw new UnauthorizedAccessException("Missing subject claim.");
    }

    private NextPuzzleDto MapPuzzle(List<PuzzleDefinition> packPuzzles, List<PuzzleDefinition> remaining, PuzzleDefinition puzzle)
    {
        var imageUrls = puzzle.ImageIds
            .Select(imageId => _images.First(image => image.Id == imageId).Url)
            .ToArray();

        return new NextPuzzleDto(
            puzzle.PackId,
            puzzle.Id,
            imageUrls,
            puzzle.Hint,
            puzzle.Difficulty,
            Math.Max(remaining.Count - 1, 0),
            false);
    }

    private PlayerProgress GetOrCreateProgress(string userId)
    {
        if (!_progressByUser.TryGetValue(userId, out var progress))
        {
            progress = new PlayerProgress();
            _progressByUser[userId] = progress;
        }

        return progress;
    }

    private static int ScoreForDifficulty(string difficulty) => difficulty.ToLowerInvariant() switch
    {
        "hard" => 15,
        "medium" => 10,
        _ => 5
    };

    private static string Normalize(string value)
    {
        return new string(
            value.Trim().ToLowerInvariant()
                .Where(character => !char.IsWhiteSpace(character) && character != '-' && character != '_')
                .ToArray());
    }
}
