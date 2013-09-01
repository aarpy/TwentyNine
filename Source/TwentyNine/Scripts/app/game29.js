/// <reference path="contracts.ts" />
/// <reference path="models.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/signalr/signalr.d.ts" />
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

                    value = new Game29.PlayerInfo();
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

                    value = new Game29.RoomInfo();
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
            this._game29.client.playerJoined = function (player) {
                return _this.playerJoined(player);
            };
            this._game29.client.playerLeftRoom = function (playerId) {
                return _this.playerLeftRoom(playerId);
            };
            this._game29.client.trumpOpened = function (suite) {
                //this.$scope.showTrump = true;
                _this.$scope.$apply();
            };
            this._game29.client.exceptionHandler = function (message) {
                window.alert(message);
            };
        };

        Game29Ctrl.prototype.playerJoined = function (user) {
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
        };

        Game29Ctrl.prototype.playerLeftRoom = function (playerId) {
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
})(Game29 || (Game29 = {}));
//# sourceMappingURL=game29.js.map
