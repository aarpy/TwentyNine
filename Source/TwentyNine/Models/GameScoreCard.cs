namespace TwentyNine.Models
{
    public class GameScoreCard
    {
        public bool Positive { get; set; }
        public MainScoreCard MainScore { get; set; }
        public MultiplierCard Multiplier { get; set; }
        public int Coats { get; set; }
    }
}