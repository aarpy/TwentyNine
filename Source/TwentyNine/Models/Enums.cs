using TwentyNine.Hubs;

namespace TwentyNine.Models
{

    #region Room

    public enum RoomState
    {
        New,
        WaitingForPlayers,
        ReadyForGame,
        PlayingGame,
        Closed,
        Abandoned
    }

    public enum Emote
    {
        Normal,
        Cheers,
        Congrats
    }

    #endregion

    #region Game

    public enum GameScoreType
    {
        Normal,
        Double,
        Redouble
    }

    public enum GameState
    {
        New,
        MixingCards,
        DistributingCards1,
        BiddingTrump,
        SettingTrump,
        OfferDoublePoints,
        OfferRedoublePoints,
        DistributingCards2,
        TrickPlay,
        UpdatingScore,
        Completed,
        Cancelled
    }

    public enum PlayerTeam
    {
        Unknown,
        TeamA,
        TeamB
    }

    public enum PlayerPosition
    {
        Watcher,
        A1,
        B1,
        A2,
        B2
    }

    public enum GamePlayerState
    {
        WaitingOnPlayerA1,
        WaitingOnPlayerB1,
        WaitingOnPlayerA2,
        WaitingOnPlayerB2,
    }

    #endregion

    public enum SuiteType
    {
        Spade,
        Heart,
        Diamond,
        Club
    }

    public enum PointCard
    {
        Jack,
        Nine,
        Ace,
        Ten,
        King,
        Queen,
        Eight,
        Seven
    }

    public enum MainScoreCard
    {
        Zero,
        One,
        Two,
        Three,
        Four,
        Five,
        Six
    }

    public enum MultiplierCard
    {
        Six,
        Five,
        Four,
        Three,
        Two
    }
    public static class EnumExtensions
    {
        public static PlayerTeam Team(this PlayerPosition position)
        {
            switch (position)
            {
                case PlayerPosition.A1:
                case PlayerPosition.A2:
                    return PlayerTeam.TeamA;
                case PlayerPosition.B1:
                case PlayerPosition.B2:
                    return PlayerTeam.TeamB;
                default:
                    return PlayerTeam.Unknown;
            }
        }

        public static PlayerPosition NextPosition(this PlayerPosition position)
        {
            if (position == PlayerPosition.Watcher)
                throw new Game29Exception("Not a player position");

            if (position == PlayerPosition.B2)
            {
                position = PlayerPosition.A1;
            }
            else
            {
                position++;
            }
            return position;
        }

        public static PlayerPosition GetRelativePosition(this PlayerPosition startPosition, int count)
        {
            var roundPos = startPosition;
            for (var i = 0; i < count; i++)
            {
                roundPos = roundPos.NextPosition();
            }
            return roundPos;
        }

        public static int Value(this PointCard pointCard)
        {
            switch (pointCard)
            {
                case PointCard.Jack:
                    return 3;
                case PointCard.Nine:
                    return 2;
                case PointCard.Ace:
                case PointCard.Ten:
                    return 1;
                default:
                    return 0;
            }
        }

        public static int Order(this PointCard pointCard)
        {
            switch (pointCard)
            {
                case PointCard.Jack:
                    return 8;
                case PointCard.Nine:
                    return 7;
                case PointCard.Ace:
                    return 6;
                case PointCard.Ten:
                    return 5;
                case PointCard.King:
                    return 4;
                case PointCard.Queen:
                    return 3;
                case PointCard.Eight:
                    return 2;
                case PointCard.Seven:
                    return 1;
                default:
                    return 0;
            }
        }
    }
}