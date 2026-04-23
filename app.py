from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
last_topic = None
last_intent = None

def get_bot_response(user_message):
    global last_topic, last_intent
    message = user_message.lower().strip()

    # 🔹 If user says YES after planning question
    if last_intent == "offer_planning" and message in ["yes", "yeah", "yup", "sure"]:
        last_intent = "planning_started"
        return (
            "Great! Let's organize your tasks 📋\n"
            "1. List all your deadlines\n"
            "2. Sort them by urgency\n"
            "3. Start with the easiest task first\n"
            "4. Take short breaks in between\n"
            "You’ve got this 💪"
        )

    # 🔹 Detect stress/anxiety
    if any(word in message for word in ["anxious", "anxiety", "stress", "stressed"]):
        last_topic = "anxiety"

        if any(word in message for word in ["deadline", "exam", "college", "work"]):
            last_intent = "offer_planning"
            return (
                "That sounds really stressful 💙. Managing multiple deadlines can feel overwhelming.\n"
                "Try breaking your work into small tasks and prioritizing one thing at a time.\n"
                "Would you like help planning your tasks?"
            )

        return (
            "I'm sorry you're feeling anxious 💙. Try taking slow deep breaths.\n"
            "I'm here for you. Want to talk about what's causing it?"
        )

    # 🔹 Follow-up help
    elif last_topic == "anxiety" and any(word in message for word in ["what", "how", "deal", "cope"]):
        return (
            "Here are some ways to manage anxiety 💙:\n"
            "• Break tasks into smaller steps\n"
            "• Take short breaks\n"
            "• Avoid multitasking\n"
            "• Talk to someone you trust\n"
            "You're doing your best 🌿"
        )

    # 🔹 Greetings
    elif any(word in message for word in ["hello", "hi", "hey"]):
        return "Hello! 👋 How can I help you today?"

    # 🔹 Time
    elif any(word in message for word in ["time", "date"]):
        from datetime import datetime
        now = datetime.now().strftime("%I:%M %p, %B %d %Y")
        return f"🕐 Current time is: {now}"

    # 🔹 Default
    else:
        return "I'm here to listen 💙. Tell me what's on your mind."

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").strip()
    if not user_message:
        return jsonify({"response": "Please type something! 😊"})
    bot_reply = get_bot_response(user_message)
    return jsonify({"response": bot_reply})

import os
if __name__ == "__main__":
    app.run(debug=True)
