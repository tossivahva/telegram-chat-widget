# Telegram Chat Widget

The **Telegram Chat Widget** is a free and customizable tool forked from idoco/intergram that lets website owners add a chat feature to their sites. Visitors can use it to talk to the website owners through Telegram. It's an easy way for websites to have real-time conversations with their users.


### Bot commands
- `/start` - Link between the embedded chat and this telegram chat
- `/all [any_text]` - Send message to all online users
- `/who` - Get users list who are online now
- `/online` - Set online status for the chat. Widget is shown for users
- `/offline` - Set offline status for the chat. Widget is hidden for users
- `/ban [name]` - Ban user
- `/unban [name]` - Unban user
- `/user [name]` - To view the users data
- `/info` - more information about the bot
- `/help` - instructions on how to setup



### Using an external button
```html
<!-- Make sure to use the id toggleChatButton-->
<div>
  <button type="button" id="toggleChatButton">Toggle chat</button>
</div>

<!-- Add this script above the intergram script -->
<script>
  document.getElementById("toggleChatButton").addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("chatToggled", { detail: true }))
  });
// set to the useExternalButton to true to hide the overlay widget
window.intergramCustomizations = {
  useExternalButton: true
  // rest of the customizations...
}
</script>
```

### Customization
Currently you can customize all visible texts and the main widget color by setting an optional `intergramCustomizations` object in the injection script tag. (**All its properties are also optional and will fallback to their original values**)
```html
<script> 
  window.intergramId = "Your unique chat id";
  window.intergramCustomizations = {
    // Use an external button to toggle the chat box
    useExternalButton: false,
    // Title displayed when the chat is closed
    titleClosed: 'Click to chat!',
    // Title displayed when the chat is open
    titleOpen: 'Let\'s chat!',
    // Style when the chat is closed, options: 'button' or 'chat'
    closedStyle: 'chat',
    // Avatar URL to be displayed in the closed chat (only used if closedStyle is set to 'chat')
    closedChatAvatarUrl: '',
    // Expiration time for the chat cookie in days. Once opened, the closed chat title will be shown as a button.
    // This is relevant when closedStyle is set to 'chat'.
    cookieExpiration: 1,
    // Introductory message displayed to the user upon opening the chat
    introMessage: 'Hello! How can we help you?',
    // Automatic help massage response
    helpMessage: 'The admin did not setup a /help response, so please wait',
    // Automatic response message displayed to the user when connecting to an admin
    autoResponse: 'Looking for the first available admin (It might take a minute)',
    // Automatic response message displayed to the user when no admin is available
    autoNoResponse: 'It seems that no one is available to answer right now. Please tell us how we can contact you, and we will get back to you as soon as we can.',
    // Placeholder text shown in the input field where the user can type their message
    placeholderText: 'Send a message...',
    // Whether to display the timestamp for each chat message
    displayMessageTime: true,
    // Whether to display a banner at the top of the chat window
    displayBanner: true,
    // Main color used for the chat widget (e.g., buttons, UI elements)
    mainColor: '#1f8ceb',
    // Whether to always use a floating button for the chat, even when it's open
    alwaysUseFloatingButton: false,
    // Height of the chat window on desktop devices
    desktopHeight: 500,
    // Width of the chat window on desktop devices
    desktopWidth: 370,
    // Whether to enable human-readable IDs, e.g., "Guest:uh7k2z"
    humanReadableIds: false
}
</script>
<script id="intergram" type="text/javascript" src="https://<your_bot_url>/js/widget.js"></script>
```
