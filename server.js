const request = require('request');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const serverLink = process.env.SERVER_URL;

app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json());
app.use(cors());

const users = [];
const chats = [];

const defaultOnlineState = true;

// handle admin Telegram messages
app.post('/hook', function (req, res) {
    try {
        
        if (!req.body.callback_query) {
            const message = req.body.message || req.body.channel_post;
            const chatId = message.chat.id;
            const name = message.from.first_name || message.chat.title || 'admin';
            const text = message.text || '';
            const reply = message.reply_to_message;
            
            console.log('< ' + text);
            
            if (text.startsWith('/start')) {
                console.log('/start chatId ' + chatId);
                sendTelegramMessage(chatId,
                    'Уникальный id чата: `' + chatId + '`\n' +
                    
                    '*Команды:*\n' +
                    '`/start` - Запуск бота\n' +
                    '`/all [any_text]` - Сообщение всем online пользователям\n' +
                    '`/who` -  Список online пользователей\n' +
                    '`/online` - Установить online статус (Открыть виджет)\n' +
                    '`/offline` - Установить offline статус (Закрыть виджет)\n' +
                    '`/ban [name]` - Забанить пользователя\n' +
                    '`/unban [name]` - Разбанить пользователя\n' +
                    '`/user [name]` - Посмотреть информацию о пользователе\n'
                    ,
                    'Markdown');
            }
            
            if (text.startsWith('/who')) {
                
                console.log('/who');
                const usersOnline = users.filter(user => user.chatId === chatId && user.online);
                if (usersOnline.length) {
                    sendTelegramMessage(chatId,
                        '**Online пользователи**\n' +
                        usersOnline.map(user => '- `' + user.userId + '`').join('\n'),
                        'Markdown');
                } else {
                    sendTelegramMessage(chatId, '**Нет online пользователей** 🌵');
                }
                
            }
            
            if (text.startsWith('/online')) {
                console.log('/online chatId ' + chatId);
                const chatIndex = chats.findIndex(chat => chat.chatId === chatId);
                if (chats[chatIndex]) {
                    chats[chatIndex].online = true;
                } else {
                    chats.push({
                        chatId: chatId,
                        online: true,
                    });
                }
                sendTelegramMessage(chatId, 'Статус чата установлен на *online* 🟢, теперь он будет виден всем пользователям сайта', 'Markdown');
            }
            
            if (text.startsWith('/offline')) {
                console.log('/offline chatId ' + chatId);
                const chatIndex = chats.findIndex(chat => chat.chatId === chatId);
                if (chats[chatIndex]) {
                    chats[chatIndex].online = false;
                } else {
                    chats.push({
                        chatId: chatId,
                        online: false,
                    });
                }
                sendTelegramMessage(chatId, 'Статус чата установлен на *offline* 🔴', 'Markdown');
            }
            
            if (text.startsWith('/all')) {
                const message = text.replace(/^\/all(@?\w+)? /, '');
                console.log('/all ' + message);
                io.emit(chatId, {
                    name: name,
                    text: message,
                    from: 'admin',
                });
            }
            
            if (text.startsWith('/ban')) {
                const userId = text.replace(/^\/ban(@?\w+)? /, '');
                
                if (userId === '') {
                    sendTelegramMessage(chatId, 'Введите имя пользователя, например:`/ban guest-user-01`', 'Markdown');
                }
                
                const userIndex = users.findIndex(user => user.userId === userId && user.chatId === chatId);
                if (users[userIndex]) {
                    users[userIndex].banned = true;
                    sendTelegramMessage(chatId, 'Пользователь с ником *' + userId + '* помещен в бан ⛔', 'Markdown');
                } else {
                    sendTelegramMessage(chatId, 'Пользователь не найден или не удалось поместить его в бан.', 'Markdown');
                }
            }
            
            if (text.startsWith('/unban')) {
                const userId = text.replace(/^\/unban(@?\w+)? /, '').trim();
                const userIndex = users.findIndex(user => user.userId === userId && user.chatId === chatId);
                if (userIndex !== -1) {
                    users[userIndex].banned = false;
                    sendTelegramMessage(chatId, 'Пользователь с ником *' + userId + '* снова может общаться в чате.', 'Markdown');
                } else {
                    sendTelegramMessage(chatId, 'Пользователь не найден или не удалось его разбанить.', 'Markdown');
                }
            }
            
            
            if (text.startsWith('/user')) {
                const userId = text.replace(/^\/user(@?\w+)? /, '');
                const user = users.find(user => user.userId === userId && user.chatId === chatId);
                if (user) {
                    const CustomData = user.CustomData || {};
                    const username = user.CustomData.username || userId;
                    const CustomMsg = `\`${username}\`\n\n${Object.entries(CustomData).map(([label, value]) => `${label.trim()} : \`${value.trim()}\``).join('\n')}`;
                    sendTelegramMessage(chatId, CustomMsg, 'Markdown');
                } else {
                    sendTelegramMessage(chatId, 'Пользователь не найден', 'Markdown');
                }
            }
            
            if (text.startsWith('/test')) {
                const inlineKeyboard = [
                    [
                        {text: 'Button 1', callback_data: 'button_1'},
                        {text: 'Button 2', callback_data: 'button_2'},
                    ],
                    [
                        {text: 'Button 3', callback_data: 'button_3'},
                        {text: 'Button 4', callback_data: 'button_4'},
                    ],
                    [
                        {text: 'Button 5', callback_data: 'button_5'},
                    ],
                ];
                sendTelegramMessage(
                    chatId,
                    'What todo with the user?🔥\n\n',
                    'Markdown',
                    false,
                    inlineKeyboard,
                );
            }
            
            if (reply && text) {
                const replyText = reply.text || '';
                const userId = replyText.split(':')[0];
                const userIndex = users.findIndex(user => user.userId === userId && user.chatId === chatId);
                
                console.log(userId);
                
                if (users[userIndex]) {
                    if (users[userIndex].online) {
                        io.emit(chatId + '-' + userId, {name, text, from: 'admin'});
                    } else {
                        users[userIndex].messages.push({
                            name: name,
                            text: text,
                            time: new Date,
                            from: 'admin',
                        });
                    }
                }
            }
            
        } else {
            const callbackQuery = req.body.callback_query;
            console.log(callbackQuery);
            const chatId = callbackQuery.message.chat.id;
            const data = callbackQuery.data;
            
            switch (data) {
                case 'button_1':
                    sendTelegramMessage(chatId, 'You clicked Button 1!');
                    break;
                case 'button_2':
                    sendTelegramMessage(chatId, 'You clicked Button 2!');
                    break;
                default:
                    break;
            }
            
            // Respond to the callback query to acknowledge receipt
            request.post('https://api.telegram.org/bot' + process.env.TELEGRAM_TOKEN + '/answerCallbackQuery')
                   .form({
                       callback_query_id: callbackQuery.id,
                   })
                   .on('response', function (response) {
                       console.log('telegram callback response:', response.statusCode);
                   });
        }
        
    } catch (e) {
        console.error('hook error', e, req.body);
    }
    res.statusCode = 200;
    res.end();
});

// handle chat visitors websocket messages
io.on('connection', function (client) {
    
    client.on('register', function (registerMsg) {
        
        const userId = registerMsg.userId;
        const chatId = parseInt(registerMsg.chatId);
        const CustomData = registerMsg.CustomData;
        
        console.log('useId ' + userId + ' connected to chatId ' + chatId);
        
        const CustomMsg = `\`${userId}\`: *присоединился*\n\n`;
        let CustomMsgData = '';
        
        if (CustomData) {
            CustomMsgData = `${Object.entries(CustomData).map(([label, value]) => `${label}: ${value}`).join('\n')}`;
        }
        
        sendTelegramMessage(chatId, `${CustomMsg}${CustomMsgData}`, 'Markdown', true);
        
        
        const userIndex = users.findIndex(user => user.userId === userId && user.chatId === chatId);
        if (users[userIndex]) {
            if (users[userIndex].banned) {
                client.disconnect();
                return;
            }
            
            users[userIndex].online = true;
            users[userIndex].messages.forEach(message => io.emit(chatId + '-' + userId, message));
            users[userIndex].messages = [];
            if (users[userIndex].active) {
                sendTelegramMessage(chatId, '`' + userId + '` *вернулся*', 'Markdown', true);
            }
        }
        
        client.on('message', function (msg) {
            
            const userIndex = users.findIndex(user => user.userId === userId && user.chatId === chatId);
            if (users[userIndex] && users[userIndex].banned) {
                client.disconnect();
                return;
            }
            io.emit(chatId + '-' + userId, msg);
            
            console.log('> ' + msg.text);
            
            if (msg.text === '/help') {
                io.emit(chatId + '-' + userId, {
                    text: registerMsg.helpMsg || 'help is coming😭',
                    from: 'admin',
                });
                return;
            }
            
            
            let visitorName = msg.visitorName ? '[' + msg.visitorName + ']: ' : '';
            
            sendTelegramMessage(chatId, '`' + userId + '`:' + visitorName + ' ' + msg.text, 'Markdown');
            
            
            if (users[userIndex]) {
                users[userIndex].active = true;
                if (users[userIndex].unactiveTimeout) {
                    clearTimeout(users[userIndex].unactiveTimeout);
                }
            } else {
                users.push({
                    userId: userId,
                    chatId: chatId,
                    online: true,
                    active: true,
                    banned: false,
                    messages: [],
                    CustomData: CustomData || {},
                });
            }
        });
        
        client.on('disconnect', function () {
            const userIndex = users.findIndex(user => user.userId === userId && user.chatId === chatId);
            if (users[userIndex]) {
                users[userIndex].online = false;
                if (users[userIndex].active) {
                    users[userIndex].unactiveTimeout = setTimeout(() => {
                        users[userIndex].active = false;
                    }, 60000);
                    if (!users[userIndex].banned) {
                        sendTelegramMessage(chatId, '`' + userId + '` *покинул чат*', 'Markdown', true);
                    }
                }
            }
        });
    });
    
});

