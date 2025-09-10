
from flask import Flask, request, jsonify
from deta import Deta
import os
import openai

app = Flask(__name__)

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

# Connect to Deta Base
deta = Deta(os.getenv("DETA_PROJECT_KEY"))
notes_db = deta.Base("notes")
memories_db = deta.Base("memories")

@app.route("/")
def home():
    return "NOVA AI is alive on Deta 🚀"

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "")
    if not message:
        return jsonify({"reply": "Say something 🙃"})
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=f"You are NOVA, a friendly AI assistant. User said: {message}\nReply:",
        max_tokens=100
    )
    reply = response.choices[0].text.strip()
    memories_db.put({"user_msg": message, "nova_reply": reply})
    return jsonify({"reply": reply})

@app.route("/add_note", methods=["POST"])
def add_note():
    data = request.get_json()
    note = data.get("note", "")
    if not note:
        return jsonify({"status": "empty note"})
    notes_db.put({"note": note})
    return jsonify({"status": "note saved"})

@app.route("/notes", methods=["GET"])
def get_notes():
    res = notes_db.fetch()
    notes = [{"id": item["key"], "note": item["note"]} for item in res.items]
    return jsonify(notes)

@app.route("/memories", methods=["GET"])
def get_memories():
    res = memories_db.fetch()
    memories = [{"id": item["key"], "user": item["user_msg"], "nova": item["nova_reply"]} for item in res.items]
    return jsonify(memories)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT",5000)))
