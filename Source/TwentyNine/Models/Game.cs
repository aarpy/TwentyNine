﻿using System;
using System.Collections.Generic;

namespace TwentyNine.Models
{
    public class Game
    {
        public Guid Id { get; set; }
        public GameState State { get; set; }
        public GameScoreType ScoreType { get; set; }
        public GameResult Result { get; set; }

        public TeamPosition HostPosition { get; set; }
        public TeamPosition BlockingPosition { get; set; }

        public virtual ICollection<Player> Players { get; set; }
        public virtual ICollection<RoundSet> PlayedRounds { get; set; }

        public TeamPosition RoomLeaderPosition { get; set; }

        public DateTime Created { get; set; }
        public DateTime Modified { get; set; }
    }
}