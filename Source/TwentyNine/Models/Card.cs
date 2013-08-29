namespace TwentyNine.Models
{
    public class Card
    {
        public SuiteType Suite { get; set; }
        public PointCard PointCard { get; set; }

        public override int GetHashCode()
        {
            var hash = (int) Suite*100 + (int) PointCard;
            return hash.GetHashCode();
        }

        public override bool Equals(object obj)
        {
            var other = obj as Card;
            return other != null && (other.Suite == Suite && other.PointCard == PointCard);
        }
    }
}