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
cinst openssl.light
cinst ruby
cinst rubygems
cinst python
```


General
-------

Clone the repo. Then change to it and run
```
npm install
```
in order to install the node dependencies
Your of course need to have node installed for that.

Change to the src folder and run ``` bower install ```

Start a server to test the page
-------
Change to the src folder and run

Python 2.x
```
python -m SimpleHTTPServer
```
Python 3.x
```
python -m http.server
```

And check [http://localhost:8000](http://localhost:8000)


Including new terms and definitions
---------------------------------
Refer to the `HOW-TO-INCLUDE-NEW-DATA.md` for information on how to update the data.
