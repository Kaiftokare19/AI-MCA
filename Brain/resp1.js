// Theme toggle: Switch between dark and light mode when the emoji is clicked.
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    // Update the emoji: if in light mode, show moon emoji; otherwise, sun emoji.
    if (document.body.classList.contains('light-mode')) {
        themeToggle.textContent = '🌙';
    } else {
        themeToggle.textContent = '☀️';
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-response");
    const initialMessage = `<div class="chat-message bot">Hello! I am Dr.Neurologist 🤖. How can I assist you with your Brain disease-related queries today?</div>`;
    chatBox.innerHTML = initialMessage;
});

document.getElementById("user-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault(); // Prevents default action (if any)
        sendMessage();
    }
});

async function sendMessage() {
    const userInputField = document.getElementById("user-input");
    const userInput = userInputField.value.trim();
    if (!userInput) return;

    const chatBox = document.getElementById("chat-response");

    // Append user message (right aligned)
    chatBox.innerHTML += `<div class="chat-message user">${userInput}</div>`;
    userInputField.value = "";

    const requestData = { query: userInput };

    try {
        const response = await fetch("https://eca2-152-58-29-211.ngrok-free.app/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(requestData),
            credentials: "omit",  // Added per configuration
            mode: "cors"
        });

        if (!response.ok) {
            console.error('Response status:', response.status);
            console.error('Response headers:', [...response.headers]);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        let responseText = data.response;

        // Extract text after "Doctor:" if it exists
        const doctorIndex = responseText.indexOf("Doctor:");
        if (doctorIndex !== -1) {
            responseText = responseText.substring(doctorIndex + "Doctor:".length).trim();
        }

        // Append bot response (left aligned)
        chatBox.innerHTML += `<div class="chat-message bot">${responseText}</div>`;

        // Auto-scroll: even though the scroll bar is hidden, ensure latest messages are visible
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error("Error details:", error);
        chatBox.innerHTML += `<div class="chat-message bot">Error occurred while sending message</div>`;
    }
}

