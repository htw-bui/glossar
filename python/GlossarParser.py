import json
import codecs
import collections
import os
import re


def merge():
    with codecs.open("../data/begriffe.txt", "r", "utf8") as infileBegriffe:
        begriffe = infileBegriffe.read().split("|")
    begriffe = [begriff.split() for begriff in begriffe]

    with codecs.open("../data/definitionen.txt", "r", "utf8") as infileDefinitionen:
        definitionen = infileDefinitionen.read().split("|")

    merged = []

    for i in range(len(begriffe)):
        merged.append("".join(begriffe[i]) + "\n=========" + definitionen[i])

    #with open("C:/Users/hiwi/Documents/GitHub/glossar/merged.txt", "w", encoding="utf-8") as me:
    #    me.write("---------\n\n\n".join(merged))


def generate_from_merged(withlinks=True):
    fullpath = os.path.dirname(os.path.abspath(__file__)) + "/"
    if withlinks:
        path = fullpath  + '../data/merged.html'
        outpath = fullpath  + '../neu_generierte_begriffe.json'
    #else:
        #path = fullpath  + '../data/categories-censored-v2.html'
        #outpath = fullpath  + '../terms.json'

    else:
        path = fullpath  + '../data/categories-uncensored.html'
        outpath = fullpath  + '../src/data/terms-nocensor.json'

    with open(path, "r", encoding="utf-8") as infile:
        content = infile.read().split("---------")

    terms = {}
    for part in content:
        parts = part.split("=========")
        term, categories = parts[0].split(":")
        term = term.strip()
        categories = [c.strip() for c in categories.split(",")]
        if "" in categories:
            categories.remove("")

        synonyms = [s.strip() for s in parts[1].split(",")]

        description = parts[2].strip()\
                              .replace("\n", "")\
                              .split("Bemerkung zum Seminar")[0]\
                              .split("Bemerkungen zum Seminar")[0]

        terms[term] = {"synonyms": synonyms,
                       "description": description,
                       "categories": categories
                       }
    od = collections.OrderedDict(sorted(terms.items()))

    print(len(od))
    with open(outpath, "w") as out:
        out.write(json.dumps(od, indent=2))


def censor():
    fullpath = os.path.dirname(os.path.abspath(__file__)) + "/"

    #path = fullpath + '../data/kategorie_v2.txt'
    #outpath = fullpath + '../data/categories-censored-v2.html'

    path = fullpath + '../data/kategorie-unzensiert-gekuerzt.txt'
    outpath = fullpath + '../data/categories-uncensored.html'

    with open(path, "r", encoding="utf-8") as infile:
        content = infile.read().split("---------")

    p = []
    for part in content:
        parts = part.split("=========")
        term = parts[0].strip()
        synonyms = [part.strip() for part in parts[1].split(",")]
        if "" in synonyms:
            synonyms.remove("")
        description = parts[2].strip().replace("\n", " ")
        #description = re.sub('(?i)(\w*)' + term + '(\w*)', r'\1xxxx\2', description)
        p.append("%s\n=========\n%s\n=========\n%s\n\n" % (term, ",".join(synonyms),
                                                         description))
    with open(outpath, "w") as out:
        out.write("---------\n".join(p))

if __name__ == '__main__':
    #generate_from_merged()
    censor()
    generate_from_merged(withlinks=False)
    #censor()

