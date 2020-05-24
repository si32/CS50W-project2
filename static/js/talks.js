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

            // clear input field and disabled button
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
        document.querySelector('.view_channels').innerHTML = "";
        var i;
        for (i = 0; i < channel_names.length; i++) {
            const radiobutton = document.createElement('div');
            radiobutton.className = "radio"
            radiobutton.innerHTML = `<input class="radio__input" name="${channel_names[i]}" id="${channel_names[i]}" type="radio" data-channel="${channel_names[i]}">
                <label class="radio__label"
                    for="${channel_names[i]}">${channel_names[i]}</label>`;
            document.querySelector('.view_channels').append(radiobutton);
            // нужно перезагрузить страницу иначе  html у страницы без новых радио и они не работают как надо
            location.reload();
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


// отображение сообщений канала
document.addEventListener('DOMContentLoaded', () => {

    // Start by loading local stored channel.
    channel_name = localStorage.getItem('channelName');
    if (channel_name != null) {
        load_channel(channel_name);
    }
    else {
        load_channel('welcome');
    }



    // Set links up to load new channels.
    document.querySelectorAll('.radio__input').forEach(radiobutton => {
        radiobutton.onclick = () => {
            load_channel(radiobutton.dataset.channel);
            // storage channel name in localStorage
            localStorage.setItem('channelName', radiobutton.dataset.channel);
            return false;
        };
    });
});

// Renders contents of new page in main view.
function load_channel(channel_name) {
    // чтобы отметить выбранный канал при загрузке страницы
    const r = document.querySelector(`#${channel_name}`);
    r.checked = true;

    const request = new XMLHttpRequest();
    request.open('GET', `/${channel_name}`);
    request.onload = () => {
        const response = JSON.parse(request.responseText);
        // console.log('responseText:' + request.responseText);
        // console.log('response:' + response.messages[0].message1.text);
        if (response.messages) {
            document.querySelector('.view').innerHTML = response.messages[0].message1.text;
        }
        else {
            document.querySelector('.view').innerHTML = "";
        }

        // надо опять отметить радиобатон а то не ставиться, не знаю почему (при смене канала без перезагрузки)
        // возможно не понадобится когда правильно сделаю сообщения.
        r.checked = true;


    };
    request.send();
}
