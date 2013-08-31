using TwentyNine.Models;

namespace TwentyNine.ViewModels
{
    public class PlayerInfo
    {
        // Player properties
        public string PlayerId { get; set; }
        public PlayerPosition Position { get; set; }

        // User properties
        public string Name { get; set; }
        public string Email { get; set; }
    }
}