function sendTelegramMessage(chatId, text, parseMode, disableNotification, inlineKeyboard) {
    const options = {
        'chat_id': chatId,
        'text': text,
        'parse_mode': parseMode,
        'disable_notification': !!disableNotification,
    };
    
    if (inlineKeyboard) {
        options.reply_markup = JSON.stringify({
            inline_keyboard: inlineKeyboard,
        });
    }
    
    request
        .post('https://api.telegram.org/bot' + process.env.TELEGRAM_TOKEN + '/sendMessage')
        .form(options)
        .on('response', function (response) {
            console.log('telegram status code:', response.statusCode);
        });
}

app.post('/usage-start', function (req, res) {
    const chatId = parseInt(req.body.chatId);
    const host = req.body.host;
    
    let chat = chats.find(chat => chat.chatId === chatId);
    if (!chat) {
        chat = {
            chatId: chatId,
            online: defaultOnlineState,
        };
        chats.push(chat);
    }
    
    console.log('usage chat ' + chatId + ' (' + (chat.online ? 'online' : 'offline') + ') from ' + host);
    res.statusCode = 200;
    res.json({
        online: chat.online,
    });
});

// left here until the cache expires
app.post('/usage-end', function (req, res) {
    res.statusCode = 200;
    res.end();
});

app.get('/status', function (req, res) {
    const currentTime = new Date().toISOString();
    res.statusCode = 200;
    res.send({
        status: 'ok',
        pingTime: currentTime,
    });
    console.log({
        status: 'ok',
        pingTime: currentTime,
    });
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname.concat('/index.html')))
});

http.listen(process.env.PORT || 3000, function () {
    console.log('listening on port:' + (process.env.PORT || 3000));
});

app.get('/.well-known/acme-challenge/:content', (req, res) => {
    res.send(process.env.CERTBOT_RESPONSE);
});
