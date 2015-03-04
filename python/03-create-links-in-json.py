import json
import re
import os

PATH_TO_DATA_FOLDER = os.path.join(os.path.dirname(__file__), '../data/')
PATH_TO_SRC_DATA_FOLDER = os.path.join(os.path.dirname(__file__), '../src/data/')


with open(PATH_TO_SRC_DATA_FOLDER + "terms-international-with-categories.json") as infile:
    content = json.load(infile)
    german_terms = [term["term-german"] for term in content]
    english_terms = [term["term-english"] for term in content]

for term in content:
    german_def = term["description-german"]
    english_def = term["description-english"]

    english_linked = english_def
    german_linked = german_def

    # We do not want self referncing links
    allowed = english_terms[:]
    allowed.remove(term["term-english"])

    for english_term in allowed:
        english_linked = re.sub(r"(?<![>=])(%s)" % english_term, r"<a href='#/glossary?term=%s'>\1</a>" % english_term, english_linked, flags=re.IGNORECASE, count=1)
    english_linked = english_linked.replace("\n", "<br />")

    # We do not want self referncing links
    allowed_german = german_terms[:]
    allowed_german.remove(term["term-german"])
    allowed_german = sorted(allowed_german, key=len, reverse=True)

    for german_term in allowed_german:
        german_linked = re.sub(r"(?<![>=])(%s)" % german_term, r"<a href='#/glossary?term=%s'>\1</a>" % german_term, german_linked, flags=re.IGNORECASE, count=1)
    german_linked = german_linked.replace("\n", "<br />")

    term["description-german"] = german_linked
    term["description-english"] = english_linked

with open(PATH_TO_SRC_DATA_FOLDER + "terms-international-with-categories-linked.json", "w") as outfile:
    json.dump(content, outfile, indent=2, sort_keys=True)
    print("creating links for terms done!")
