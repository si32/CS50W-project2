import os

from flask import Flask, render_template, redirect, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Global var for dnames
# dnames=["a", "Sergei"]

# Check DisplayName function
# def check_displayName():


@app.route("/")
def index():
    # Check DisplayName пускать или создавать новое
    return render_template("signin.html")


@app.route("/signin", methods=["GET", "POST"])
def signin():
    return redirect("/")


@app.route("/talks", methods=["GET", "POST"])
def talks():
    return render_template("talks.html")



# AJAX request for checking displayName
# @app.route("/check_dname", methods=["POST"])
# def check_dname(dname):
#     if dnames in dnames:
#         return jsonify({"success": False})
#     return jsonify({"success": True})
