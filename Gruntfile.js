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
				tasks: ["sass"]
			},
			html: {
				files:["*.html"]
			},
			css: {
				files:["css/*"],
				tasks: ["autoprefixer"]
			}
		},
		sass: {
			dev: {
				options: {
					style: "expanded"
				},
				files: {
					"css/main.css" : "sass/main.sass"
				}
			},
			dist: {
				options: {
					style: "compressed"
				},
				files: {
					"css/main.css" : "sass/main.sass"
				}
			}

		},
		autoprefixer: {
			maincss: {
				options: {
					diff: true
				},
				src: "css/main.css",
				dest: "dist/css/main.css"
			},
			dist: {
				src: "dist/css/main.css",
				dest : "css/main.css"
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
					'dist/index.html': 'index.html'
				}
			}
		},
		copy: {
			dist: {
				files: [ {
					src:"neu_generierte_begriffe.json", 
					dest:"dist/neu_generierte_begriffe.json"
				},
				{
					src:"js/hyphenate.js", 
					dest:"dist/js/hyphenate.js"
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
					"dist/main.js": "main.js"
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



	grunt.registerTask('default', ['sass', 'watch']);
	grunt.registerTask('build', ['sass:dist', "autoprefixer:dist", "htmlmin:dist", "copy:dist", "uglify:dist"]);

};
