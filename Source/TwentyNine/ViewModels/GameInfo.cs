using System;
using TwentyNine.Models;

namespace TwentyNine.ViewModels
{
    public class GameInfo
    {
        public Guid GameId { get; set; }
        public GameState State { get; set; }
        public ScoreCard TeamAScoreCard { get; set; }
        public ScoreCard TeamBScoreCard { get; set; }
        public Player TrumpPlayer { get; set; }
        public SuiteType TrumpSuite { get; set; }
        public GameScoreType ScoreType { get; set; }
        public PlayerTeam WinningTeam { get; set; }
        public int RunningScore { get; set; }
        public PlayerPosition RoomLeaderPosition { get; set; }
        public PlayerPosition RoundHostPosition { get; set; }
        public PlayerPosition BlockingPosition { get; set; }
    }
}