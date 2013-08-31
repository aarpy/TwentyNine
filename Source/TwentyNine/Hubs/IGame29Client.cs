using TwentyNine.Models;
using TwentyNine.ViewModels;

namespace TwentyNine.Hubs
{
    public interface IGame29Client
    {
        dynamic Source { get; set; }

        void PlayerJoined(PlayerInfo player);
        void PlayerLeftRoom(string playerId);
        void PlayerJoinedTeam(string playerId, PlayerPosition position);
        void PlayerLeftTeam(PlayerPosition position);

        void GameStarted(GameInfo game, Card[] cards);
        void BidReceived(int points, PlayerPosition blockingPosition);
        void BidPassed(PlayerPosition blockingPosition);
        void BidFinalized(int points);
        void TrumpSelected();
        void ReceivedDoubleOffer(string playerId);
        void ReceivedRedoubleOffer(string playerId);
        void TakeAllCards(Card[] cards);
        void CardReceived(CardPlayedInfo cardPlayed);
        void TrumpOpened(SuiteType suite, PlayerPosition playerPosition);

        void MessageReceived(EmoteMessage message, string playerId);
        void PlayerBooted(string playerId);
        void GameClosed();
        
        void ExceptionHandler(string messge);
    }
}