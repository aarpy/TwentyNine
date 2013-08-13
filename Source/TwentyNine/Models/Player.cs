using System;

namespace TwentyNine.Models
{
    public class Player
    {
        public virtual Game Game { get; set; }
        public virtual User User { get; set; }

        public TeamPosition TeamPosition { get; set; }
        public bool IsRoomHost { get; set; }
        public bool IsRoundHost { get; set; }
        public bool IsBlocking { get; set; }

        public DateTime Joined { get; set; }
        public DateTime? Disconnected { get; set; }
    }
}