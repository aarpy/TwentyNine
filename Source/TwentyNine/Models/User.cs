using System;

namespace TwentyNine.Models
{
    public class User
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }

        public string UserName { get; set; }
        public string AuthToken { get; set; }
        public string RefreshToken { get; set; }

        public DateTime Created { get; set; }
        public DateTime Modified { get; set; }
    }
}