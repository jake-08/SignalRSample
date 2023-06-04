// Create Connection to SignalR Hub using the route provided in Program.cs
var connectionBasicChat = new signalR.HubConnectionBuilder().withUrl("/hubs/basicChat").build();

document.getElementById("sendMessage").disabled = true;

// Connect to methods that hub invokes aka receive notifications from hub
connectionBasicChat.on("MessageReceived", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    li.textContent = `${user} - ${message}`;
});

connectionBasicChat.on("UserNotFound", function (user) {
    toastr.error(`${user} - Not Found`);
});

// Invoke hub methods aka send notification to hub
document.getElementById("sendMessage").addEventListener("click", function (event) {
    var sender = document.getElementById("senderEmail").value;
    var message = document.getElementById("chatMessage").value;
    var receiver = document.getElementById("receiverEmail").value;

    // send message to receiver
    if (receiver.length > 0) {
        connectionBasicChat.send("SendMessageToReceiver", sender, receiver, message).catch(function (err) {
            return console.error(err.toString());
        });
    }
    // send message to all of the users
    else {
        connectionBasicChat.send("SendMessageToAll", sender, message).catch(function (err) {
            return console.error(err.toString());
        });
    }

    event.preventDefault();
});

// Start Connection
connectionBasicChat.start().then(function () {
    document.getElementById("sendMessage").disabled = false; 
});