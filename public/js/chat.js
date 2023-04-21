const username = document.getElementById('username').textContent;
const messageContainer = document.querySelector('.message-container');

const socket = io();

socket.emit('joinRoom', 'Fake Room', username);
socket.emit('get-prev-messages');

const form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (input.value) {
        message_data = {
            room: 'Fake Room',
            username: username,
            message: input.value,
        }
        socket.emit('message', message_data);

        var item = document.createElement('li');
        item.classList.add('sender');
        item.textContent = message_data.message;
        messages.appendChild(item);
        messageContainer.scrollTop = messageContainer.scrollHeight;
        input.value = '';
    }
});


socket.on('prevMessages', (data) => {
    console.log('Here are the messages', data);
    data.forEach((dataRow) => {
        let message = document.createElement('div');
        let messageHeader = document.createElement('div');
        messageHeader.classList.add('username-time');
        if (dataRow.username == username) {
            message.classList.add('sender');
        } else {
            message.classList.add('recipient');
            // Add the username to the message
            let usernameDiv = document.createElement('div');
            usernameDiv.classList.add('username');
            usernameDiv.textContent = dataRow.username;
            messageHeader.appendChild(usernameDiv);
        }


        let timeDiv = document.createElement('div');
        timeDiv.classList.add('time');
        timeDiv.textContent = dataRow.time_stamp;

        console.log(dataRow);
        let item = document.createElement('li');
        item.textContent = dataRow.message;

        messageHeader.appendChild(timeDiv);
        console.log('Message header:', messageHeader)



        // message.innerHTML = dataRow.message + messageHeader.outerHTML;
        message.appendChild(messageHeader);
        message.append(item);
        messages.appendChild(message);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    });
});



socket.on('message', (data) => {
    displayMessage(data);
    // console.log(data);
    // var item = document.createElement('li');
    // if (data.username == username) {
    //     item.classList.add('sender');
    // } else {
    //     item.classList.add('recipient');
    // }
    // item.textContent = data.message;
    // messages.appendChild(item);
    // window.scrollTo(0, document.body.scrollHeight);
});


function displayMessage(dataRow) {
    let message = document.createElement('div');
    let messageHeader = document.createElement('div');
    messageHeader.classList.add('username-time');
    if (dataRow.username == username) {
        message.classList.add('sender');
    } else {
        message.classList.add('recipient');
        // Add the username to the message
        let usernameDiv = document.createElement('div');
        usernameDiv.classList.add('username');
        usernameDiv.textContent = dataRow.username;
        messageHeader.appendChild(usernameDiv);
    }


    let timeDiv = document.createElement('div');
    timeDiv.classList.add('time');
    timeDiv.textContent = dataRow.time_stamp;

    console.log(dataRow);
    let item = document.createElement('li');
    item.textContent = dataRow.message;

    messageHeader.appendChild(timeDiv);
    console.log('Message header:', messageHeader)



    // message.innerHTML = dataRow.message + messageHeader.outerHTML;
    message.appendChild(messageHeader);
    message.append(item);
    messages.appendChild(message);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}


