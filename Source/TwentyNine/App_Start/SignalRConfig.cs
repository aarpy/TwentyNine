using Microsoft.AspNet.SignalR;
using TwentyNine.Hubs;

namespace TwentyNine.App_Start
{
    public class SignalRConfig
    {
        public static void Register()
        {
            GlobalHost.HubPipeline.AddModule(new Game29HubPipelineModule());
        }
    }
}