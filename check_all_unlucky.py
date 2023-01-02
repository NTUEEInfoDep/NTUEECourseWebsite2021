import json, csv
import pandas as pd
import numpy as np

def read_json(filename):
    with open(filename, "r",encoding="utf-8") as f:
        json_object = json.loads(f.read())
    return json_object

result = pd.read_csv("result.csv") 
picked = result["studentID"].to_numpy()
print("[Picked]\t%d" % len(picked))

selections = read_json("selections.json")
selected_dict = {}
for selection in selections:
    studentID = selection["userID"]
    selected_dict[studentID] = 1

selected = selected_dict.keys()
print("[Selected]\t%d" % len(selected))

unlucky = list(set(selected) - set(picked))
print("[Unlucky]\t%d" % len(unlucky))
print(unlucky)


