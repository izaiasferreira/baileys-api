document.addEventListener('DOMContentLoaded', transformChatHTML());


function showRandomButton() {
    var button = document.querySelector('#cattalk-external-chat-button-show');
    var chat = document.querySelector('#cattalk-external-chat-content');
    var value = chat.classList.value;
    if (value === 'cattalk-external-chat-unshow') {
        chat.classList.replace('cattalk-external-chat-unshow', 'cattalk-external-chat-showing');
        button.classList.replace('cattalk-external-chat-button-showing', 'cattalk-external-chat-unshow');
    } else {
        chat.classList.replace('cattalk-external-chat-showing', 'cattalk-external-chat-unshow');
        button.classList.replace('cattalk-external-chat-unshow', 'cattalk-external-chat-button-showing');
    }
}
function transformChatHTML() {
    var chatContainer = document.querySelector('.cattalk-external-chat-container');

    var chatFrame = chatContainer.querySelector('iframe');

    var closeButton = document.createElement('div');
    closeButton.id = 'cattalk-external-chat-button-close';
    closeButton.className = 'cattalk-external-chat-button-close';
    closeButton.setAttribute('onClick', 'showRandomButton()');
    closeButton.innerHTML = '<i class="bx bx-x-circle"></i>';

    var showButton = document.createElement('div');
    showButton.id = 'cattalk-external-chat-button-show';
    showButton.className = 'cattalk-external-chat-button-showing';
    showButton.setAttribute('onClick', 'showRandomButton()');
    showButton.innerHTML = '<i class="bx bxs-message"></i><div class="cattalk-external-chat-initial-message-unshow">Está com alguma dúvida? Converse com a gente.</div>';

    var chatContent = chatContainer.querySelector('#cattalk-external-chat-content');

    chatContent.innerHTML = ""


    chatContent.appendChild(closeButton);
    chatContent.appendChild(chatFrame);
    chatContainer.appendChild(chatContent);
    chatContainer.appendChild(showButton);
    showInitialMessage()

}

function showInitialMessage() {
    setTimeout(() => {
        var message = document.querySelector('.cattalk-external-chat-initial-message-unshow');
        message.classList.replace('cattalk-external-chat-initial-message-unshow', 'cattalk-external-chat-initial-message');
    }, 2000)
    var initialMessage = document.querySelector('#cattalk-external-chat-button-show')
    initialMessage.addEventListener('mouseleave', () => {
        var message = document.querySelector('.cattalk-external-chat-initial-message');
        message?.classList.replace('cattalk-external-chat-initial-message', 'cattalk-external-chat-initial-message-unshow');
    });
    initialMessage.addEventListener('click', () => {
        var message = document.querySelector('.cattalk-external-chat-initial-message');
        message?.classList.replace('cattalk-external-chat-initial-message', 'cattalk-external-chat-initial-message-unshow');
    });
}