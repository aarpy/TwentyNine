﻿using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using TwentyNine.Hubs;

namespace TwentyNine.Models
{
    public class Game
    {
        #region Constants

        private const int MaxPlayRounds = 8;
        private const int MaxPlayers = 4;


        #endregion

        #region Members

        public Guid GameId { get; set; }
        public GameState State { get; private set; }

        public ScoreCard TeamAScoreCard { get; set; }
        public ScoreCard TeamBScoreCard { get; set; }

        public PlayerPosition TrumpPlayerPosition { get; set; }
        public SuiteType TrumpSuite { get; set; }
        public PlayerPosition TrumpOpenedBy { get; set; }
        public RoundSet TrumpOpenedRound { get; set; }

        public GameScoreType ScoreType { get; set; }
        public PlayerTeam WinningTeam { get; set; }
        public int TargetScore { get; set; }
        public int RunningScore { get; set; }

        public PlayerPosition RoomLeaderPosition { get; set; }
        public PlayerPosition RoundHostPosition { get; set; }
        public PlayerPosition BlockingPosition { get; set; }

        public virtual ICollection<Player> Players { get; set; }
        public virtual ICollection<Card> FlushedCards { get; set; }
        public virtual ICollection<RoundSet> PlayedRounds { get; set; }

        public DateTime Created { get; set; }
        public DateTime Modified { get; set; }

        #endregion

        #region Ctor

        public Game()
        {
            Players = new Collection<Player>();
        }

        #endregion

        #region Public methods

        public void JoinTeam(Player player, PlayerPosition playerPosition)
        {
            ValidatePlayerIsNotPlaying(player);
            ValidatePlayerInPosition(player, playerPosition);
            ValidateGameIsNotStarted();

            Players.Add(player);
            player.Position = playerPosition;
        }

        public PlayerPosition LeaveTeam(string playerId)
        {
            ValidateGameIsNotStarted();

            var player = GetPlayer(playerId);
            var position = player.Position;
            Players.Remove(player);
            player.Position = PlayerPosition.Watcher;
            return position;
        }

        public void FlushCards()
        {
            FlushedCards = FlushedCards == null ? RandomizeCards(CreateNewCards()) : FlushCardsForNextGame(FlushedCards);
            FlushedCards = CutTheCards(FlushedCards);
        }

        public void DistributeCards()
        {
            var flushedCards = (Collection<Card>)FlushedCards;
            if (flushedCards.Count < 16)
                throw new Game29Exception("Cards are less. Unable to distribute: " + flushedCards.Count);

            var position = RoundHostPosition;
            for (var i = 0; i < 4; i++)
            {
                var player = GetPlayerInPosition(position);
                for (var j = 0; j < 4; j++)
                {
                    player.Cards.Add(flushedCards[0]);
                    flushedCards.RemoveAt(0);
                }
                position = position.NextPosition();
            }

            BlockingPosition = RoundHostPosition.NextPosition();
            State = flushedCards.Count > 0 ? GameState.BiddingTrump : GameState.StartRound;
        }

        public void BidTrump(string playerId, int points)
        {
            ValidateBlockingPlayerCall(playerId);

            if (points <= TargetScore)
                throw new Game29Exception("Invalid points call: " + points);

            TargetScore = points;
            TrumpPlayerPosition = GetPlayerBlocking().Position;

            BidPass(playerId);
        }

        public void BidPass(string playerId)
        {
            ValidateBlockingPlayerCall(playerId);

            BlockingPosition = BlockingPosition.NextPosition();
        }

        public void BidFinalize(string playerId)
        {
            ValidateBlockingPlayerCall(playerId);

            State = GameState.SettingTrump;
        }

        public void SelectTrump(SuiteType suite)
        {
            TrumpSuite = suite;
            State = GameState.OfferDoublePoints;
            BlockingPosition = BlockingPosition.NextPosition();
        }

