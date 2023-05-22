// Create Connection
var connectionNotification = new signalR.HubConnectionBuilder().withUrl("/hubs/notification").build();

// Invoke SendMessage method from Hub
document.getElementById("sendButton").addEventListener("click", function (event) {
    var message = document.getElementById("notificationInput").value;
    connectionNotification.send("SendMessage", message).then(function () {
        document.getElementById("notificationInput").value = "";
    });
    event.preventDefault();
})

// Register LoadNotification handler method
connectionNotification.on("LoadNotification", function (message, counter) {
    document.getElementById("messageList").innerHTML = ""; 
    var notificationCounter = document.getElementById("notificationCounter");
    notificationCounter.innerHTML = "<span>(" + counter + ")</span>";
    for (let i = message.length - 1; i >= 0; i--) {
        var li = document.createElement("li");
        li.textContent = "Notifcaiton - " + message[i];
        document.getElementById("messageList").appendChild(li);
    }
});


// Start Connection  
connectionNotification.start().then(function () {
    connectionNotification.send("LoadMessages");
});