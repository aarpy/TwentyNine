using TwentyNine.Models;
using TwentyNine.ViewModels;

namespace TwentyNine.Hubs
{
    public interface IGame29
    {
        PlayerInfo Join(PlayerInfo playerInfo);
        RoomInfo JoinRoom(RoomInfo room);
        void LeaveRoom();
        bool JoinTeam(PlayerPosition playerPosition);
        void LeaveTeam();
        void StartGame();
        void BidTrump(int points);
        void BidPass();
        void BidTrumpFinalize();
        void SelectTrump(SuiteType suite);
        void SubmitDoubleScoreOffer();
        void SubmitRedoubleScoreOffer();
        void PassDoubleScoreOffer();
        void PlayCard(Card card);
        void ShowTrump();
        void SendMessage(string message);
        void BootUser(string playerId);
        void CloseGame();
    }
}