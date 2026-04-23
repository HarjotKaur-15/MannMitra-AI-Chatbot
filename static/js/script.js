// ===== UTILITY: Get current time =====
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ===== Set initial message timestamp =====
document.getElementById("initTime").textContent = getCurrentTime();

// ===== SEND MESSAGE =====
async function sendMessage() {
  const input = document.getElementById("userInput");
  const userText = input.value.trim();

  if (!userText) return;

  // Show user message
  appendMessage(userText, "user");
  input.value = "";

  // Show typing indicator
  const typingId = showTyping();

  try {
    // Send to Flask backend
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText })
    });

    const data = await response.json();

    // Remove typing indicator & show bot reply
    removeTyping(typingId);
    appendMessage(data.response, "bot");

  } catch (error) {
    removeTyping(typingId);
    appendMessage("⚠️ Error connecting to server. Is Flask running?", "bot");
  }
}

// ===== APPEND MESSAGE TO CHAT =====
function appendMessage(text, sender) {
  const chatBox = document.getElementById("chatMessages");

  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");

  const bubble = document.createElement("span");
  bubble.classList.add("bubble");
  bubble.innerHTML = text;

  const time = document.createElement("span");
  time.classList.add("timestamp");
  time.textContent = getCurrentTime();

  msgDiv.appendChild(bubble);
  msgDiv.appendChild(time);
  chatBox.appendChild(msgDiv);

  // Auto scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ===== TYPING INDICATOR =====
function showTyping() {
  const chatBox = document.getElementById("chatMessages");

  const typingDiv = document.createElement("div");
  const id = "typing-" + Date.now();
  typingDiv.id = id;
  typingDiv.classList.add("message", "bot-message", "typing-indicator");

  typingDiv.innerHTML = `
    <span class="bubble">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </span>`;

  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// ===== ENTER KEY SUPPORT =====
document.getElementById("userInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});
