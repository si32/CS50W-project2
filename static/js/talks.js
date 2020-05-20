// Exit
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#exit').onclick = () => {
        localStorage.clear();
        window.location.replace('/');
    };

});

// Add new channel

document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
        document.querySelector('#add').onclick = () => {
            const channel_name = document.querySelector('#channel_name').value;
            document.querySelector('#channel_name').value = "";
            document.querySelector('#add').disabled = true;
            socket.emit('add channel', { 'channel_name': channel_name });
        };

    });

    // Если имя канала уже есть в списке на сервере, то предупреждаем
    socket.on('exist channel_name', () => {
        alert('This name has already exist!');
    });
    // Список каналов сохраняется на сервере и в ответ прилетает обновленный список каналов
    // Мы удаляем старый спиок и строим новый список
    socket.on('new channel_name', channel_names => {
        document.querySelector('#channels').innerHTML = "";
        var i;
        for (i = 0; i < channel_names.length; i++) {
            const li = document.createElement('li');
            li.innerHTML = channel_names[i];
            document.querySelector('#channels').append(li);
        }
    });
});

// Чтобы кнопка серая и нажимать enter можно было
document.addEventListener('DOMContentLoaded', () => {

    // By default button is disabled
    document.querySelector('#add').disabled = true;

    // Enable button only if there is text in input field
    document.querySelector('#channel_name').onkeyup = event => {
        if (document.querySelector('#channel_name').value.length > 0) {
            document.querySelector('#add').disabled = false;
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                // Cancel the default action, if needed
                event.preventDefault();
                // Trigger the button element with a click
                document.querySelector('#add').click();
            }
        }
        else {
            document.querySelector('#add').disabled = true;
        };
    };
});
