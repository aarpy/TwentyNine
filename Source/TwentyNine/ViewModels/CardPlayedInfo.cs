using TwentyNine.Models;

namespace TwentyNine.ViewModels
{
    public class CardPlayedInfo
    {
        public Card Card { get; set; }
        public PlayerPosition PlayerPosition { get; set; }
        public PlayerPosition BlockingPosition { get; set; }

        public GameState GameState { get; set; }

        public int RoundScore { get; set; }
        public PlayerPosition RounderWinner { get; set; }

        public int RunningScore { get; set; }
        public PlayerTeam GameWinner { get; set; }
    }
}