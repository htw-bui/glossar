[![Dependency Status](https://www.versioneye.com/user/projects/54f42894dd0a36d180000061/badge.svg?style=flat)](https://www.versioneye.com/user/projects/54f42894dd0a36d180000061)
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
cinst python
```


General
-------

Clone the repo. Then change to it and run
```
gem install sass 
npm install
```
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

Including new terms and definitions
---------------------------------
Refer to the `HOW-TO-INCLUDE-NEW-DATA.md` for information on how to update the data.
