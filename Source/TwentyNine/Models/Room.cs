using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace TwentyNine.Models
{
    public class Room
    {
        public Guid RoomId { get; set; }
        public string Name { get; set; }
        public RoomState State { get; set; }

        public virtual Game Game { get; set; }

        private ICollection<Player> _watchers;

        public virtual ICollection<Player> Players
        {
            get { return _watchers ?? (_watchers = new Collection<Player>()); }
        }

        public DateTime Created { get; set; }
        public DateTime Modified { get; set; }

        public Room()
        {
            Game = new Game();
        }
    }
}