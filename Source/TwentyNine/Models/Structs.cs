namespace TwentyNine.Models
{
    public struct Card
    {
        public SuiteType Suite { get; set; }
        public PointCard PointCard { get; set; }
    }

    public struct ScoreCard
    {
        public bool Positive { get; set; }
        public ScoreCardValue Score { get; set; }
        public ScoreCardMultiplier ScoreCardMultiplier { get; set; }
        public int Coats { get; set; }
    }

    public struct EmoteMessage
    {
        public Emote Emote { get; set; }
        public string Message { get; set; }
    }
}