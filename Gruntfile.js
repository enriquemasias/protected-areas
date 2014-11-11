module.exports = function(grunt) {

  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({

    clean: {
      dist: [
        './dist'
      ]
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: './app',
          dest: './dist',
          src: [
            '*.{ico,png,txt}',
            '{,*/}*.html',
            'fonts/*.*',
            'scripts/*.*',
            'css/*.*',
            'img/*.*'
          ]
        }]
      }
    },

    'gh-pages': {
      options: {
        base: 'dist'
      },
      src: ['**']
    }

  });

  grunt.registerTask('build', [
    'clean:dist',
    'copy'
  ]);

  grunt.registerTask('deploy', [
    'build',
    'gh-pages'
  ]);

};
