import json
import random

from flask import Flask, request, render_template

app = Flask(__name__)


def double(x):
    return x * 2


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/physics.json")
def physics():
    rv = {}
    for k in request.args:
        rv[k] = random.randint(0, 100)
    return json.dumps(rv)


@app.route("/general")
def general():
    options = ["force", "mass", "acceleration"]
    return render_template("general.html", options=options)


if __name__ == "__main__":
    app.run(port=5001, debug=True)
