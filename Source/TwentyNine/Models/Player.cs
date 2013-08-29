using System;
using System.Collections.Generic;

namespace TwentyNine.Models
{
    public class Player
    {
        public string Id { get; set; }
        public virtual User User { get; set; }

        public virtual Room Room { get; set; }
        public PlayerPosition Position { get; set; }
        public virtual ICollection<Card> Cards { get; set; }

        public DateTime Joined { get; set; }
        public DateTime? Disconnected { get; set; }
    }
}