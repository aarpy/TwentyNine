using System;
using System.Collections.Generic;
using TwentyNine.Models;

namespace TwentyNine.ViewModels
{
    public class GameInfo
    {
        public Guid GameId { get; set; }
        public GameState State { get; set; }
        public string TeamAScore { get; set; }
        public string TeamBScore { get; set; }

        public PlayerPosition TrumpPlayerPosition { get; set; }
        public SuiteType TrumpSuite { get; set; }

        public GameScoreType ScoreType { get; set; }

        public int RunningScore { get; set; }
        public PlayerPosition RoomLeaderPosition { get; set; }
        public PlayerPosition RoundHostPosition { get; set; }
        public PlayerPosition BlockingPosition { get; set; }

        public virtual ICollection<PlayerInfo> Players { get; set; }

        public GameInfo()
        {
            TeamAScore = TeamBScore = "Not strarted scoring";
        }
    }
}