Usability Glossar
=======

Windows
-------
Get chocolatey to track dependencies.
Refer to [http://chocolatey.org/] (http://chocolatey.org/) for installation.
Then run
```
cinst nodejs
cinst ruby
cinst rubygems
```
close your shell, open it again and run 
```
gem install sass 
```


Clone the repo. Then change to it and run
``` npm install ```
in order to install the node dependencies
Your of course need to have node installed for that.

Start a server to test the page
``` python -m SimpleHTTPServer ```
And check [http://localhost:8000](http://localhost:8000) or [http://localhost:8000/quiz.html](http://localhost:8000/quiz.html)

Use Grunt to watch for changes. This gives you autoreload, sass compilation etc.
``` grunt ```
Make sure to run ```npm install -g grunt-cli``` if you get an error.

Create a build
``` grunt build ```. This compiles, and shortens the files and moves them to the ```dist``` folder that can be uploaded and will just work.

Run tests with intern
http://localhost:8000/node_modules/intern/client.html?config=test/intern

Errata: The python script that creates the .json files does not work right now due to changed pathes but could be easily fixed.
