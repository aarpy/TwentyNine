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
    proxy: HubProxy;
}

class Logger {
    static log(message: string) {
        if (typeof window.console !== 'undefined') {
            window.console.log(message);
        }
    }
}

module Game29 {

    var app = angular.module("game29", ["ngCookies", "ui.bootstrap"]);

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
        private _proxy: HubProxy;

        // protect the injection from minification
        static $inject = ['$scope', '$location', '$cookies'];

        constructor(private $scope: IGame29Scope, private $location: ng.ILocationService, private $cookies: any) {
            this._proxy = $.connection.proxy;
            var that = this;

            this.registerScopeWatches();
            this.registerScopeHandlers(that);
            this.registerClientCallbacks();

            this.startHub($scope, that);
        }

        //#region Properties

        get me(): User {
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
        }

        get room(): Game {
            var value = this.$scope.room;

            if (!value) {
                var roomName = this.$location.path().replace("/rooms/", "");

                if (!roomName)
                    return null;

                value = new Game();
                value.Name = roomName;

                this.$scope.room = value;
            }

            return value;
        }

        //#region Scope init

        private registerScopeWatches() {
            this.$scope.$watch("room.Name", function (value) {
                if (!value) return;
                this.$location.path("/rooms/" + encodeURIComponent(value));
            });
            this.$scope.$watch("me.Email", function (value) {
                if (!value) return;
                this.$cookies.userEmail = value;
            });
            this.$scope.$watch("me.Name", function (value) {
                if (!value) return;
                this.$cookies.userName = value;
            });
        }

        private registerScopeHandlers(ctrl: Game29Ctrl) {
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
        }

        private startHub($scope: IGame29Scope, that: Game29Ctrl) {
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
        }

        //#region Client

        private registerClientCallbacks() {
            this._proxy.client.userJoined = (user: User) => this.userChanged(user);
            this._proxy.client.userLeftRoom = (user: User) => this.userRemoved(user);
            this._proxy.client.trumpOpened = (suite: SuiteType) => {
                //this.$scope.showTrump = true;
                this.$scope.$apply();
            };
        }

        private userChanged(user: User) {
            if (this.$scope.room.Users) {
                var found = false;

                this.$scope.room.Users = this.$scope.room.Users.map(function (roomUser) {
                    if (user.Email === roomUser.Email) {
                        found = true;
                        roomUser = user;
                    }

                    return roomUser;
                });

                if (!found)
                    this.$scope.room.Users.push(user);

                this.$scope.$apply();
            }
        }

        private userRemoved(user: User) {
            var found = false;

            if (user.Email === this.$scope.me.Email) {
                this.$scope.room = null;
                this.$location.path("");
                this.$scope.joinRoomModal = true;
            } else {
                this.$scope.room.Users = this.$scope.room.Users.filter(function (roomUser) {
                    return user.Email !== roomUser.Email;
                });
                this.$scope.room.Cards = this.$scope.room.Cards.filter(function (roomCard) {
                    return user.Email !== roomCard.User.Email;
                });
            }

            this.$scope.$apply();
        }

        //#endregion

        //#region Server

        private join(user: User = this.me): JQueryPromise {
            var that = this;
            return this._proxy.server.join(user).done(function (data) {
                that.$scope.me = data;
                that.$scope.$apply();
            });
        }

        private joinRoom(room: Game = this.room): JQueryPromise {
            this.$location.path("/rooms/" + encodeURIComponent(room.Name));

            var that = this;
            return this._proxy.server.joinRoom(room).done(function (data) {
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
    app.controller("Game29Ctrl", Game29Ctrl);

    export class User {
        public Name: string;
        public Email: string;
        public Disconnected: string;
    }

    export class Room {
        public Name: string;
        public Topic: string;
        public Users: User[];
        public Cards: Card[];
    }

    export class Game {
        public Name: string;
        public Topic: string;
        public Users: User[];
        public Cards: Card[];
    }

    export class Card {
        public suite: SuiteType;
        public pointCard: PointCard;
    }

    export class EmoteMessage {
        public emote: Emote;
        public message: string;
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