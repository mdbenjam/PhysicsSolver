from flask import Flask, request, render_template

app = Flask(__name__)


def double(x):
    return x * 2

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == 'POST':
        return str(double(request.form['red']))
    else:
        return render_template("index.html", cake=2)

if __name__ == "__main__":
    app.run(port=5001)
