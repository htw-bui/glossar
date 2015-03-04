# How to include new data
If you want to get new data you can take the two .docx files that are provided by the UXQB.
For each file you then take out the table with terms and definitions and copy it into a spreadsheet. Make sure to also include the "Concept" and "Definition" header at the beginning (but only once). You then save the spreasheet to csv. Make sure that you have it set so that all text is in quotes and "," is the field seperator. Call this csv file `glossar-en.csv` or `glossar-de.csv` respectively and save it into the `data` folder.

You also need to take out the translations at the end of the German file. Take the list with german -> english and add headers called `german` and `english`. Save as csv with the same settings as the other files and put into the `data` folder with the name `translations.csv`

Then as a final step `cd` into the `python` folder and execute the `execute_all.sh` shell scipt. This will call all the python scripts and create merged, censored and linked versions to use in the game and glossary.
