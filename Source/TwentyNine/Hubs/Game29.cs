using System;
using System.Collections.Generic;
using System.Linq;
using NLog;
using SignalR.Hubs;
using TwentyNine.Models;

namespace TwentyNine.Hubs
{
    public class Game29 : Hub, IGame29
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        private static readonly Dictionary<string, User> Users = new Dictionary<string, User>();
        private static readonly List<Room> Rooms = new List<Room>();

        public User Join(User user)
        {
            Logger.Info("{0} joined 29", user.Email);

            var userRef = Users.Where(x => x.Value.Email == user.Email).Select(x => new
                {
                    ConnectionId = x.Key,
                    User = x.Value
                }).FirstOrDefault();

            if (userRef != null && userRef.ConnectionId != Context.ConnectionId)
                Users.Remove(userRef.ConnectionId);

            if (!Users.ContainsKey(Context.ConnectionId))
                Users.Add(Context.ConnectionId, user);

            return user;
        }

        public Room JoinRoom(Room room)
        {
            var user = Users.Where(x => x.Key == Context.ConnectionId).Select(x => x.Value).FirstOrDefault();

            if (user == null)
                throw new Exception("No user with this connection Id has joined yet.");

            Logger.Info("{0} joined {1} room", user.Email, room.Name);

            room = Rooms.FirstOrDefault(x => x.Name == room.Name) ?? room;

            if (!Rooms.Contains(room))
                Rooms.Add(room);

            if (room.Watchers.All(x => x.Email != user.Email))
            {
                room.Watchers.Add(user);
            }

            // tell the people in this room that you've joined
            Clients.Group(room.Name).userJoined(user);

            Groups.Add(Context.ConnectionId, room.Name);

            return room;
        }

        public void LeaveRoom(Room room)
        {
            Logger.Info("Leave room called");
        }

        public Player JoinTeam(TeamPosition teamPosition)
        {
            Logger.Info("Join team called");
            return new Player {TeamPosition = teamPosition};
        }

        public void LeaveTeam(TeamPosition teamPosition)
        {
            Logger.Info("LeaveTeam called");
        }

        public void StartGame()
        {
            Logger.Info("StartGame called");
        }

        public void BidTrump(int points)
        {
            Logger.Info("BidTrump called");
        }

        public void BidTrumpFinalize()
        {
            Logger.Info("BidTrumpFinalize called");
        }

        public void SubmitDoubleScoreOffer()
        {
            Logger.Info("SubmitDoubleScoreOffer called");
        }

        public void SelectTrump(SuiteType suite)
        {
            Logger.Info("SelectTrump called");
        }

        public void PlayCard(Card card)
        {
            Logger.Info("PlayCard called");
        }

        public void ShowTrump()
        {
            Logger.Info("ShowTrump called");
        }

        public void SendMessage(EmoteMessage message)
        {
            Logger.Info("SendMessage called");
        }

        public void BootUser(User user)
        {
            Logger.Info("BootUser called");
        }

        public void CloseGame()
        {
            Logger.Info("CloseGame called");
        }

}
}
