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

#check if leaderboard exists or not
c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", ('leaderboard',))
result = c.fetchone()

c.execute(
    "CREATE TABLE IF NOT EXISTS leaderboard(username TEXT, score INTEGER)")

#leaderboard placeholders
if result is None:
    for populate in range(10):
        c.execute(f"INSERT INTO {'leaderboard'} (username, score) VALUES (NULL, NULL)")

db.commit()  # save changes
#-------------------------DataBase-------------------------

def render_template_with_username(template):
    usernameStr = session.get('username', None)
    print("username is " + str(usernameStr) + " in render_template_with_username")
    return render_template(template, username=usernameStr)

@app.route('/',)
def index():
    return render_template_with_username('index.html')

@app.route('/game', methods = ["GET", "POST"])
def game():
    update_leaders('me', 500)
    c.execute("SELECT * FROM leaderboard ORDER BY score DESC")
    leaders=c.fetchall()
    return render_template('game.html', leader=leaders)

#-------------------------ACCOUNTS-------------------------
def check_username(username):
    c.execute("SELECT * FROM users WHERE username = ?", (username,))
    if c.fetchone():
        return True
    else:
        return False
    
def insert_account(username, password):
    c.execute("INSERT INTO users (username, password) VALUES (?, ?)",
              (username, password))
    db.commit()

@app.route("/register", methods=['POST'])
def register():

    # POST
    if request.method == 'POST':
        input_username = request.form['username']
        input_password = request.form['password']
        confirm_password = request.form['confirm_password']

        response = {
            'error': '',
            'success': ''
        }
        # if no registration info is inputted into the fields
        if input_username.strip() == '' or input_password.strip() == '' or confirm_password.strip() == '':
            # return json response instead of rendering template
            if input_username.strip() == '':
                response['error'] = "Please enter a username. \n"

            if input_password.strip() == '':
                response['error'] += "Please enter a password. \n"

            if confirm_password.strip() == '':
                response['error'] += "Please confirm your password. \n"

            if input_password.strip() != confirm_password.strip():
                response['error'] += "Passwords do not match. \n"

            response['success'] = "false"
            # return render_template_with_username('register.html', message=response['error'])
            # return home page with url params
            return redirect(f"/?error={response['error']}&modal=register")

            # if info is entered into fields
        else:
            # Checks for existing username in accounts table
            # var = (input_username,)
            # c.execute("select username from accounts where username=?", var)\

            if check_username(input_username):
                response['error'] = "username is already taken. Please select another username. \n"
                response['success'] = "false"
                return redirect(f"/?error={response['error']}&modal=register")

            # if username is not taken
            else:
                # if passwords match
                if input_password == confirm_password:
                    # insert into accounts table
                    insert_account(input_username, input_password)
                    response['success'] = "true"
                    session['username'] = input_username
                    return redirect(f"/?success=Successfully registered!&modal=register")
                # if passwords don't match
                else:
                    response['error'] = "Passwords do not match. \n"
                    response['success'] = "false"
                    print("Passwords do not match")
                    return redirect(f"/?error={response['error']}&modal=register")
    else:
        # return status code 405 (method not allowed)
        return 405

# login process

@app.route("/login", methods=['GET', 'POST'])
def login():
    # Already logged in
    if 'username' in session:
        print("user is logged in as " +
              session['username'] + " is already logged in. Redirecting to /")
        return redirect("/")

    # POST
    if request.method == 'POST':
        input_username = request.form['username']
        input_password = request.form['password']

    # Searches accounts table for user-password combination
    c.execute("select username from users where username=? and password=?;",
              (input_username, input_password))

    # login_check
    if c.fetchone():
        print("Login success!")
        if request.method == 'GET':  # For 'get'
            # stores username in session
            session['username'] = request.args['username']

        if request.method == 'POST':  # For 'post'
            # stores username in session
            session['username'] = request.form['username']

        return redirect("/")

    else:
        print("Login failed")
        error_msg = ''
        username_check = "select username from users where username=?;"
        password_check = "select username from users where password=?;"

        # username check
        c.execute(username_check, (input_username,))
        if not c.fetchone():
            error_msg += "username is incorrect or not found. \n"

        # Password check
        c.execute(password_check, (input_password,))
        if not c.fetchone():
            error_msg += "Password is incorrect or not found. \n"

        error_msg += "Please try again."
        return redirect(f"/?error={error_msg}&modal=login")

# logout and redirect to login page


@app.route("/logout", methods=['GET', 'POST'])
def logout():
    # remove the username from the session if it's there
    session.pop('username', None)
    print("user has logged out. Redirecting to /login")
    return redirect("/")

#-------------------------ACCOUNTS-------------------------

def update_leaders(user, score):
    c.execute("SELECT * FROM leaderboard")
    leaders=c.fetchall()
    lowest_score = leaders[0][1]
    lowest_name = leaders[0][0]

    #if placeholder just replace
    if(lowest_score==None):
        c.execute('DELETE FROM leaderboard WHERE username = ? LIMIT 1', (lowest_name,))
        c.execute('INSERT INTO leaderboard (username, score) VALUES (?, ?)', (user, score))
        return
    #else check for lowest score
    else:
        for i in leaders:
            current_name = i[0]
            current_score = i[1]
            if (current_score<lowest_score):
                lowest_score = current_score
                lowest_name = current_name
        if (score>lowest_score):
            c.execute('DELETE FROM leaderboard WHERE username = ? LIMIT 1', (lowest_name,))
            c.execute('INSERT INTO leaderboard (username, score) VALUES (?, ?)', (user, score))
            db.commit()


if __name__ == "__main__":  # false if this file imported as module
    # enable debugging, auto-restarting of server when this file is modified
    app.debug = True
    app.run()