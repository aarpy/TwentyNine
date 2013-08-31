using Omu.ValueInjecter;
using TwentyNine.Models;
using TwentyNine.ViewModels;

namespace TwentyNine.Helpers.Converters
{
    public static class ConverterExtensions
    {
        public static RoomInfo ToRoomInfo(this Room room)
        {
            var info = new RoomInfo();
            info.InjectFrom(room);
            return info;
        }

        public static GameInfo ToGameInfo(this Game game)
        {
            var info = new GameInfo();
            info.InjectFrom(game);
            return info;
        }

        public static PlayerInfo ToPlayerInfo(this Player player)
        {
            var info = new PlayerInfo();
            info.InjectFrom(player);
            return info;
        }

        public static RoundSetInfo ToRoundSetInfoInfo(this RoundSet roundSet)
        {
            var info = new RoundSetInfo();
            info.InjectFrom(roundSet);
            return info;
        }

    }
}