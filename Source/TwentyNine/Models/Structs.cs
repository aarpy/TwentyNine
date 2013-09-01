namespace TwentyNine.Models
{
    public struct Card
    {
        public SuiteType Suite { get; set; }
        public PointCard PointCard { get; set; }
    }

    public struct ScoreCard
    {
        // Possible values: 0, 1, 2, 3, 4, 5, 6 and then incrment multiplier (positive or negative) 
        public int Score { get; set; }
        // Possible values: 6, 5, 4, 3, 2 and then increment coat (positive or negative) 
        public int Multiplier { get; set; }
        public int Coats { get; set; }
    }

    public struct EmoteMessage
    {
        public Emote Emote { get; set; }
        public string Message { get; set; }
    }
}