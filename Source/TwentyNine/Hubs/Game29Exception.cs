using System;

namespace TwentyNine.Hubs
{
    public class Game29Exception : Exception
    {
        public Game29Exception(string message)
            : base(message)
        {

        }

        public Game29Exception(string message, Exception innerException)
            : base(message, innerException)
        {

        }
    }
}