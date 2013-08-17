using System.Collections.Generic;

namespace TwentyNine.Models
{
    public class RoundSet
    {
        public GameResult Result { get; set; }
        public TeamPosition RoundHost { get; set; }
        public virtual ICollection<Card> Cards { get; set; }
    }
}