        public void SendDoubleScoreOffer(string playerId)
        {
            var currentPlayerTeam = GetPlayerTeam(playerId);
            var trumpPlayerTeam = TrumpPlayerPosition.Team();
            if (!((trumpPlayerTeam == PlayerTeam.TeamA && currentPlayerTeam == PlayerTeam.TeamB) ||
                (trumpPlayerTeam == PlayerTeam.TeamB && currentPlayerTeam == PlayerTeam.TeamA)))
                throw new Game29Exception("Players currently does not belong to opposite teams to give or pass double offer");

            ScoreType = GameScoreType.Double;
            BlockingPosition = BlockingPosition.NextPosition();
        }

        public void SendRedoubleScoreOffer(string playerId)
        {
            var currentPlayerTeam = GetPlayerTeam(playerId);
            var trumpPlayerTeam = TrumpPlayerPosition.Team();
            if (!((trumpPlayerTeam == PlayerTeam.TeamA && currentPlayerTeam == PlayerTeam.TeamA) ||
                  (trumpPlayerTeam == PlayerTeam.TeamB && currentPlayerTeam == PlayerTeam.TeamB)))
                throw new Game29Exception(
                    "Players currently does not belong to same teams to give or pass re-double offer");

            ScoreType = GameScoreType.Redouble;
            BlockingPosition = RoundHostPosition.NextPosition();
        }

        public void PassDoubleScoreOffer()
        {
            BlockingPosition = RoundHostPosition.NextPosition();
        }

        public void PlayCard(string playerId, Card card)
        {
            var player = GetPlayer(playerId);

            var currentRound = GetCurrentRound();
            currentRound.Cards.Add(card);
            player.Cards.Remove(card);

            State = GameState.ContinueRound;
            if (currentRound.Cards.Count == MaxPlayers)
            {
                DoneWithCurrentRound();
            }

            BlockingPosition = BlockingPosition.NextPosition();
        }

        public void ShowTrump(string playerId)
        {
            var player = GetPlayer(playerId);
            if (player.Position == RoundHostPosition || player.Position != BlockingPosition)
                throw new Game29Exception("Trump can be opened on your turn only");

            var currentRound = GetCurrentRound();
            var firstCard = currentRound.Cards.First();
            if (player.Cards.Any(card => card.Suite == firstCard.Suite))
                throw new Game29Exception("Trump cannot be opened if you already have the running color");

            TrumpOpenedBy = player.Position;
            TrumpOpenedRound = GetCurrentRound();
        }

        #endregion

        #region Helper Methods - Validation

        private void ValidateBlockingPlayerCall(string playerId)
        {
            var player = GetPlayerBlocking();
            if (player.PlayerId != playerId)
                throw new Game29Exception("Invalid player call to the game: " + player.User.Name);
        }

        public void CreateGame()
        {
            ValidateGameIsNotStarted();
            ValidateGameIsReadyToStart();
        }

        private void ValidateGameIsReadyToStart()
        {
            if (Players.Count() == 4)
                throw new Game29Exception("Not all players are seated to start the game");
        }

        private void ValidateGameIsNotStarted()
        {
            if (State != GameState.New)
                throw new Game29Exception("Game already in progress or completed");
        }

        private void ValidatePlayerIsNotPlaying(Player player)
        {
            if (player.Position != PlayerPosition.Watcher)
                throw new Game29Exception("Player already in a position: " + player.Position);
        }

        private void ValidatePlayerInPosition(Player player, PlayerPosition playerPosition)
        {
            var playerInPostion = GetPlayerInPosition(playerPosition);
            if (playerInPostion != null &&
                !string.Equals(playerInPostion.User.Email, player.User.Email, StringComparison.OrdinalIgnoreCase))
            {
                throw new Game29Exception("A user already exists in the position: " + playerPosition);
            }
        }

        #endregion

        #region Helper Methods - Flush cards

        private ICollection<Card> CutTheCards(ICollection<Card> cards)
        {
            var cardsCollection = (Collection<Card>) cards;
            var cutCards = new Collection<Card>();

            var cutPosition = new Random().Next(cardsCollection.Count);
            for (var i = cutPosition; i < cardsCollection.Count; i++)
            {
                cutCards.Add(cardsCollection[i]);
            }
            for (var i = 0; i < cutPosition; i++)
            {
                cutCards.Add(cardsCollection[i]);
            }
            return cutCards;
        }

