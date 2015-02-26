import csv
import json
import collections


def readCsv(lang="de"):
    with open("/home/knut/glossar/data/glossar-%s.csv" % lang) as infile:
        content = infile.readlines()[1:]
        reader = csv.reader(content, delimiter=",")
        terms = {}
        for line in reader:
            terms[line[0].replace("\xad", "").strip()] = {"description" : line[1], "synonyms": []}
        od = collections.OrderedDict(sorted(terms.items()))
    return od

def readTranslations():
    with open("/home/knut/glossar/data/translations.csv") as infile:
        content = infile.readlines()
        dictReader = csv.DictReader(content)
    translations = {}
    for line in dictReader:
        key = line["german"].replace("\xad", "")
        if ">" not in line["german"]:
            translations[key] = line["english"]
        else:
            term, synonym = [part.strip() for part in key.split(">")]
            translations[term] = line["english"]
            translations[synonym] = line["english"]
    return translations        
        
    return {line["german"]: line["english"] for line in dictReader}
       
             
def createInternationalMergedFile():
    germanTerms = readCsv("de")
    englishTerms = readCsv("en")
    translations = readTranslations()
    
    output = []
    
    for dirtyTerm in germanTerms:
        term = cleanupTerm(dirtyTerm)
        englishTerm = translations[term].split("\n>")[0].strip()
        if englishTerm == "":
            continue
        
        output.append({"description-german": germanTerms[dirtyTerm]["description"],
                       "description-english": englishTerms[englishTerm]["description"],
                       "term-german": term,
                       "term-english": englishTerm
                       })
    
    with open("/home/knut/glossar/src/data/terms-international.json", "w") as outfile:
        json.dump(output, outfile, indent=2) 
        
        

        
def cleanupTerm(term):
    term = term.replace("\xad", "")
    if term in ["Evaluierungs-bericht", "Interview–checkliste", "Nutzungs–szenario"]:
        term = term.replace("-", "").replace("–", "")
    if term == "Suggestivfrage":
        term = "Suggestionsfrage"
    return term
    
        
if __name__=="__main__":  
    createInternationalMergedFile()
    print('done')
