/// <reference path="models.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/signalr/signalr.d.ts" />

interface IGame29Client {
    playerJoined(player: Game29.PlayerInfo);
    playerLeftRoom(playerId: string);
    playerJoinedTeam(playerId: string, position: Game29.PlayerPosition);
    playerLeftTeam(position: Game29.PlayerPosition);

    gameStarted(game: Game29.GameInfo, cards: Game29.Card[]);
    bidReceived(points: number, blockingPosition: Game29.PlayerPosition);
    bidPassed(blockingPosition: Game29.PlayerPosition);
    binFinalized(points: number);
    trumpSelected();
    receivedDoubleOffer(playerId: string);
    receivedRedoubleOffer(playerId: string);
    takeAllCards(cards: Game29.Card[]);
    cardReceived(cardPlayed: Game29.CardPlayed);
    trumpOpened(suite: Game29.SuiteType, playerPosition: Game29.PlayerPosition);

    messageReceived(message: Game29.ChatMessage);
    playerBooted(playerId: string);
    gameClosed();

    exceptionHandler(messge: string);
}

interface IGame29Server {
    join(user: Game29.PlayerInfo): JQueryPromise;
    joinRoom(room: Game29.RoomInfo): JQueryPromise;
    leaveRoom(): JQueryPromise;
    joinTeam(playerPosition: Game29.PlayerPosition): JQueryPromise;
    leaveTeam(): JQueryPromise;

    startGame(): JQueryPromise;
    bidTrump(points: number): JQueryPromise;
    bidPass(): JQueryPromise;
    bidTrumpFinalize(): JQueryPromise;
    selectTrump(suite: Game29.SuiteType): JQueryPromise;
    submitDoubleScoreOffer(): JQueryPromise;
    submitRedoubleScoreOffer(): JQueryPromise;
    passDoubleScoreOffer(): JQueryPromise;
    playCard(card: Game29.Card): JQueryPromise;
    showTrump(): JQueryPromise;

    sendMessage(message: string): JQueryPromise;
    bootUser(playerId: string): JQueryPromise;
    closeGame(): JQueryPromise;
}

interface HubProxy {
    client: IGame29Client;
    server: IGame29Server;
}

interface SignalR {
    game29: HubProxy;
}

