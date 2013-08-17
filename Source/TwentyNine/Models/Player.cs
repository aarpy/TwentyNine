using System;
using System.Collections.Generic;

namespace TwentyNine.Models
{
    public class Player
    {
        public virtual User User { get; set; }

        public TeamPosition TeamPosition { get; set; }
        public virtual ICollection<Card> Cards { get; set; }

        public DateTime Joined { get; set; }
        public DateTime? Disconnected { get; set; }
    }
}