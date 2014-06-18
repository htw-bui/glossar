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
        tasks: ["sass:dev", "autoprefixer:dev"]
      },
      html: {
        files:["src/*.html"]
      },
      js: {
        files: ["src/js/*"]
      }
    },
    sass: {
      dev: {
        options: {
          style: "expanded"
        },
        files: {
          "src/css/main.css" : "sass/main.sass",
          "src/css/game.css" : "sass/game.sass"
        }
      },
      dist: {
        options: {
          style: "compressed"
        },
        files: {
          "dist/css/main.css" : "sass/main.sass",
          "dist/css/game.css" : "sass/game.sass"
        }
      }

    },
    autoprefixer: {
      dev: {
        expand: true,
        src : "src/css/*.css",
      },
      dist: {
        expand: true,
        src : "dist/css/*.css",
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
          'dist/index.html': 'src/index.html',
          'dist/quiz.html': 'src/quiz.html',
          'dist/highscore.html': 'src/highscore.html'
        }
      }
    },
    copy: {
      dist: {
        files: [ 
          {
            src:"src/css/animate.css", 
            dest:"dist/css/animate.css"
          },
          { 
           cwd: "src/data/",
            src:"*.json",
            dest:'dist/data/',
            flatten: true,
            expand: true
          }
        ]
      }
    },
    uglify: {
      dist: { 
        files: [
          {
            expand: true,
            cwd: "src/js",
            src: "**/*.js",
            dest: "dist/js"
          }
        ]
      }
    }


  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass'); 
  grunt.loadNpmTasks('grunt-autoprefixer'); 
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');



  grunt.registerTask('default', ['sass:dev', 'autoprefixer:dev', 'watch']);
  grunt.registerTask('build', ['sass:dist', "autoprefixer:dist", "htmlmin:dist", "copy:dist", "uglify:dist"]);

};
