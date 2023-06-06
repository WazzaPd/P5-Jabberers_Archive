# Jabberbers Archive: Joseph Wu, Aahan Mehta, Jeremy Kwok
# SoftDev
# Period 08
# June 2023

# import sqlite3  # for database building
import sqlite3

from flask import Flask # facilitate flask webserving
from flask import render_template  # facilitate jinja templating
from flask import request  # facilitate form submission
from flask import session  # facilitate user sessions\
from flask import redirect
from flask import url_for
import os

app = Flask(__name__) # create Flask object
app.secret_key = os.urandom(32)     #randomized string for SECRET KEY (for interacting with operating system)

dirname = os.path.dirname(__file__)

#-------------------------DataBase-------------------------
DB_FILE = "tables.db"
db = sqlite3.connect(DB_FILE, check_same_thread=False)
c = db.cursor()  # facilitate db ops -- you will use cursor to trigger db events

# two tables: users, leaderboard
c.execute(
    "CREATE TABLE IF NOT EXISTS users(username TEXT, password TEXT)")
c.execute(
    "CREATE TABLE IF NOT EXISTS leaderboard(username TEXT, score TEXT)")
db.commit()  # save changes
#-------------------------DataBase-------------------------

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game')
def game():
    return render_template('game.html')

if __name__ == "__main__":  # false if this file imported as module
    # enable debugging, auto-restarting of server when this file is modified
    app.debug = True
    app.run()