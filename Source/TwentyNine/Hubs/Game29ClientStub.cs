
using TwentyNine.Models;
using TwentyNine.ViewModels;

namespace TwentyNine.Hubs
{
    public class Game29ClientStub : IGame29Client
    {
        public dynamic Source { get; set; }

        public Game29ClientStub(dynamic sourceRoom)
        {
            Source = sourceRoom;
        }

        public void PlayerJoined(PlayerInfo player)
        {
            Source.playerJoined(player);
        }

        public void PlayerLeftRoom(string playerId)
        {
            Source.playerLeftRoom(playerId);
        }

        public void PlayerJoinedTeam(string playerId, PlayerPosition position)
        {
            Source.playerJoinedTeam(playerId, position);
        }

        public void PlayerLeftTeam(PlayerPosition position)
        {
            Source.playerLeftTeam(position);
        }

        public void GameStarted(GameInfo game, Card[] cards)
        {
            Source.gameStarted(game, cards);
        }

        public void BidReceived(int points, PlayerPosition blockingPosition)
        {
            Source.bidReceived(points, blockingPosition);
        }

        public void BidPassed(PlayerPosition blockingPosition)
        {
            Source.bidPassed(blockingPosition);
        }

        public void BidFinalized(int points)
        {
            Source.bidFinalized(points);
        }

        public void TrumpSelected()
        {
            Source.trumpSelected();
        }

        public void ReceivedDoubleOffer(string playerId)
        {
            Source.receivedDoubleOffer(playerId);
        }

        public void ReceivedRedoubleOffer(string playerId)
        {
            Source.receivedRedoubleOffer(playerId);
        }

        public void TakeAllCards(Card[] cards)
        {
            Source.takeAllCards(cards);
        }

        public void CardReceived(CardPlayedInfo cardPlayed)
        {
            Source.cardReceived(cardPlayed);
        }

        public void TrumpOpened(SuiteType suite, PlayerPosition playerPosition)
        {
            Source.trumpOpened();
        }

        public void MessageReceived(ChatMessage message)
        {
            Source.messageReceived(message);
        }

        public void PlayerBooted(string playerId)
        {
            Source.playerBooted(playerId);
        }

        public void GameClosed()
        {
            Source.gameClosed();
        }

        public void ExceptionHandler(string messge)
        {
            Source.exceptionHandler(messge);
        }
    }
}