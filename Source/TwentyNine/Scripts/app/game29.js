/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/signalr/signalr.d.ts" />
var Logger = (function () {
    function Logger() {
    }
    Logger.log = function (message) {
        if (typeof window.console !== 'undefined') {
            window.console.log(message);
        }
    };
    return Logger;
})();

var Game29;
(function (Game29) {
    var App = angular.module("game29", ["ngCookies", "ui.bootstrap"]);

    var Game29Ctrl = (function () {
        function Game29Ctrl($scope, $location, $cookies) {
            this.$scope = $scope;
            this.$location = $location;
            this.$cookies = $cookies;
            this._game29 = $.connection.game29;

            this.registerScopeWatches();
            this.registerScopeHandlers();
            this.registerClientCallbacks();
            this.startHub($scope);
        }
        Object.defineProperty(Game29Ctrl.prototype, "me", {
            get: //#region Properties
            function () {
                var value = this.$scope.me;

                if (!value) {
                    var userEmail = this.$cookies.userEmail;
                    var userName = this.$cookies.userName;

                    //if (!userEmail)
                    return null;

                    value = new User();
                    value.Name = userName;
                    value.Email = userEmail;
                }

                return value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Game29Ctrl.prototype, "room", {
            get: function () {
                var value = this.$scope.room;

                if (!value) {
                    var roomName = this.$location.path().replace("/rooms/", "");

                    if (!roomName)
                        return null;

                    value = new Room();
                    value.Name = roomName;

                    this.$scope.room = value;
                }

                return value;
            },
            enumerable: true,
            configurable: true
        });

        //#region Scope init
        Game29Ctrl.prototype.registerScopeWatches = function () {
            var that = this;
            this.$scope.$watch("room.Name", function (value) {
                if (!value)
                    return;
                that.$location.path("/rooms/" + encodeURIComponent(value));
            });
            this.$scope.$watch("me.Email", function (value) {
                if (!value)
                    return;
                that.$cookies.userEmail = value;
            });
            this.$scope.$watch("me.Name", function (value) {
                if (!value)
                    return;
                that.$cookies.userName = value;
            });
        };

        Game29Ctrl.prototype.registerScopeHandlers = function () {
            var that = this;

            this.$scope.closeJoinModal = function () {
                that.$scope.joinModal = !that.$scope.me.Name || !that.$scope.me.Email;
                that.$scope.joinRoomModal = !that.$scope.joinModal && !that.room;

                if (!that.$scope.joinModal) {
                    that.join();
                }

                if (!that.$scope.joinRoomModal) {
                    that.joinRoom();
                }
            };

            this.$scope.closeJoinRoomModal = function () {
                that.$scope.joinRoomModal = !that.$scope.room.Name;

                if (!that.$scope.joinRoomModal) {
                    that.joinRoom();
                }
            };

            this.$scope.leaveRoom = function () {
                that.leaveRoom(this.user);
            };

            this.$scope.leaveTeam = function () {
                Logger.log('leaveTeam called');
            };

            this.$scope.joinModalOptions = {
                backdrop: false,
                backdropClick: false
            };
        };

        Game29Ctrl.prototype.startHub = function ($scope) {
            var that = this;

            $.connection.hub.start({ transport: 'longPolling' }).done(function () {
                if (that.me) {
                    that.join().done(function () {
                        if (that.room) {
                            that.joinRoom();
                        } else {
                            $scope.joinRoomModal = true;
                            $scope.$apply();
                        }
                    });
                } else {
                    $scope.joinModal = true;
                    $scope.$apply();
                }
            });
        };

        //#region Client
        Game29Ctrl.prototype.registerClientCallbacks = function () {
            var _this = this;
            this._game29.client.userJoined = function (user) {
                return _this.userJoined(user);
            };
            this._game29.client.userLeftRoom = function (user) {
                return _this.userLeftRoom(user);
            };
            this._game29.client.trumpOpened = function (suite) {
                //this.$scope.showTrump = true;
                _this.$scope.$apply();
            };
            this._game29.client.exceptionHandler = function (message) {
                window.alert(message);
            };
        };

        Game29Ctrl.prototype.userJoined = function (user) {
            Logger.log("userJoined");
            //if (this.$scope.room.Users) {
            //    var found = false;
            //    this.$scope.room.Users = this.$scope.room.Users.map(function (roomUser) {
            //        if (user.Email === roomUser.Email) {
            //            found = true;
            //            roomUser = user;
            //        }
            //        return roomUser;
            //    });
            //    if (!found)
            //        this.$scope.room.Users.push(user);
            //    this.$scope.$apply();
            //}
        };

        Game29Ctrl.prototype.userLeftRoom = function (user) {
            Logger.log("userLeftRoom called");
            //var found = false;
            //if (user.Email === this.$scope.me.Email) {
            //    this.$scope.room = null;
            //    this.$location.path("");
            //    this.$scope.joinRoomModal = true;
            //} else {
            //    this.$scope.room.Users = this.$scope.room.Users.filter(function (roomUser) {
            //        return user.Email !== roomUser.Email;
            //    });
            //    this.$scope.room.Cards = this.$scope.room.Cards.filter(function (roomCard) {
            //        return user.Email !== roomCard.User.Email;
            //    });
            //}
            //this.$scope.$apply();
        };

        //#endregion
        //#region Server
        Game29Ctrl.prototype.join = function (user) {
            if (typeof user === "undefined") { user = this.me; }
            var that = this;
            return this._game29.server.join(user).done(function (data) {
                that.$scope.me = data;
                that.$scope.$apply();
            });
        };

        Game29Ctrl.prototype.joinRoom = function (room) {
            if (typeof room === "undefined") { room = this.room; }
            this.$location.path("/rooms/" + encodeURIComponent(room.Name));

            var that = this;
            return this._game29.server.joinRoom(room).done(function (data) {
                that.$scope.room = data;

                that.$scope.$apply();
            });
        };

        Game29Ctrl.prototype.leaveRoom = function (user) {
            if (typeof user === "undefined") { user = this.me; }
            return null;
        };

        Game29Ctrl.prototype.resetRoom = function () {
            return null;
        };

        Game29Ctrl.prototype.showAllCards = function (show) {
            if (typeof show === "undefined") { show = true; }
            return null;
        };

        Game29Ctrl.prototype.changeRoomTopic = function (topic) {
            return null;
        };

        Game29Ctrl.prototype.changedMyCardValue = function (value) {
            return null;
        };
        Game29Ctrl.$inject = ['$scope', '$location', '$cookies'];
        return Game29Ctrl;
    })();
    Game29.Game29Ctrl = Game29Ctrl;

    // setup controller
    App.controller("Game29Ctrl", Game29Ctrl);

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
//# sourceMappingURL=game29.js.map
