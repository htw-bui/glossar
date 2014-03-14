module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    //pkg: grunt.file.readJSON('package.json'),
    watch:{
      options: {
        livereload: true
      },
      stylesheets: {
        files: ["sass/*"],
        tasks: ["sass:dev"]
      },
      html: {
        files:["*.html"]
      },
      js: {
        files: ["js/*"]
      },
      css: {
        files: ["css/*"],
        tasks: ["autoprefixer"]
      }
    },
    sass: {
      dev: {
        options: {
          style: "expanded"
        },
        files: {
          "css/main.css" : "sass/main.sass",
          "css/game.css" : "sass/game.sass"
        }
      },
      dist: {
        options: {
          style: "compressed"
        },
        files: {
          "css/main.css" : "sass/main.sass",
          "css/game.css" : "sass/game.sass"

        }
      }

    },
    autoprefixer: {
      dist: {
        expand: true,
        src : "css/*.css",
        dest: "dist/"
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          removeAttributQuotes: true,
          collapseBooleanAttribute: true
        },
        files: {
          'dist/index.html': 'index.html',
          'dist/quiz.html': 'quiz.html'
        }
      }
    },
    copy: {
      dist: {
        files: [ 
          {
            src:"js/*", 
            dest:"dist/"
          },
          { src:"*.json",
            dest:'dist/'
          }
        ]
      }
    },
    uglify: {
      dist: { 
        options: {
          mangle: true
        },
        files: {
          "dist/js/main.js": "js/main.js",
          "dist/js/game.js": "js/game.js"
        }
      }
    }


  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass'); 
  grunt.loadNpmTasks('grunt-autoprefixer'); 
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');



  grunt.registerTask('default', ['sass:dev', 'watch']);
  grunt.registerTask('build', ['sass:dist', "autoprefixer", "htmlmin:dist", "copy:dist", "uglify:dist"]);

};
