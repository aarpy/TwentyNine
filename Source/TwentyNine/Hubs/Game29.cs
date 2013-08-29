using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.SignalR;
using NLog;
using TwentyNine.Models;

namespace TwentyNine.Hubs
{
    public class Game29 : Hub, IGame29
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        private static readonly Dictionary<string, Player> Players = new Dictionary<string, Player>();
        private static readonly List<Room> Rooms = new List<Room>();

        private Player _currentPlayer;
        private Player CurrentPlayer
        {
            get
            {
                if (_currentPlayer == null)
                {
                    _currentPlayer = Players.Where(x => x.Key == Context.ConnectionId).Select(x => x.Value).FirstOrDefault();
                    if (_currentPlayer == null)
                        throw new Exception("No user with this connection Id has joined yet.");
                }
                return _currentPlayer;
            }
        }

        private Game CurrentGame
        {
            get { return CurrentPlayer.Room.Game; }
        }

        public Player Join(User user)
        {
            Logger.Info("{0} joined 29", user.Email);

            var playerRef = Players.Where(x => x.Value.User.Email == user.Email).Select(x => new
                {
                    ConnectionId = x.Key,
                    Player = x.Value
                }).FirstOrDefault();

            if (playerRef != null && playerRef.ConnectionId != Context.ConnectionId)
                Players.Remove(playerRef.ConnectionId);

            Player player;
            if (!Players.ContainsKey(Context.ConnectionId) || playerRef == null)
            {
                player = new Player { User = user, Joined = DateTime.Now };
                Players.Add(Context.ConnectionId, player);
            }
            else
            {
                player = playerRef.Player;
            }
            player.Id = Context.ConnectionId;

            return player;
         }

        public Room JoinRoom(Room room)
        {
            Logger.Info("{0} joined {1} room", CurrentPlayer.User.Email, room.Name);

            room = Rooms.FirstOrDefault(x => x.Name == room.Name) ?? room;

            if (!Rooms.Contains(room))
                Rooms.Add(room);

            if (room.Players.All(x => x.User.Email != CurrentPlayer.User.Email))
            {
                room.Players.Add(CurrentPlayer);
            }

            CurrentPlayer.Room = room;

            // tell the people in this room that you've joined
            Clients.Group(room.Name).userJoined(CurrentPlayer);

            Groups.Add(Context.ConnectionId, room.Name);

            return room;
        }

        public void LeaveRoom()
        {
            Logger.Info("Leave room called");
            if (CurrentPlayer.Room == null) return;

            var room = CurrentPlayer.Room;
            CurrentPlayer.Room.Players.Remove(CurrentPlayer);
            CurrentPlayer.Room = null;

            Clients.Group(room.Name).userLeftRoom(CurrentPlayer.User);

            Groups.Remove(Context.ConnectionId, room.Name);
        }

        public bool JoinTeam(PlayerPosition playerPosition)
        {
            Logger.Info("Join team called");

            CurrentGame.JoinTeam(CurrentPlayer, playerPosition);

            Clients.Group(CurrentPlayer.Room.Name).userJoinedTeam(CurrentPlayer);

            return true;
        }

        public void LeaveTeam()
        {
            Logger.Info("LeaveTeam called");

            if (CurrentPlayer.Position == PlayerPosition.Watcher) return;

            var position = CurrentGame.LeaveTeam(Context.ConnectionId);

            Clients.Group(CurrentPlayer.Room.Name).userLeftTeam(position);
        }

        public void StartGame()
        {
            Logger.Info("StartGame called");


            CurrentGame.CreateGame();
            CurrentGame.FlushCards();
            CurrentGame.DistributeCards();

            foreach (var player in CurrentGame.Players)
            {
                Clients.Client(player.Id).gameStarted(CurrentGame, player.Cards);
            }

            CurrentGame.State = GameState.BiddingTrump;
        }

        public void BidTrump(int points)
        {
            Logger.Info("BidTrump called");

            CurrentGame.BidTrump(Context.ConnectionId, points);

            Clients.Group(CurrentPlayer.Room.Name).bidReceived(points, CurrentGame.BlockingPosition);
        }

        public void BidPass()
        {
            Logger.Info("BidPass called");

            CurrentGame.BidPass(Context.ConnectionId);

            Clients.Group(CurrentPlayer.Room.Name).bidPassed(CurrentGame.BlockingPosition);
        }

        public void BidTrumpFinalize()
        {
            Logger.Info("BidTrumpFinalize called");

            CurrentGame.BidFinalize(Context.ConnectionId);

            Clients.Group(CurrentPlayer.Room.Name).bidFinalized(CurrentGame.TargetScore);
        }

        public void SelectTrump(SuiteType suite)
        {
            Logger.Info("SelectTrump called");

            CurrentGame.SelectTrump(suite);

            Clients.Group(CurrentPlayer.Room.Name).trumpSelected();
        }

        public void SubmitDoubleScoreOffer()
        {
            Logger.Info("SubmitDoubleScoreOffer called");

            CurrentGame.SendDoubleScoreOffer(Context.ConnectionId);

            Clients.Group(CurrentPlayer.Room.Name).receivedDoubleOffer(CurrentPlayer.User);
        }

        public void SubmitRedoubleScoreOffer()
        {
            Logger.Info("SubmitRedoubleScoreOffer called");

            CurrentGame.SendRedoubleScoreOffer(Context.ConnectionId);

            Clients.Group(CurrentPlayer.Room.Name).receivedRedoubleOffer(CurrentPlayer.User);

            DistributeAllCards();
        }

        public void PassDoubleScoreOffer()
        {
            Logger.Info("PassDoubleScoreOffer called");

            CurrentGame.PassDoubleScoreOffer();

            DistributeAllCards();
        }

        private void DistributeAllCards()
        {
            CurrentGame.DistributeCards();

            foreach (var player in CurrentGame.Players)
            {
                Clients.Client(player.Id).takeAllCards(player.Cards);
            }

            CurrentGame.State = GameState.TrickPlay;
        }

        public void PlayCard(Card card)
        {
            Logger.Info("PlayCard called");

            CurrentGame.PlayCard(Context.ConnectionId, card);
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
