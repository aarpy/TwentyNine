using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace TwentyNine.Models
{
    public class RoundSet
    {
        public PlayerPosition RoundHost { get; set; }
        public virtual ICollection<Card> Cards { get; set; }
        public PlayerPosition RoundWinner { get; private set; }

        public int RoundScore
        {
            get { return Cards.Sum(card => card.PointCard.Value()); }
        }

        public void UpdateWinner(SuiteType? trump)
        {
            var cards = (Collection<Card>) Cards;

            var winningCard = cards.First();
            for (var i = 1; i < 4; i++)
            {
                winningCard = GetWinningCard(trump, winningCard, cards[i]);
            }

            var winningPos = cards.IndexOf(winningCard);
            RoundWinner = RoundHost.GetRelativePosition(winningPos);
        }

        private static Card GetWinningCard(SuiteType? trump, Card winningCard, Card otherCard)
        {
            if (!trump.HasValue || (winningCard.Suite != trump.Value && otherCard.Suite != trump.Value))
            {
                if (winningCard.Suite == otherCard.Suite && winningCard.PointCard.Order() < otherCard.PointCard.Order())
                {
                    winningCard = otherCard;
                }
            }
            else if (winningCard.Suite == trump.Value && otherCard.Suite == trump.Value)
            {
                if (winningCard.PointCard.Order() < otherCard.PointCard.Order())
                {
                    winningCard = otherCard;
                }
            }
            else if (otherCard.Suite == trump.Value)
            {
                winningCard = otherCard;
            }
            return winningCard;
        }
    }
}