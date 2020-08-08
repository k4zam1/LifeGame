from flask import Flask,request
from flask_cors import CORS
import pandas as pd
import os
import webbrowser

app = Flask(__name__)
CORS(app)

@app.route("/api")
def getus_country():
    query = request.args.get("query")
    stage_file = "stage"+ str(query) +".csv"
    stage_file_path = "stage/"+stage_file
    
    if not os.path.exists(stage_file_path) :
        return 
    df = pd.read_csv(stage_file_path)
    return df.to_csv()


if __name__ == "__main__":
    app_url = "file://"+ os.getcwd() + '/index.html'
    webbrowser.open_new_tab(app_url)
    app.run(port=9000,debug=True)