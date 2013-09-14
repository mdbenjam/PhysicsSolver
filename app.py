import json
import random
from UHO import solvefor
from flask import Flask, request, render_template

app = Flask(__name__)


def double(x):
    return x * 2


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/physics.json")
def physics():
    input_dic = {}
    input_list = []
    output_dic = {}
    returned_dic = {}

    for k in request.args:
        try:
            input_dic[k] = float(request.args[k])
            input_list.append(k)
        except ValueError:
            output_dic[k] = random.randint(0, 100)
        returned_dic[k] = request.args[k]

    for k in output_dic:
        print "solvefor", input_dic, input_list, k
        hold = solvefor(input_dic,input_list, k)
        print k, hold
        if (hold != None and 'value' in hold):
            returned_dic[k] = hold['value']
    return json.dumps(returned_dic)


@app.route("/general")
def general():
    options = ["force", "mass", "acceleration"]
    return render_template("general.html", options=options)


if __name__ == "__main__":
    app.run(port=5001, debug=True)
