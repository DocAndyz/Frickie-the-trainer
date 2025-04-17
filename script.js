// Function to append a new message to the chat window
function appendMessage(message, sender) {
    const chatWindow = document.getElementById('chat-window');
    const div = document.createElement('div');
    div.classList.add('message');
    div.classList.add(sender + '-message');
    div.textContent = message;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Send user message to backend and display bot response
async function sendMessageToBackend(userMessage) {
    const response = await fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMessage }),
    });
    const data = await response.json();
    return data.reply;
}

// Event listener for sending user message
document.getElementById('send-btn').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim()) {
        appendMessage(userInput, 'user');
        document.getElementById('user-input').value = '';
        const botReply = await sendMessageToBackend(userInput);
        appendMessage(botReply, 'bot');
    }
});

// Allow pressing "Enter" to send the message
document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('send-btn').click();
    }
});