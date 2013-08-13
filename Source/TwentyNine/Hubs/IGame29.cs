using TwentyNine.Models;

namespace TwentyNine.Hubs
{
    public interface IGame29
    {
        User Join(User user);
        Room JoinRoom(Room room);
        void LeaveRoom(Room room);
        Player JoinTeam(TeamPosition teamPosition);
        void LeaveTeam(TeamPosition teamPosition);
        void StartGame();
        void BidTrump(int points);
        void BidTrumpFinalize();
        void SubmitDoubleScoreOffer();
        void SelectTrump(SuiteType suite);
        void PlayCard(Card card);
        void ShowTrump();
        void SendMessage(EmoteMessage message);
        void BootUser(User user);
        void CloseGame();
    }
}