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
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass'); 

	// Default task(s).
	grunt.registerTask('default', ['sass', 'watch']);

};
