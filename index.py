
from flask import Flask, jsonify, request
from database import DBconnection
from flask_httpauth import HTTPBasicAuth
from flask import render_template, redirect, url_for, session, flash
import sys, flask, os
import warnings
from flask.exthook import ExtDeprecationWarning

app = Flask (__name__)
auth = HTTPBasicAuth ()



def spcall(query, parameter, commit =False):
    try:
        dbo =DBconnection()
        cursor =dbo.getcursor()
        cursor.callproc(query, parameter)
        res = cursor.fetchall()

        if commit:
            dbo.dbcommit()
        return res

    except:
        res= [("Error: "+str(sys.exc_info()[0])+ ""+str(sys.exc_info()[1]),)]

    return res

@app.route('/')
def index():
    return "Hello World"

@app.route('/pinassignment/<string:data>', methods =['GET'])
def getassignpins(data):
    res =spcall('getassignpin', (data,), True)

    if 'Error' in str(res[0][0]):
        return jsonify({'status':'error', 'message': res[0][0]})

    lists=[]

    for r in res:
        lists.append({'socketname':r[0], 'pinnum':r[1], 'xcoor':r[2], 'ycoor':r[3]})

    return jsonify({'status':'ok', 'entries':lists, 'count':len(lists)})


@app.route ('/pinassignment', methods=['POST'])
def assign():
    id = request.form['socketid']
    pinnum= request.form['pinnum']
    x = request.form['xcoor']
    y = request.form['ycoor']

    res=spcall('assignpin', (id, pinnum,x, y), True)
    if 'Pin assignment exists' in res[0][0]:
        return jsonify({'status': 'error', 'message': res[0][0]})

    return jsonify({'status': 'ok', 'message': res[0][0]})


@app.after_request
def add_cors(resp):
    resp.headers['Access-Control-Allow-Origin'] = flask.request.headers.get('Origin', '*')
    #resp.headers['Access-Control-Allow-Origin'] = flask.request.headers.get ('Origin')
    resp.headers['Access-Control-Allow-Credentials'] = True
    resp.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS, GET, PUT, DELETE'
    resp.headers['Access-Control-Allow-Headers'] = flask.request.headers.get ('Access-Control-Request-Headers',
                                                                          'Authorization')
    # set low for debugging

    if app.debug:
        resp.headers["Access-Control-Max-Age"] = '1'
    return resp


if __name__ == '__main__':
    app.run (debug=True)

