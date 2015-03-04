import json
import os

PATH_TO_SRC_DATA_FOLDER = os.path.join(os.path.dirname(__file__), '../src/data/')


def main():
    with open(PATH_TO_SRC_DATA_FOLDER + "terms-international-censored.json") as infile:
        terms = json.load(infile)
    categories = []
    for term in terms:
        categories += term["categories"]

    single_categories = set(categories)
    for category in single_categories:
        print("Count for %s: %i" % (category, categories.count(category)))
        assert(categories.count(category) >= 4)
    print("All categories seem to have at least 4 terms. All done!")

if __name__ == "__main__":
    main()
