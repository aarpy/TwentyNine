using System;
using System.Collections.Generic;
using TwentyNine.Models;

namespace TwentyNine.ViewModels
{
    public class RoomInfo
    {
        public Guid RoomId { get; set; }
        public string Name { get; set; }
        public RoomState State { get; set; }

        public virtual GameInfo Game { get; set; }

        public ICollection<PlayerInfo> Watchers { get; set; }
    }
}