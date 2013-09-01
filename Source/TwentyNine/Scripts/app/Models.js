var Game29;
(function (Game29) {
    var PlayerInfo = (function () {
        function PlayerInfo() {
        }
        return PlayerInfo;
    })();
    Game29.PlayerInfo = PlayerInfo;

    var RoomInfo = (function () {
        function RoomInfo() {
        }
        return RoomInfo;
    })();
    Game29.RoomInfo = RoomInfo;

    var GameInfo = (function () {
        function GameInfo() {
        }
        return GameInfo;
    })();
    Game29.GameInfo = GameInfo;

    var RoundSetInfo = (function () {
        function RoundSetInfo() {
        }
        return RoundSetInfo;
    })();
    Game29.RoundSetInfo = RoundSetInfo;

    var Card = (function () {
        function Card() {
        }
        return Card;
    })();
    Game29.Card = Card;

    var EmoteMessage = (function () {
        function EmoteMessage() {
        }
        return EmoteMessage;
    })();
    Game29.EmoteMessage = EmoteMessage;

    var CardPlayed = (function () {
        function CardPlayed() {
        }
        return CardPlayed;
    })();
    Game29.CardPlayed = CardPlayed;

    (function (PlayerTeam) {
        PlayerTeam[PlayerTeam["Unknown"] = 0] = "Unknown";
        PlayerTeam[PlayerTeam["TeamA"] = 1] = "TeamA";
        PlayerTeam[PlayerTeam["TeamB"] = 2] = "TeamB";
    })(Game29.PlayerTeam || (Game29.PlayerTeam = {}));
    var PlayerTeam = Game29.PlayerTeam;

    (function (GameScoreType) {
        GameScoreType[GameScoreType["Normal"] = 0] = "Normal";
        GameScoreType[GameScoreType["Double"] = 1] = "Double";
        GameScoreType[GameScoreType["Redouble"] = 2] = "Redouble";
    })(Game29.GameScoreType || (Game29.GameScoreType = {}));
    var GameScoreType = Game29.GameScoreType;

    (function (RoomState) {
        RoomState[RoomState["New"] = 0] = "New";
        RoomState[RoomState["WaitingForPlayers"] = 1] = "WaitingForPlayers";
        RoomState[RoomState["ReadyForGame"] = 2] = "ReadyForGame";
        RoomState[RoomState["PlayingGame"] = 3] = "PlayingGame";
        RoomState[RoomState["Closed"] = 4] = "Closed";
        RoomState[RoomState["Abandoned"] = 5] = "Abandoned";
    })(Game29.RoomState || (Game29.RoomState = {}));
    var RoomState = Game29.RoomState;

    (function (GameState) {
        GameState[GameState["New"] = 0] = "New";
        GameState[GameState["BiddingTrump"] = 1] = "BiddingTrump";
        GameState[GameState["SettingTrump"] = 2] = "SettingTrump";
        GameState[GameState["OfferDoublePoints"] = 3] = "OfferDoublePoints";
        GameState[GameState["OfferRedoublePoints"] = 4] = "OfferRedoublePoints";
        GameState[GameState["StartRound"] = 5] = "StartRound";
        GameState[GameState["ContinueRound"] = 6] = "ContinueRound";
        GameState[GameState["RoundCompleted"] = 7] = "RoundCompleted";
        GameState[GameState["GameCompleted"] = 8] = "GameCompleted";
        GameState[GameState["Cancelled"] = 9] = "Cancelled";
    })(Game29.GameState || (Game29.GameState = {}));
    var GameState = Game29.GameState;

    (function (PlayerPosition) {
        PlayerPosition[PlayerPosition["Watcher"] = 0] = "Watcher";
        PlayerPosition[PlayerPosition["A1"] = 1] = "A1";
        PlayerPosition[PlayerPosition["B1"] = 2] = "B1";
        PlayerPosition[PlayerPosition["A2"] = 3] = "A2";
        PlayerPosition[PlayerPosition["B2"] = 4] = "B2";
    })(Game29.PlayerPosition || (Game29.PlayerPosition = {}));
    var PlayerPosition = Game29.PlayerPosition;

    (function (SuiteType) {
        SuiteType[SuiteType["Spade"] = 0] = "Spade";
        SuiteType[SuiteType["Heart"] = 1] = "Heart";
        SuiteType[SuiteType["Diamond"] = 2] = "Diamond";
        SuiteType[SuiteType["Club"] = 3] = "Club";
    })(Game29.SuiteType || (Game29.SuiteType = {}));
    var SuiteType = Game29.SuiteType;

    (function (PointCard) {
        PointCard[PointCard["Jack"] = 0] = "Jack";
        PointCard[PointCard["Nine"] = 1] = "Nine";
        PointCard[PointCard["Ace"] = 2] = "Ace";
        PointCard[PointCard["Ten"] = 3] = "Ten";
        PointCard[PointCard["King"] = 4] = "King";
        PointCard[PointCard["Queen"] = 5] = "Queen";
        PointCard[PointCard["Eight"] = 6] = "Eight";
        PointCard[PointCard["Seven"] = 7] = "Seven";
    })(Game29.PointCard || (Game29.PointCard = {}));
    var PointCard = Game29.PointCard;

    (function (Emote) {
        Emote[Emote["Normal"] = 0] = "Normal";
        Emote[Emote["Cheers"] = 1] = "Cheers";
        Emote[Emote["Congrats"] = 2] = "Congrats";
    })(Game29.Emote || (Game29.Emote = {}));
    var Emote = Game29.Emote;
})(Game29 || (Game29 = {}));
//# sourceMappingURL=models.js.map
