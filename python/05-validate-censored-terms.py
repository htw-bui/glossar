import json

def main():
    with open("/home/knut/glossar/src/data/terms-international-censored.json") as infile:
        terms = json.load(infile)
    categories = []
    for term in terms:
        categories += term["categories"]  
    
    single_categories = set(categories)
    for category in single_categories:
        print("Count for %s: %i" % (category, categories.count(category)))
        assert(categories.count(category) >= 4)
    
if __name__ == "__main__":
    main()
