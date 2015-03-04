import csv
import json
import collections
import os

PATH_TO_DATA_FOLDER = os.path.join(os.path.dirname(__file__), '../data/')
PATH_TO_SRC_DATA_FOLDER = os.path.join(os.path.dirname(__file__), '../src/data/')


def read_csv(lang="de"):
    with open(PATH_TO_DATA_FOLDER + "glossar-%s.csv" % lang) as infile:
        content = infile.readlines()[1:]
        reader = csv.reader(content, delimiter=",")
        terms = {}
        for line in reader:
            terms[line[0].replace("\xad", "").strip()] = {"description": line[1], "synonyms": []}
        od = collections.OrderedDict(sorted(terms.items()))
    return od


def readTranslations():
    with open(PATH_TO_DATA_FOLDER + "translations.csv") as infile:
        content = infile.readlines()
        dict_reader = csv.DictReader(content)
    translations = {}
    for line in dict_reader:
        key = line["german"].replace("\xad", "")
        if ">" not in line["german"]:
            translations[key] = line["english"]
        else:
            term, synonym = [part.strip() for part in key.split(">")]
            translations[term] = line["english"]
            translations[synonym] = line["english"]
    return translations

    return {line["german"]: line["english"] for line in dict_reader}


def createInternationalMergedFile():
    german_terms = read_csv("de")
    english_terms = read_csv("en")
    translations = readTranslations()

    output = []

    for dirty_term in german_terms:
        term = cleanupTerm(dirty_term)
        english_term = translations[term].split("\n>")[0].strip()
        if english_term == "":
            continue

        output.append({"description-german": german_terms[dirty_term]["description"],
                       "description-english": english_terms[english_term]["description"],
                       "term-german": term,
                       "term-english": english_term
                       })

    with open(PATH_TO_SRC_DATA_FOLDER + "terms-international.json", "w") as outfile:
        json.dump(output, outfile, indent=2, sort_keys=True)


def cleanupTerm(term):
    term = term.replace("\xad", "")
    if term in ["Evaluierungs-bericht", "Interview–checkliste", "Nutzungs–szenario"]:
        term = term.replace("-", "").replace("–", "")
    if term == "Suggestivfrage":
        term = "Suggestionsfrage"
    return term


if __name__ == "__main__":
    createInternationalMergedFile()
    print('Reading csvs and merging done')
