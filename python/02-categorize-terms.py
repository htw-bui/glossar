import json

with open("/home/knut/glossar/data/categoryMap-with-manual-additions.json") as infile:
    categories = json.load(infile)

with open("/home/knut/glossar/src/data/terms-international.json") as infile:
    terms = json.load(infile)
    
for term in terms:
    term["categories"] = categories[term["term-german"]]

with open("/home/knut/glossar/src/data/terms-international-with-categories.json", "w") as outfile:
   json.dump(terms, outfile, indent=2, sort_keys=True)    
