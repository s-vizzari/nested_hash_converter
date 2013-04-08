/*global module*/
module.exports = function(grunt) {
  "use_strict";

  grunt.initConfig({

    jshint: {
      all: ['Gruntfile.js', 'spec/**/*.js', 'lib/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    mkdir: {
      all: {
        options: {
          create: ['tmp']
        }
      }
    },

    clientside: {
      main: {
        main: 'lib/nested-hash-converter.js',
        name: 'lib/nested-hash-converter',
        output: 'tmp/bundle.js'
      }
    },

    jasmine: {
      src : 'tmp/bundle.js',
      options : {
        specs : 'spec/**/*.js'
      }
    },

    clean: ['tmp/']

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-clientside');
  grunt.loadNpmTasks('grunt-mkdir');

  grunt.registerTask('test', ['jshint', 'mkdir', 'clientside', 'jasmine', 'clean']);

  grunt.registerTask('default', ['test']);

};
