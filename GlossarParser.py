import json 
import codecs
import collections

with codecs.open("C:/Users/hiwi/Documents/GitHub/glossar/begriffe.txt", "r", "utf8" ) as infileBegriffe:
    begriffe = infileBegriffe.read().split("|")
begriffe = [begriff.split() for begriff in begriffe]


with codecs.open("C:/Users/hiwi/Documents/GitHub/glossar/definitionen.txt", "r", "utf8") as infileDefinitionen:
    definitionen = infileDefinitionen.read().split("|")

merged = []

for i in range(len(begriffe)):
    merged.append("".join(begriffe[i]) + "\n=========" + definitionen[i])

#with open("C:/Users/hiwi/Documents/GitHub/glossar/merged.txt", "w", encoding="utf-8") as me:
#    me.write("---------\n\n\n".join(merged))

with open("C:/Users/hiwi/Documents/GitHub/glossar/merged.txt", "r", encoding="utf-8") as infile:
    content = infile.read().split("---------")


terms = {}
for part in content:
    parts = part.split("=========")
    term = parts[0].strip()
    synonyms = parts[1].split(",")
    description = parts[2].strip().replace("\n", " ")
    terms[term] = {"synonyms": synonyms,
                 "description": description
                  }
od = collections.OrderedDict(sorted(terms.items()))

with open("C:/Users/hiwi/Documents/GitHub/glossar/neu_generierte_begriffe.json", "w") as out:
    out.write(json.dumps(od, indent=2))


