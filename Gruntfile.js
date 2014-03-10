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
			}
		},
		autoprefixer: {

			maincss: {
				options: {
					diff: true
					},
					src: "css/main.css",
					dest: "dist/css/main.css"
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass'); 
	grunt.loadNpmTasks('grunt-autoprefixer'); 

	// Default task(s).
	grunt.registerTask('default', ['sass', 'watch']);

};
