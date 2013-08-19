using System;
using Microsoft.AspNet.SignalR.Hubs;

namespace TwentyNine.Hubs
{
    public class Game29HubPipelineModule : HubPipelineModule
    {
        protected override void OnIncomingError(Exception ex, IHubIncomingInvokerContext context)
        {
            context.Hub.Clients.Caller.ExceptionHandler("Game29 error: " + ex.Message);
        }
    }
}