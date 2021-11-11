using LiveChat.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LiveChat.Hubs
{
    public class ChatHub : Hub
    {
        static List<string> OnlineUsers = new List<string>();
        public async Task SendMessage(string connectionId, string message)
        {
            await Clients.Client(connectionId).SendAsync("ReceiveMessage", message, Context.ConnectionId);
        }

        public override async Task OnConnectedAsync()
        {
            OnlineUsers.Add(Context.ConnectionId);
            
            await Clients.All.SendAsync("UserConnected", OnlineUsers);

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            var user = OnlineUsers.FirstOrDefault(u => u == Context.ConnectionId);
            OnlineUsers.Remove(user);

            await Clients.All.SendAsync("UserDisconnected", OnlineUsers);

            await base.OnDisconnectedAsync(ex);
        }
        
        public List<string> GetAllActiveUsers()
        {
            return OnlineUsers;
        }
    }
}
