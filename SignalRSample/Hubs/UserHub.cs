using Microsoft.AspNetCore.SignalR;

namespace SignalRSample.Hubs
{
    /// <summary>
    /// Count number of views in the webpage
    /// </summary>
    public class UserHub : Hub
    {
        public static int TotalViews { get; set; } = 0;

        public async Task NewWindowLoaded()
        {
            TotalViews++;
            // Send update to all clients that total views have been updated
            await Clients.All.SendAsync("updateTotalViews", TotalViews);
        }
    }
}
