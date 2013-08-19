/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/signalr/signalr.d.ts" />

interface IGame29Client {
    userJoined(user: Game29.User);
    userLeftRoom(user: Game29.User);
    userJoinedTeam(user: Game29.User);
    userLeftTeam(user: Game29.User);

    gameStarted(game: Game29.Game, cards: Game29.Card[]);
    bidReceived(points: number);
    binFinalized(points: number);
    trumpSelected();
    receivedDoubleOffer();
    takeRemainingCards(cards: Game29.Card[]);
    receivedTurn(newRound: boolean);
    cardPlayed(card: Game29.Card);
    trumpOpened(suite: Game29.SuiteType);

    messageReceived(message: Game29.EmoteMessage);
    userBooted(user: Game29.User);
    gameClosed();

    exceptionHandler(messge: string);
}

interface IGame29Server {
    join(user: Game29.User): JQueryPromise;
    joinRoom(room: Game29.Room): JQueryPromise;
    leaveRoom(room: Game29.Room): JQueryPromise;
    joinTeam(teamPosition: Game29.TeamPosition): JQueryPromise;
    leaveTeam(teamPosition: Game29.TeamPosition): JQueryPromise;

    startGame(): JQueryPromise;
    bidTrump(points: number): JQueryPromise;
    bidTrumpFinalize(): JQueryPromise;
    selectTrump(suite: Game29.SuiteType): JQueryPromise;
    submitDoubleScoreOffer(): JQueryPromise;
    playCard(card: Game29.Card): JQueryPromise;
    showTrump(): JQueryPromise;

    sendMessage(message: Game29.EmoteMessage): JQueryPromise;
    bootUser(user: Game29.User): JQueryPromise;
    closeGame(): JQueryPromise;
}

interface HubProxy {
    client: IGame29Client;
    server: IGame29Server;
}

interface SignalR {
    game29: HubProxy;
}

class Logger {
    static log(message: string) {
        if (typeof window.console !== 'undefined') {
            window.console.log(message);
        }
    }
}

module Game29 {

    var App = angular.module("game29", ["ngCookies", "ui.bootstrap"]);

    export interface IGame29Scope extends ng.IScope {
        joinModalOptions: Object;

        joinModal: boolean;
        closeJoinModal();

        joinRoomModal: boolean;
        closeJoinRoomModal();

        joinTeam(teamPosition: TeamPosition);
        startGame();

        leaveRoom();
        leaveTeam();

        possibleBids: number[];
        selectedBid: number;
        bidTrump();

        possibleSuites: SuiteType[];
        selectedSuite: SuiteType;
        selectTrump();

        submitDoubleScoreOffer();

        selectedCard: Card;
        playCard();

        showTrump();

        messages: string[];
        sendMessage(message: EmoteMessage);

        selectedUser: User;
        bootUser();

        closeGame();

        me: User;
        room: Room;
        game: Game;
        cards: Card[];
    }

    export class Game29Ctrl {
        private _game29: HubProxy;

        // protect the injection from minification
        static $inject = ['$scope', '$location', '$cookies'];

        constructor(private $scope: IGame29Scope, private $location: ng.ILocationService, private $cookies: any) {
            this._game29 = $.connection.game29;

            this.registerScopeWatches();
            this.registerScopeHandlers();
            this.registerClientCallbacks();
            this.startHub($scope);
        }

        //#region Properties

        get me(): User {
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
        }

        get room(): Room {
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
        }

        //#region Scope init

        private registerScopeWatches() {
            var that = this;
            this.$scope.$watch("room.Name", function (value) {
                if (!value) return;
                that.$location.path("/rooms/" + encodeURIComponent(value));
            });
            this.$scope.$watch("me.Email", function (value) {
                if (!value) return;
                that.$cookies.userEmail = value;
            });
            this.$scope.$watch("me.Name", function (value) {
                if (!value) return;
                that.$cookies.userName = value;
            });
        }

        private registerScopeHandlers() {
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
        }

        private startHub($scope: IGame29Scope) {
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
        }

        //#region Client

        private registerClientCallbacks() {
            this._game29.client.userJoined = (user: User) => this.userJoined(user);
            this._game29.client.userLeftRoom = (user: User) => this.userLeftRoom(user);
            this._game29.client.trumpOpened = (suite: SuiteType) => {
                //this.$scope.showTrump = true;
                this.$scope.$apply();
            };
            this._game29.client.exceptionHandler = (message: string) => {
                window.alert(message);
            };
        }

        private userJoined(user: User) {
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
        }

        private userLeftRoom(user: User) {
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
        }

        //#endregion

        //#region Server

        private join(user: User = this.me): JQueryPromise {
            var that = this;
            return this._game29.server.join(user).done(function (data) {
                that.$scope.me = data;
                that.$scope.$apply();
            });
        }

        private joinRoom(room: Room = this.room): JQueryPromise {
            this.$location.path("/rooms/" + encodeURIComponent(room.Name));

            var that = this;
            return this._game29.server.joinRoom(room).done(function (data) {
                that.$scope.room = data;


                that.$scope.$apply();
            });
        }

        private leaveRoom(user: User = this.me): JQueryPromise {
            return null;
        }

        private resetRoom(): JQueryPromise {
            return null;
        }

        private showAllCards(show: boolean = true): JQueryPromise {
            return null;
        }

        private changeRoomTopic(topic: string): JQueryPromise {
            return null;
        }

        private changedMyCardValue(value: string): JQueryPromise {
            return null;
        }

        //#endregion
    }

    // setup controller
    App.controller("Game29Ctrl", Game29Ctrl);

    export class User {
        public Id: string;
        public Name: string;
        public Email: string;
    }

    export class Room {
        public Id: string;
        public Name: string;
        public State: RoomState;
        public Watchers: User[];
    }

    export class Game {
        public Id: string;
        public State: GameState;
        public ScoreType: GameScoreType;
        public Result: GameResult;

        public CurrentRound: RoundSet;

        public MyCards: Card[];
    }

    export class RoundSet
    {
        public Result: GameResult;
        public RoundHost: TeamPosition;
        public Cards: Card[];
    }

    export class Card {
        public Suite: SuiteType;
        public PointCard: PointCard;
    }

    export class EmoteMessage {
        public Emote: Emote;
        public Message: string;
    }

    export enum GameResult {
        Incomplete,
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

    export enum TeamPosition {
        Watcher,
        TeamA1,
        TeamB1,
        TeamA2,
        TeamB2
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

    export enum Emote {
        Normal,
        Cheers,
        Congrats
    }
}