import json
import os

PATH_TO_DATA_FOLDER = os.path.join(os.path.dirname(__file__), '../data/')
PATH_TO_SRC_DATA_FOLDER = os.path.join(os.path.dirname(__file__), '../src/data/')

with open(PATH_TO_DATA_FOLDER + "categoryMap-with-manual-additions.json") as infile:
    categories = json.load(infile)

with open(PATH_TO_SRC_DATA_FOLDER + "terms-international.json") as infile:
    terms = json.load(infile)

for term in terms:
    term["categories"] = categories[term["term-german"]]

with open(PATH_TO_SRC_DATA_FOLDER + "terms-international-with-categories.json", "w") as outfile:
    json.dump(terms, outfile, indent=2, sort_keys=True)
