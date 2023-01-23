from flask import Flask, request, jsonify
import os
import psycopg2
from datetime import datetime, timedelta
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

conn = psycopg2.connect(
    host="172.17.0.3",  # host="172.17.0.3",
    database="postgres",
    user="postgres",
    password="123456")

cur = conn.cursor()


# cur.close()
# conn.close()


@app.route('/entry', methods=['POST'])
@cross_origin()
def hello_world():
    # GET http://127.0.0.1:81/entry?user=asas&tx=bbb HTTP/1.1
    user = request.args.get('user')
    tx = request.args.get('tx')
    today = datetime.today()
    time = today.strftime("%Y-%m-%d")
    try:
        cur.execute('INSERT INTO data ("user", "tx", "time") VALUES (%s, %s, %s)', (user, tx, time))
        conn.commit()
        return "200"
    except:
        return "400"


@app.route('/entries', methods=['GET'])
@cross_origin()
def success():
    try:
        cur.execute('SELECT * FROM data')
        rows = cur.fetchall()
        print(rows)
        return jsonify(rows)
    except:
        return "400"


app.run(host='0.0.0.0', port=81)
