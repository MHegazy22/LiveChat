"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (message, recipient) {
    $("#messegesSection").append('<div class="recievedMessege">' + message + '</div><br /><br />');
    $("#recipient").val(recipient);
});

connection.on("UserConnected", function (users) {
    getOnlineUsers(users);
});

connection.on("UserDisconnected", function (users) {
    getOnlineUsers(users);
});

connection.on("GetAllActiveUsers", function (users) {
    var list = document.getElementById("users");

    var length = list.options.length;
    for (var i = length - 1; i >= 0; i--) {
        list.options[i] = null;
    }
    debugger
    $.map(users, function (item) {
        var option = document.createElement("option");
        option.text = item.name;
        option.value = item.connectionId;
        list.add(option);
    });
});
function getOnlineUsers(users) {
    
    $("#users").empty();
    $.map(users, function (item,i) {        
        
        $("#users").append(
            '<div id="' + item + '" class="row" onclick="sendTo(this)">' +
            '<img class="col-3" src="/images/userIcon.png" />' +
            '<label class= "col-9 text-left" ><strong>User ' + (i+1) + '</strong><br />' + item + '</label ></div><hr />'
        );
    });
}
connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});
function setUserName() {
    
    var userName = document.getElementById("userName").value;
    connection.invoke("SetUserName", userName).catch(function (err) {
        return console.error(err.toString());
    });
}
document.getElementById("sendButton").addEventListener("click", function (event) {
    
    var message = $("#messageInput").val();
    $("#messageInput").val("");
    var connectionId = $("#recipient").val();
    $("#messegesSection").append('<div class="sentMessege">' + message + '</div>');
    clearTimeout(initial);
    initial = setTimeout(redirect, 60000);
    connection.invoke("SendMessage", connectionId, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});