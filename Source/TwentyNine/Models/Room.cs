using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace TwentyNine.Models
{
    public class Room
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public RoomState State { get; set; }

        public virtual Game Game { get; set; }

        private ICollection<User> _watchers;

        public virtual ICollection<User> Watchers
        {
            get
            {
                if (_watchers == null) _watchers = new Collection<User>();
                return _watchers;
            }
        }

        public DateTime Created { get; set; }
        public DateTime Modified { get; set; }
    }
}