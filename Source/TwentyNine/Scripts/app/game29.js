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
            var that = this;

            this.registerScopeWatches();
            this.registerScopeHandlers(that);
            this.registerClientCallbacks();
            this.startHub($scope, that);
        }
        Object.defineProperty(Game29Ctrl.prototype, "me", {
            get: //#region Properties
            function () {
                var value = this.$scope.me;

                if (!value) {
                    var userEmail = this.$cookies.userEmail;
                    var userName = this.$cookies.userName;

                    if (!userEmail)
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
            this.$scope.$watch("room.Name", function (value) {
                if (!value)
                    return;
                this.$location.path("/rooms/" + encodeURIComponent(value));
            });
            this.$scope.$watch("me.Email", function (value) {
                if (!value)
                    return;
                this.$cookies.userEmail = value;
            });
            this.$scope.$watch("me.Name", function (value) {
                if (!value)
                    return;
                this.$cookies.userName = value;
            });
        };

        Game29Ctrl.prototype.registerScopeHandlers = function (ctrl) {
            this.$scope.closeJoinModal = function () {
                this.$scope.joinModal = !this.$scope.me.Name || !this.$scope.me.Email;
                this.$scope.joinRoomModal = !this.$scope.joinModal && !ctrl.room;

                if (!this.$scope.joinModal) {
                    ctrl.join();
                }

                if (!this.$scope.joinRoomModal) {
                    ctrl.joinRoom();
                }
            };

            this.$scope.closeJoinRoomModal = function () {
                this.$scope.joinRoomModal = !this.$scope.room.Name;

                if (!this.$scope.joinRoomModal) {
                    ctrl.joinRoom();
                }
            };

            this.$scope.leaveRoom = function () {
                ctrl.leaveRoom(this.user);
            };

            this.$scope.leaveTeam = function () {
                Logger.log('leaveTeam called');
            };

            this.$scope.joinModalOptions = {
                backdrop: false,
                backdropClick: false
            };
        };

        Game29Ctrl.prototype.startHub = function ($scope, that) {
            $.connection.hub.start().done(function () {
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

    var User = (function () {
        function User() {
        }
        return User;
    })();
    Game29.User = User;

    var Room = (function () {
        function Room() {
        }
        return Room;
    })();
    Game29.Room = Room;

    var Game = (function () {
        function Game() {
        }
        return Game;
    })();
    Game29.Game = Game;

    var RoundSet = (function () {
        function RoundSet() {
        }
        return RoundSet;
    })();
    Game29.RoundSet = RoundSet;

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

    (function (GameResult) {
        GameResult[GameResult["Incomplete"] = 0] = "Incomplete";
        GameResult[GameResult["TeamA"] = 1] = "TeamA";
        GameResult[GameResult["TeamB"] = 2] = "TeamB";
    })(Game29.GameResult || (Game29.GameResult = {}));
    var GameResult = Game29.GameResult;
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
        GameState[GameState["MixingCards"] = 1] = "MixingCards";
        GameState[GameState["DistributingCards1"] = 2] = "DistributingCards1";
        GameState[GameState["BiddingTrump"] = 3] = "BiddingTrump";
        GameState[GameState["SettingTrump"] = 4] = "SettingTrump";
        GameState[GameState["OfferDoublePoints"] = 5] = "OfferDoublePoints";
        GameState[GameState["OfferRedoublePoints"] = 6] = "OfferRedoublePoints";
        GameState[GameState["DistributingCards2"] = 7] = "DistributingCards2";
        GameState[GameState["TrickPlay"] = 8] = "TrickPlay";
        GameState[GameState["UpdatingScore"] = 9] = "UpdatingScore";
        GameState[GameState["Completed"] = 10] = "Completed";
        GameState[GameState["Cancelled"] = 11] = "Cancelled";
    })(Game29.GameState || (Game29.GameState = {}));
    var GameState = Game29.GameState;

    (function (TeamPosition) {
        TeamPosition[TeamPosition["Watcher"] = 0] = "Watcher";
        TeamPosition[TeamPosition["TeamA1"] = 1] = "TeamA1";
        TeamPosition[TeamPosition["TeamB1"] = 2] = "TeamB1";
        TeamPosition[TeamPosition["TeamA2"] = 3] = "TeamA2";
        TeamPosition[TeamPosition["TeamB2"] = 4] = "TeamB2";
    })(Game29.TeamPosition || (Game29.TeamPosition = {}));
    var TeamPosition = Game29.TeamPosition;

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
