import os
import json

from flask import Flask, render_template, redirect, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Global var db for maintain datd and save data a.k.a database if need to restart server
with open("./static/db.json") as f:
    db = json.load(f)


@app.route("/")
def index():
    # Check DisplayName пускать или создавать новое
    return redirect("/signin")


@app.route("/signin", methods=["GET", "POST"])
def signin():
    return render_template("signin.html")


@app.route("/talks", methods=["GET", "POST"])
def talks():
    # db = json.dumps(database)
    # channel = db["channels"]
    # db["channels"][0]["channel_name"] = "MY Chan!"
    # c = {"channel_name": "ch3"}
    # db["channels"].append(c)
    # db["channels"].pop(0)

    return render_template("talks.html", channels=db["channels"])


# for admin to save db if you need to restart web-server
@app.route("/save")
def save():
    with open("./static/db.json", "w") as f:
        f.write(json.dumps(db))
    return "200"


# Функция для получения актуального списка каналов
def getchannel_names():
    channel_names = []
    for channel in db["channels"]:
        channel_names.append(channel["channel_name"])
    return channel_names


@socketio.on("add channel")
def add_channel(data):
    channel_name = data["channel_name"]
    channel_names = getchannel_names()
    if channel_name in channel_names:
        emit("exist channel_name", broadcast=True)
    else:
        db["channels"].append({"channel_name": channel_name, "messages": {}})
        channel_names = getchannel_names()
        emit("new channel_name", channel_names, broadcast=True)


# Route to view the channel data
@app.route("/<channel_name>")
def view(channel_name):
    data = db["channels"]
    for channel in db["channels"]:
        if channel["channel_name"] == channel_name:
            messages = channel["messages"]
    return jsonify({"messages": messages})


#
