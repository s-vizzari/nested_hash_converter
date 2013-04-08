/*globals module*/
module.exports = function(grunt) {
  "use_strict";

  grunt.initConfig({

    jshint: {
      all: ['grunt.js', 'lib/**/*.js', 'spec/**/*[sS]pec.js'],

      options: {
        bitwise:        true,
        curly:          true,
        eqeqeq:         true,
        forin:          true,
        immed:          true,
        indent:         2,
        latedef:        true,
        newcap:         true,
        noarg:          true,
        noempty:        true,
        regexp:         true,
        undef:          true,
        unused:         true,
        strict:         true,
        trailing:       true,
        maxparams:      4,
        maxdepth:       4,
        maxstatements:  40,
        maxcomplexity:  40,
        maxlen:         120,

        eqnull:         true
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', 'jshint');

};
