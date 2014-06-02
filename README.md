Usability Glossar
=======

Clone the repo. Then change to it and run
``` npm install ```
in order to install the node dependencies

Start a server to test the page
``` python -m SimpleHTTPServer ```

Use Grunt to watch for changes. This gives you autoreload, sass compilation etc.
``` grunt ```

Create a build
``` grunt build ```. This compiles, and shortens the files and moves them to the ```dist``` folder that can be uploaded and will just work.

Run tests with intern
http://localhost:8000/node_modules/intern/client.html?config=test/intern

Errata: The python script that creates the .json files does not work right now due to changed pathes but could be easily fixed.
