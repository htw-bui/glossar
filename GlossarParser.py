import json 
import codecs
import collections

with codecs.open("C:/Users/hiwi/Documents/GitHub/glossar/begriffe.txt", "r", "utf8" ) as infileBegriffe:
    begriffe = infileBegriffe.read().split("|")
begriffe = [begriff.split() for begriff in begriffe]


with open("C:/Users/hiwi/Documents/GitHub/glossar/definitionen.txt", "r") as infileDefinitionen:
    definitionen = infileDefinitionen.read().split("|")


terms = {}

for i in range(len(definitionen)):
    term = "".join(begriffe[i])
    description = definitionen[i].strip().replace("\n", " ").replace('"', '\\"')
    terms[term] = {"synonyms": [],
                 "description": description
                  }
od = collections.OrderedDict(sorted(terms.items()))

with open("C:/Users/hiwi/Documents/GitHub/glossar/generierte_begriffe.json", "w") as out:
    out.write(json.dumps(od, indent=2))


