import json
import re
import os
import urllib.parse
from bs4 import BeautifulSoup

PATH_TO_DATA_FOLDER = os.path.join(os.path.dirname(__file__), '../data/')
PATH_TO_SRC_DATA_FOLDER = os.path.join(os.path.dirname(__file__), '../src/data/')


def tagify(html, pattern):
    soup = BeautifulSoup(html)
    replace = pattern
    pattern = r'\b%s\b' % pattern
    for txt in soup.find_all(text=True):
        if re.search(pattern, txt, re.I) and txt.parent.name != 'a':
            encoded_url = urllib.parse.urlencode({'term': replace})
            newtag = soup.new_tag('a')
            newtag.attrs['href'] = "#/glossary?{}".format(encoded_url)
            newtag.string = replace
            txt.replace_with(newtag)
            split_location = re.search(pattern, txt, re.IGNORECASE)
            first_part= txt[:split_location.start()]
            second_part = txt[split_location.end():]
            newtag.insert_before(first_part)
            newtag.insert_after(second_part)
    return str(soup.p)

with open(PATH_TO_SRC_DATA_FOLDER + "terms-international-with-categories.json") as infile:
    content = json.load(infile)
    german_terms = [term["term-german"] for term in content]
    english_terms = [term["term-english"] for term in content]

for term in content:
    print('Current: %s' % term)
    german_def = term["description-german"]
    english_def = term["description-english"]

    english_linked = english_def
    german_linked = german_def

    # We do not want self referncing links
    allowed = english_terms[:]
    allowed.remove(term["term-english"])

    for english_term in allowed:
        english_linked = tagify(english_linked, english_term)
    english_linked = english_linked.replace("\n", "<br />")

    # We do not want self referncing links
    allowed_german = german_terms[:]
    allowed_german.remove(term["term-german"])
    allowed_german = sorted(allowed_german, key=len, reverse=True)

    for german_term in allowed_german:
        german_linked = tagify(german_linked, german_term)
    german_linked = german_linked.replace("\n", "<br />")

    term["description-german"] = german_linked
    term["description-english"] = english_linked

with open(PATH_TO_SRC_DATA_FOLDER + "terms-international-with-categories-linked.json", "w") as outfile:
    json.dump(content, outfile, indent=2, sort_keys=True)
    print("creating links for terms done!")
