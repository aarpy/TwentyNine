module Game29 {
    export class PlayerInfo {
        public Id: string;
        public Name: string;
        public Email: string;
        public Position: PlayerPosition;
    }

    export class RoomInfo {
        public Id: string;
        public Name: string;
        public State: RoomState;
        public Watchers: PlayerInfo[];
    }

    export class GameInfo {
        public GameId: string;
        public State: GameState;

        public TeamAScore: string;
        public TeamBScore: string;

        public TrumpPlayerPosition: PlayerPosition;
        public TrumpSuite: SuiteType;

        public ScoreType: GameScoreType;
        public Result: PlayerTeam;

        public RunningScore: number;

        public RoomLeaderPosition: PlayerPosition;
        public RoundHostPosition: PlayerPosition;
        public BlockingPosition: PlayerPosition;

        public Players: PlayerInfo[];
    }

    export class RoundSetInfo {
        public Result: PlayerTeam;
        public RoundHost: PlayerPosition;
        public Cards: Card[];
    }

    export class Card {
        public Suite: SuiteType;
        public PointCard: PointCard;
    }

    export class ChatMessage {
        public PlayerId: string;
        public PlayerName: string;
        public Message: string;
    }

    export class CardPlayed {
        public Card: Card;
        public PlayerPosition: PlayerPosition;
        public BlockingPosition: PlayerPosition;

        public GameState: GameState;

        public RoundScore: number;
        public RoundWinner: PlayerPosition;

        public RunningScore: number;
        public GameWinner: PlayerTeam;
    }

    export enum PlayerTeam {
        Unknown,
        TeamA,
        TeamB
    }

    export enum GameScoreType {
        Normal,
        Double,
        Redouble
    }

    export enum RoomState {
        New,
        WaitingForPlayers,
        ReadyForGame,
        PlayingGame,
        Closed,
        Abandoned
    }

    export enum GameState {
        New,
        BiddingTrump,
        SettingTrump,
        OfferDoublePoints,
        OfferRedoublePoints,
        StartRound,
        ContinueRound,
        RoundCompleted,
        GameCompleted,
        Cancelled
    }

    export enum PlayerPosition {
        Watcher,
        A1,
        B1,
        A2,
        B2
    }

    export enum SuiteType {
        Spade,
        Heart,
        Diamond,
        Club
    }

    export enum PointCard {
        Jack,
        Nine,
        Ace,
        Ten,
        King,
        Queen,
        Eight,
        Seven
    }
}