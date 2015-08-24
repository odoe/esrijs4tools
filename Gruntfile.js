module.exports = function(grunt) {
  'use strict';
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    babel: {
      options: {
        sourceMap: true,
        modules: 'amd'
      },
      dev: {
        files: [{
          expand: true,
          cwd: 'src',
          src: [
            '*.js', '!tools.profile.js'
          ],
          dest: 'dist'
        }]
      }
    },

    clean: ['dist'],

    copy: {
      main: {
        src: 'src/tools.profile.js',
        dest: 'dist/tools.profile.js'
      }
    }
  });

  grunt.registerTask('default', ['clean', 'babel', 'copy']);
};
