import json

with open("/home/knut/glossar/src/data/terms-international.json") as infile:
    content = json.load(infile)
    for term in content:
        descEnglish = term["description-english"]
        termEnglish = term["term-english"]
        
        descGerman = term["description-german"]
        termGerman = term["term-german"]
        
        censored_desc_english = descEnglish.split("Notes")[0]\
                                            .split("Note")[0]\
                                            .replace(termEnglish, "xxx")

     
        censored_desc_german = descGerman.split("Anmerkung")[0]\
                                         .split("Anmerkungen")[0]\
                                         .replace(termGerman, "xxx")
        
        term["description-english"] = censored_desc_english
        term["description-german"] = censored_desc_german

    # take out all the terms with a descirption of less then 3 words
    # those are just "siehe ..."
    content = [term for term in content if len(term["description-english"].split()) > 3]
    
with open("/home/knut/glossar/src/data/terms-international-censored.json", "w") as outfile:
    json.dump(content, outfile, indent=2)

