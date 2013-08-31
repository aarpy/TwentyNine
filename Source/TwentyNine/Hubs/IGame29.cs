using TwentyNine.Models;
using TwentyNine.ViewModels;

namespace TwentyNine.Hubs
{
    public interface IGame29
    {
        Player Join(User user);
        Room JoinRoom(Room room);
        void LeaveRoom();
        bool JoinTeam(PlayerPosition playerPosition);
        void LeaveTeam();
        void StartGame();
        void BidTrump(int points);
        void BidTrumpFinalize();
        void SubmitDoubleScoreOffer();
        void SubmitRedoubleScoreOffer();
        void SelectTrump(SuiteType suite);
        void PlayCard(Card card);
        void ShowTrump();
        void SendMessage(EmoteMessage message);
        void BootUser(string userId);
        void CloseGame();
    }
}