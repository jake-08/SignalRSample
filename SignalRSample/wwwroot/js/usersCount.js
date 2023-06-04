
// Create Connection to SignalR Hub using the route provided in Program.cs 
var connectionUserCount = new signalR.HubConnectionBuilder()
    //.configureLogging(signalR.LogLevel.Information)
    .withUrl("/hubs/userCount", signalR.HttpTransportType.WebSockets).build();

// Connect to methods that hub invokes aka receive notifications from hub
connectionUserCount.on("updateTotalViews", (value) => {
    var newCountSpan = document.getElementById("totalViewsCounter");
    newCountSpan.innerText = value.toString();
});

connectionUserCount.on("updateTotalUsers", (value) => {
    var newCountSpan = document.getElementById("totalUsersCounter");
    newCountSpan.innerText = value.toString();
});

// Invoke hub methods aka send notification to hub
function newWindowLoadedOnClient() {
    connectionUserCount.invoke("NewWindowLoaded", "Home Page").then((value) => console.log(value));
}

// Start Connection
function fulfilled() {
    console.log("Connection to User Hub Successful");
    newWindowLoadedOnClient(); 
}

function rejected() {

}

connectionUserCount.start().then(fulfilled, rejected);