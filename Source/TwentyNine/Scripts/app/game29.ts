/// <reference path="contracts.ts" />
/// <reference path="models.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/signalr/signalr.d.ts" />

module Game29 {

    var App = angular.module("game29", ["ngCookies", "ui.bootstrap"]);

    export interface IGame29Scope extends ng.IScope {
        joinModalOptions: Object;

        joinModal: boolean;
        closeJoinModal();

        joinRoomModal: boolean;
        closeJoinRoomModal();

        joinTeam(playerPosition: PlayerPosition);
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
        submitRedoubleScoreOffer();

        selectedCard: Card;
        playCard();

        showTrump();

        messages: string[];
        sendMessage(message: EmoteMessage);

        selectedUser: PlayerInfo;
        bootUser();

        closeGame();

        me: PlayerInfo;
        room: RoomInfo;
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

        get me(): PlayerInfo {
            var value = this.$scope.me;

            if (!value) {
                var userEmail = this.$cookies.userEmail;
                var userName = this.$cookies.userName;

                //if (!userEmail)
                    return null;

                value = new PlayerInfo();
                value.Name = userName;
                value.Email = userEmail;
            }

            return value;
        }

        get room(): RoomInfo {
            var value = this.$scope.room;

            if (!value) {
                var roomName = this.$location.path().replace("/rooms/", "");

                if (!roomName)
                    return null;

                value = new RoomInfo();
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
            this._game29.client.playerJoined = (player: PlayerInfo) => this.playerJoined(player);
            this._game29.client.playerLeftRoom = (playerId: string) => this.playerLeftRoom(playerId);
            this._game29.client.trumpOpened = (suite: SuiteType) => {
                //this.$scope.showTrump = true;
                this.$scope.$apply();
            };
            this._game29.client.exceptionHandler = (message: string) => {
                window.alert(message);
            };
        }

        private playerJoined(user: PlayerInfo) {
            Logger.log("playerJoined");
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

        private playerLeftRoom(playerId: string) {
            Logger.log("playerLeftRoom called");
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

        private join(user: PlayerInfo = this.me): JQueryPromise {
            var that = this;
            return this._game29.server.join(user).done(function (data) {
                that.$scope.me = data;
                that.$scope.$apply();
            });
        }

        private joinRoom(room: RoomInfo = this.room): JQueryPromise {
            this.$location.path("/rooms/" + encodeURIComponent(room.Name));

            var that = this;
            return this._game29.server.joinRoom(room).done(function (data) {
                that.$scope.room = data;


                that.$scope.$apply();
            });
        }

        private leaveRoom(user: PlayerInfo = this.me): JQueryPromise {
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

    class Logger {
        static log(message: string) {
            if (typeof window.console !== 'undefined') {
                window.console.log(message);
            }
        }
    }
}