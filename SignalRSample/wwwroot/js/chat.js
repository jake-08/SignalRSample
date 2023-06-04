// Create Connection to SignalR Hub using the route provided in Program.cs
var connectionChat = new signalR.HubConnectionBuilder().withUrl("/hubs/chat").withAutomaticReconnect([0, 1000, 5000, null]).build();

// Connect to methods that hub invokes aka receive notifications from hub
connectionChat.on("ReceiveUserConnected", function (userId, userName) {
    addMessage(`${userName} has opened a connection`);
});

connectionChat.on("ReceiveUserDisconnected", function (userId, userName) {
    addMessage(`${userName} has closed a connection`);
});

connectionChat.on("ReceiveAddRoomMessage", function (maxRoom, roomId, roomName, UserId, userName) {
    addMessage(`${userName} has created room ${roomName}`);
    fillRoomDropDown();
});

connectionChat.on("ReceiveDeleteRoomMessage", function (deleted, selected, roomName, userName) {
    addMessage(`${userName} has deleted room ${roomName}`);
});

connectionChat.on("ReceivePublicMessage", function (roomId, UserId, userName, message, roomName) {
    addMessage(`[Public Message - ${roomName}] ${userName} says ${message}`);
});

connectionChat.on("ReceivePrivateMessage", function (senderId, senderName, receiverId, receiverName, message, chatId) {
    addMessage(`[Private Message to ${receiverName}] - ${senderName} says ${message}`);
});

function sendPublicMessage() {
    let inputMsg = document.getElementById("txtPublicMessage");
    let ddlSelRoom = document.getElementById("ddlSelRoom");

    let roomId = ddlSelRoom.value;
    let roomName = ddlSelRoom.options[ddlSelRoom.selectedIndex].text;
    var message = inputMsg.value;

    connectionChat.send("SendPublicMessage", Number(roomId), message, roomName);
    inputMsg.value = "";
};

function sendPrivateMessage() {
    let inputMsg = document.getElementById("txtPrivateMessage");
    let ddlSelUser = document.getElementById("ddlSelUser");

    let receiverId = ddlSelUser.value;
    let receiverName = ddlSelUser.options[ddlSelUser.selectedIndex].text;
    var message = inputMsg.value;

    connectionChat.send("SendPrivateMessage", receiverId, message, receiverName);
    inputMsg.value = "";
};

function addNewRoom(maxRoom) {
    let createRoomName = document.getElementById("createRoomName");

    var roomName = createRoomName.value;

    if (roomName == null && roomName == "") {
        return;
    }

    //POST
    $.ajax({
        url: '/ChatRooms/PostChatRoom',
        dataType: "json",
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ id: 0, name: roomName }),
        async: true,
        processData: false,
        cache: false,
        success: function (json) {
            connectionChat.send("SendAddRoomMessage", maxRoom, json.id, json.name);
            createRoomName.value = "";
        },
        error: function (xhr) {
            alert('error');
        }
    });
};

function deleteRoom() {
    let ddlDelRoom = document.getElementById("ddlDelRoom");

    var roomName = ddlDelRoom.options[ddlDelRoom.selectedIndex].text;
    let roomId = ddlDelRoom.value;

    let text = `Do you want to delete Chat Room ${roomName}?`;
    if (confirm(text) == false) {
        return;
    }

    if (roomName == null && roomName == "") {
        return;
    }

    //POST
    $.ajax({
        url: `/ChatRooms/DeleteChatRoom/${roomId}`,
        dataType: "json",
        type: "DELETE",
        contentType: 'application/json;',
        async: true,
        processData: false,
        cache: false,
        success: function (json) {
            connectionChat.send("SendDeleteRoomMessage", json.deleted, json.selected, roomName);
            fillRoomDropDown();
        },
        error: function (xhr) {
            alert('error');
        }
    });
};

document.addEventListener("DOMContentLoaded", (event) => {
    fillRoomDropDown();
    fillUserDropDown();
});

function fillUserDropDown() {
    $.getJSON('/ChatRooms/GetChatUsers')
        .done(function (json) {
            var ddlSelUser = document.getElementById("ddlSelUser");

            ddlSelUser.innerText = null;

            json.forEach(function (item) {
                var newOption = document.createElement("option");

                newOption.text = item.userName;
                newOption.value = item.id;
                ddlSelUser.add(newOption);
            });
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + jqxhr.detail);
        });
};

function fillRoomDropDown() {
    $.getJSON('/ChatRooms/GetChatRooms')
        .done(function (json) {
            var ddlDelRoom = document.getElementById("ddlDelRoom");
            var ddlSelRoom = document.getElementById("ddlSelRoom");

            ddlDelRoom.innerText = null;
            ddlSelRoom.innerText = null;

            json.forEach(function (item) {
                var newOptionSelectRoom = document.createElement("option");

                newOptionSelectRoom.text = item.name;
                newOptionSelectRoom.value = item.id;
                ddlSelRoom.add(newOptionSelectRoom);

                var newOptionDeleteRoom = document.createElement("option");

                newOptionDeleteRoom.text = item.name;
                newOptionDeleteRoom.value = item.id;
                ddlDelRoom.add(newOptionDeleteRoom);
            })
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + jqxhr.detail);
        });
};

function addMessage(msg) {
    if (msg == null && msg == "") {
        return;
    }
    let ui = document.getElementById("messagesList");
    let li = document.createElement("li");
    li.innerHTML = msg;
    ui.appendChild(li);
};

// Start Connection
connectionChat.start();