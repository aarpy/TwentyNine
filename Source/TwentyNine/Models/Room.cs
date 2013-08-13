using System;
using System.Collections.Generic;

namespace TwentyNine.Models
{
    public class Room
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public RoomState State { get; set; }

        public virtual Game Game { get; set; }
        public virtual ICollection<User> Watchers { get; set; }

        public DateTime Created { get; set; }
        public DateTime Modified { get; set; }
    }
}