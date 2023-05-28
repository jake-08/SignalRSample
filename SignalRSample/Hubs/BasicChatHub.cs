using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.SignalR;
using SignalRSample.Data;

namespace SignalRSample.Hubs
{
    public class BasicChatHub : Hub
    {
        private readonly ApplicationDbContext _db;

        public BasicChatHub(ApplicationDbContext db)
        {
            _db = db;             
        }

        public async Task SendMessageToAll(string user, string message)
        {
            await Clients.All.SendAsync("MessageReceived", user, message);
        }

        [Authorize]
        public async Task SendMessageToReceiver(string sender, string receiver, string message)
        {
            var receiverUser = _db.Users.FirstOrDefault(u => u.Email!.ToLower() == receiver.ToLower());
            var senderUser = _db.Users.FirstOrDefault(u => u.Email!.ToLower() == sender.ToLower());

            if (receiverUser == null)
            {
                await Clients.User(senderUser!.Id).SendAsync("UserNotFound", receiver.ToLower());
            }
            else
            {
                await Clients.User(receiverUser.Id).SendAsync("MessageReceived", sender, message);
            }
        }
    }
}
