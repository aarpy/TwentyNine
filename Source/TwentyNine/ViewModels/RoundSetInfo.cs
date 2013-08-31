using System.Collections.Generic;
using TwentyNine.Models;

namespace TwentyNine.ViewModels
{
    public class RoundSetInfo
    {
        public PlayerPosition RoundHost { get; set; }
        public virtual ICollection<Card> Cards { get; set; }
        public PlayerPosition RoundWinner { get; set; }
    }
}