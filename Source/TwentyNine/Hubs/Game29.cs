using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Ajax.Utilities;
using Microsoft.AspNet.SignalR;
using NLog;
using TwentyNine.Helpers.Converters;
using TwentyNine.Models;
using TwentyNine.ViewModels;

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
                    _currentPlayer =
                        Players.Where(x => x.Key == Context.ConnectionId).Select(x => x.Value).FirstOrDefault();
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

        private string PlayerId
        {
            get { return CurrentPlayer.PlayerId; }
        }

        private IGame29Client _game29Client;

        private IGame29Client Game29Client
        {
            get
            {
                if (_game29Client == null)
                {
                    var sourceRoom = Clients.Group(CurrentPlayer.Room.Name);
                    _game29Client = new Game29ClientStub(sourceRoom);
                }
                return _game29Client;
            }    
        }

        public PlayerInfo Join(PlayerInfo playerInfo)
        {
            Logger.Info("{0} joined 29", playerInfo.Email);

            var playerRef = Players.Where(x => x.Value.User.Email == playerInfo.Email).Select(x => new
            {
                ConnectionId = x.Key,
                Player = x.Value
            }).FirstOrDefault();

            if (playerRef != null && playerRef.ConnectionId != Context.ConnectionId)
                Players.Remove(playerRef.ConnectionId);

            Player player;
            if (!Players.ContainsKey(Context.ConnectionId) || playerRef == null)
            {
                player = new Player
                {
                    User = new User {UserId = Guid.NewGuid().ToString(), Email = playerInfo.Email, Name = playerInfo.Name},
                    Joined = DateTime.Now
                };
                Players.Add(Context.ConnectionId, player);
            }
            else
            {
                player = playerRef.Player;
            }
            player.PlayerId = player.ConnectionId = Context.ConnectionId;

            return player.ToPlayerInfo();
        }

        public RoomInfo JoinRoom(RoomInfo roomInfo)
        {
            Logger.Info("{0} joined {1} room", CurrentPlayer.User.Email, roomInfo.Name);

            var room = Rooms.FirstOrDefault(x => x.Name == roomInfo.Name) ?? new Room
            {
                RoomId = Guid.NewGuid(),
                Name = roomInfo.Name
            };

            if (!Rooms.Contains(room))
                Rooms.Add(room);

            if (room.Players.All(x => x.PlayerId != PlayerId))
            {
                room.Players.Add(CurrentPlayer);
            }

            CurrentPlayer.Room = room;

            // tell the people in this room that you've joined
            Game29Client.PlayerJoined(CurrentPlayer.ToPlayerInfo());

            Groups.Add(PlayerId, room.Name);

            return room.ToRoomInfo();
        }

        public void LeaveRoom()
        {
            Logger.Info("Leave room called");
            if (CurrentPlayer.Room == null) return;

            var room = CurrentPlayer.Room;
            CurrentPlayer.Room.Players.Remove(CurrentPlayer);
            CurrentPlayer.Room = null;

            Game29Client.PlayerLeftRoom(CurrentPlayer.PlayerId);

            Groups.Remove(PlayerId, room.Name);
        }

        public bool JoinTeam(PlayerPosition playerPosition)
        {
            Logger.Info("Join team called");

            CurrentGame.JoinTeam(CurrentPlayer, playerPosition);

            Game29Client.PlayerJoinedTeam(CurrentPlayer.PlayerId, playerPosition);

            return true;
        }

        public void LeaveTeam()
        {
            Logger.Info("LeaveTeam called");

            if (CurrentPlayer.Position == PlayerPosition.Watcher) return;

            var position = CurrentGame.LeaveTeam(PlayerId);

            Game29Client.PlayerLeftTeam(position);
        }

        public void StartGame()
        {
            Logger.Info("StartGame called");

            CurrentGame.CreateGame();
            CurrentGame.FlushCards();
            CurrentGame.DistributeCards();

            foreach (var player in CurrentGame.Players)
            {
                Game29Client.Source = Clients.Client(player.ConnectionId);
                Game29Client.GameStarted(CurrentGame.ToGameInfo(), player.Cards.ToArray());
            }
        }

        public void BidTrump(int points)
        {
            Logger.Info("BidTrump called");

            CurrentGame.BidTrump(PlayerId, points);

            Game29Client.BidReceived(points, CurrentGame.BlockingPosition);
        }

        public void BidPass()
        {
            Logger.Info("BidPass called");

            CurrentGame.BidPass(PlayerId);

            Game29Client.BidPassed(CurrentGame.BlockingPosition);
        }

        public void BidTrumpFinalize()
        {
            Logger.Info("BidTrumpFinalize called");

            CurrentGame.BidFinalize(PlayerId);

            Game29Client.BidFinalized(CurrentGame.TargetScore);
        }

        public void SelectTrump(SuiteType suite)
        {
            Logger.Info("SelectTrump called");

            CurrentGame.SelectTrump(suite);

            Game29Client.TrumpSelected();
        }

        public void SubmitDoubleScoreOffer()
        {
            Logger.Info("SubmitDoubleScoreOffer called");

            CurrentGame.SendDoubleScoreOffer(PlayerId);

            Game29Client.ReceivedDoubleOffer(CurrentPlayer.PlayerId);
        }

        public void SubmitRedoubleScoreOffer()
        {
            Logger.Info("SubmitRedoubleScoreOffer called");

            CurrentGame.SendRedoubleScoreOffer(PlayerId);

            Game29Client.ReceivedRedoubleOffer(CurrentPlayer.PlayerId);

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
                Game29Client.Source = Clients.Client(player.ConnectionId);
                Game29Client.TakeAllCards(player.Cards.ToArray());
            }
        }

        public void PlayCard(Card card)
        {
            Logger.Info("PlayCard called");

            var cardPlayed = new CardPlayedInfo
            {
                Card = card,
                PlayerPosition = CurrentGame.BlockingPosition
            };

            CurrentGame.PlayCard(PlayerId, card);

            cardPlayed.BlockingPosition = CurrentGame.BlockingPosition;
            cardPlayed.GameState = CurrentGame.State;
            cardPlayed.RunningScore = CurrentGame.RunningScore;

            if (CurrentGame.State == GameState.RoundCompleted || CurrentGame.State == GameState.GameCompleted)
            {
                var lastRound = CurrentGame.PlayedRounds.Last();
                cardPlayed.RoundScore = lastRound.RoundScore;
                cardPlayed.RounderWinner = lastRound.RoundWinner;
            }

            if (CurrentGame.State == GameState.GameCompleted)
            {
                cardPlayed.GameWinner = CurrentGame.WinningTeam;
            }

            Game29Client.CardReceived(cardPlayed);
        }

        public void ShowTrump()
        {
            Logger.Info("ShowTrump called");

            CurrentGame.ShowTrump(PlayerId);

            Game29Client.TrumpOpened(CurrentGame.TrumpSuite, CurrentPlayer.Position);
        }

        public void SendMessage(string message)
        {
            Logger.Info("SendMessage called");

            Game29Client.MessageReceived(new ChatMessage
            {
                Message = message,
                PlayerId = PlayerId,
                PlayerName = CurrentPlayer.User.Name
            });
        }

        public void BootUser(string userId)
        {
            Logger.Info("BootUser called");

            if (CurrentPlayer.Position != CurrentGame.RoomLeaderPosition)
                throw new Game29Exception("User can be booted only by room host");

            var bootedPlayer =
                Players.Where(player => player.Value.PlayerId == userId).Select(x => x.Value).FirstOrDefault();
            if (bootedPlayer == null) return;

            if (bootedPlayer.Position != PlayerPosition.Watcher &&
                (CurrentGame.State != GameState.New || CurrentGame.State != GameState.GameCompleted))
                throw new Game29Exception("Player cannot be booted during the game");

            Game29Client.PlayerBooted(bootedPlayer.PlayerId);
        }

        public void CloseGame()
        {
            Logger.Info("CloseGame called");

            if (CurrentPlayer.Position != CurrentGame.RoomLeaderPosition)
                throw new Game29Exception("User can be closed only by room host");

            Game29Client.GameClosed();
        }
    }
}
