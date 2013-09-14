import json
import random

from flask import Flask, request, render_template

app = Flask(__name__)


def double(x):
    return x * 2


@app.route("/")
def index():
    return render_template("index.html", cake=2)


@app.route("/physics.json")
def physics():
    rv = {}
    for k in request.args:
        rv[k] = random.randint(0, 100)
    return json.dumps(rv)

if __name__ == "__main__":
    app.run(port=5001, debug=True)
