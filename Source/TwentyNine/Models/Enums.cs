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

    public enum GameResult
    {
        Incomplete,
        TeamA,
        TeamB
    }

    public enum TeamPosition
    {
        Watcher,
        TeamA1,
        TeamB1,
        TeamA2,
        TeamB2
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

    public enum ScoreCard
    {
        Six,
        Five,
        Four,
        Three,
        Two,
    }

    public enum PointCardValue
    {
        Jack = 3,
        Nine = 2,
        Ace = 1,
        Ten = 1,
        King = 0,
        Queen = 0,
        Eight = 0,
        Seven = 0
    }
}