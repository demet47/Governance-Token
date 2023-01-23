from flask import Flask, request, jsonify
app = Flask(__name__)



@app.route('/', methods=['GET'])
def hello_world():
    #GET http://127.0.0.1:81/?username=asas&password=bbb HTTP/1.1
    username = request.args.get('username')
    password = request.args.get('password')
    print(username)
    print(password)
    return 'Hello, Docker!'


@app.route('/test', methods=['GET'])
def test():
    return 'Test'


@app.route('/myname/<name>', methods=['GET'])
def success(name):
    return 'welcome %s' % name


app.run(host='0.0.0.0', port=81)
