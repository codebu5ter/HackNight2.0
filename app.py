# -*- coding: utf-8 -*-

import pandas as pd
from shapely.geometry import Point, shape
from flask import Flask, request, render_template
from flask import Flask
from flask import render_template
import json
import pickle
import numpy as np
import random

data_path = './input/'

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")



@app.route('/getpred',methods=['POST','GET'])
def get_delay():
    if request.method=='POST':
        result=request.form
        bool2 = bool(random.getrandbits(1))
        
        pkl_file = open('cat', 'rb')
        ran3 = random.randint(1,7)
        index_dict = pickle.load(pkl_file)
        ran1 = random.randint(1812,2265)
        new_vector = np.zeros(len(index_dict))
        bool4 = bool(random.getrandbits(1))
        
        
        # try:
        #     new_vector[index_dict['Date_'+str(result['Date'])]] = 1
        # except:
        #     pass
			
        # try:
        #     new_vector[index_dict['Open_'+str(result['Open'])]] = 1
        # except:
        #     pass
			
        
        pkl_file = open('linear.pkl', 'rb')
        logmodel = pickle.load(pkl_file)
        ran2 = random.randint(1,54)
        
        ran4 = random.randint(1,365)
        bool1 = bool(random.getrandbits(1))

        bool3 = bool(random.getrandbits(1))
        
        bool5 = bool(random.getrandbits(1))
        prediction = logmodel.predict(np.array([ ran1, int(result['year']), int(result['month']), ran2, int(result['date']), ran3, ran4, bool1, bool2, bool3, bool4, bool5]).reshape(1, -1))
        return render_template('result.html',prediction=prediction)       



@app.route("/data")
def get_data():
    df = pd.read_csv(data_path + 'stocks.csv')
    # df = df[df['timestamp'] != 0].sample(n=7000)

    # df['tenure_new'] = df['tenure'].apply(lambda tenure: get_tenure_segment(tenure))

    # df['location'] = df.apply(lambda row: get_location(row['longitude'], row['latitude'], provinces_json), axis=1)

    cols_to_keep = ['Open', 'Low', 'Close', 'High', 'Volume', 'Date']
    df_clean = df[cols_to_keep].dropna()

    return df_clean.to_json(orient='records')


if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)