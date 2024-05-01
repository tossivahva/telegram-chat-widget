// Configuration object with default values for the chat widget
export const defaultConfiguration = {
    // Use an external button to toggle the chat box
    useExternalButton: false,

    // Title displayed when the chat is closed
    titleClosed: 'Час с поддержкой',

    // Title displayed when the chat is open
    titleOpen: 'Ges Computers Поддержка',

    // Style when the chat is closed, options: 'button' or 'chat'
    closedStyle: 'button',

    // Avatar URL to be displayed in the closed chat (only used if closedStyle is set to 'chat')
    closedChatAvatarUrl: '',

    // Expiration time for the chat cookie in days. Once opened, the closed chat title will be shown as a button.
    // This is relevant when closedStyle is set to 'chat'.
    cookieExpiration: 1,

    // Introductory message displayed to the user upon opening the chat
    introMessage: 'Здравствуйте! Пока устанавливается соединение с первым освободившимся менеджером Вы можете сообщите нам, как мы можем помочь вам сегодня?',

    // Automatic help massage response
    helpMessage: 'the admin did not setup a /help response, so please wait',

    // Automatic response message displayed to the user when connecting to an admin
    autoResponse: 'Соединяем с менеджером поддержки',

    // Automatic response message displayed to the user when no admin is available
    autoNoResponse: 'Похоже сейчас нет свободных менеджеров. Пожалуйста оставьте свои контакты и первый освободившийся менеджер свяжется с Вами.',

    // Placeholder text shown in the input field where the user can type their message
    placeholderText: 'Напишите сообщение...',

    // Whether to display the timestamp for each chat message
    displayMessageTime: true,

    // Whether to display a banner at the top of the chat window
    displayBanner: true,

    // Main color used for the chat widget (e.g., buttons, UI elements)
    mainColor: '#1473e6',

    // Whether to always use a floating button for the chat, even when it's open
    alwaysUseFloatingButton: true,

    // Height of the chat window on desktop devices
    desktopHeight: 500,

    // Width of the chat window on desktop devices
    desktopWidth: 370,

    // Whether to enable human-readable IDs, e.g., "Guest:uh7k2z"
    humanReadableIds: false
};
