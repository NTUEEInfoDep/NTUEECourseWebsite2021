import os
from flask import Flask

# ========================================

app = Flask(__name__)

PORT = 8001
if "PORT" in os.environ:
    PORT = os.environ["PORT"]

# ========================================


@app.route("/")
def index():
    return "distribute server"


@app.route("/distribute", methods=["POST"])
def distribute():
    return f"Hello, hi"

# ========================================


if __name__ == "__main__":
    app.run(port=PORT)