        private ICollection<Card> FlushCardsForNextGame(ICollection<Card> cards)
        {
            var cardsCollection = (Collection<Card>) cards;
            var flushedCards = new Collection<Card>();

            var random = new Random();
            while (cardsCollection.Count > 0)
            {
                var nextCard = random.Next(cardsCollection.Count - 1);
                flushedCards.Add(cardsCollection[nextCard]);
                cardsCollection.RemoveAt(nextCard);
            }

            return flushedCards;
        }

        private ICollection<Card> RandomizeCards(ICollection<Card> cards)
        {
            var cardsCollection = (Collection<Card>) cards;
            var randomizedCards = new Collection<Card>();

            var random = new Random();
            while (cardsCollection.Count > 0)
            {
                var nextCard = random.Next(cardsCollection.Count - 1);
                randomizedCards.Add(cardsCollection[nextCard]);
                cardsCollection.RemoveAt(nextCard);
            }

            return randomizedCards;
        }

        private static Collection<Card> CreateNewCards()
        {
            var newSet = new Collection<Card>();

            foreach (var suite in Enum.GetValues(typeof (SuiteType)))
            {
                foreach (var pointCard in Enum.GetValues(typeof (PointCard)))
                {
                    newSet.Add(new Card {Suite = (SuiteType) suite, PointCard = (PointCard) pointCard});
                }
            }

            return newSet;
        }

        #endregion

        #region Helper Methods - Player

        private Player GetPlayerInPosition(PlayerPosition position)
        {
            return Players.SingleOrDefault(player => player.Position == position);
        }

        private Player GetPlayerBlocking()
        {
            return GetPlayerInPosition(BlockingPosition);
        }

        private Player GetPlayer(string playerId)
        {
            return Players.SingleOrDefault(item => item.PlayerId == playerId);
        }

        private PlayerTeam GetPlayerTeam(string playerId)
        {
            var player = Players.SingleOrDefault(item => item.PlayerId == playerId);
            return player != null ? player.Position.Team() : PlayerTeam.Unknown;
        }

        #endregion

        #region Helper Methods - Play card

        private RoundSet GetCurrentRound()
        {
            var currentRound = PlayedRounds.LastOrDefault();
            if (currentRound == null)
            {
                currentRound = new RoundSet
                {
                    RoundHost = BlockingPosition
                };
                PlayedRounds.Add(currentRound);
            }
            return currentRound;
        }

        private void DoneWithCurrentRound()
        {
            State = GameState.RoundCompleted;
            ScoreCurrentRound();
            if (!IsGameCompleted)
            {
                MoveToNextRound();
            }
            else
            {
                DoneWithTheGame();
            }
        }

        private void MoveToNextRound()
        {
            var lastRound = PlayedRounds.Last();
            PlayedRounds.Add(new RoundSet
            {
                RoundHost = lastRound.RoundWinner
            });
            BlockingPosition = lastRound.RoundWinner;
        }

        private bool IsGameCompleted
        {
            get { return PlayedRounds.Count == MaxPlayRounds || RunningScore >= TargetScore; }
        }

        private bool IsTrumpOpened
        {
            get { return TrumpOpenedBy != PlayerPosition.Watcher; }
        }

        #endregion

        #region Helper Methods - Scoring

        private void ScoreCurrentRound()
        {
            var currentRound = GetCurrentRound();
            currentRound.UpdateWinner(IsTrumpOpened ? TrumpSuite : (SuiteType?)null);

            UpdateRunningScore();
        }

        private void UpdateRunningScore()
        {
            var trumpPlayerTeam = TrumpPlayerPosition.Team();
            RunningScore =
                PlayedRounds.Sum(
                    item => trumpPlayerTeam == item.RoundWinner.Team() ? item.RoundScore : 0);
        }

        private void DoneWithTheGame()
        {
            var trumpTeam = TrumpPlayerPosition.Team();
            WinningTeam = RunningScore >= TargetScore
                ? trumpTeam
                : (trumpTeam == PlayerTeam.TeamA ? PlayerTeam.TeamB : PlayerTeam.TeamA);
            State = GameState.GameCompleted;
        }

        #endregion
    }
}