'use strict';

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    // Empties folders to start fresh
    clean: {
      all: ['doc', '.tmp', 'dist']
    },
    watch: {
      bower: {
        files: ['bower.json']
      },
      js: {
        files: ['src/{,*/}*.js'],
        tasks: ['newer:jshint:all', 'browserify', 'jsdoc', 'uglify']
      },
      // jsTest: {
      //     files: ['test/spec/{,*/}*.js'],
      //     tasks: ['newer:jshint:test', 'karma']
      // },
    },
    jshint: {
      all: {
        options: {
          jshintrc: '.jshintrc',
          reporter: require('jshint-stylish')
        },
        files: {
          src: ['src/{,*/}*.js']
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/basiq.min.js': ['dist/basiq.js']
        }
      },
      distPlugins: {
        files: [{
          expand: true,
          flatten: true,
          cwd: 'src/plugins/',
          src: '*.js',
          dest: 'dist/plugins',
          extDot: 'last',
          ext: '.min.js'
        }]
      }
    },
    copy: {
      dist: {
        // flatten: true,
        expand: true,
        cwd: 'src/',
        src: ['*.js'],
        dest: 'dist/'
      }
    },
    replace: {
      dist: {
        src: ['dist/*.js'],
        overwrite: true, // overwrite matched source files
        replacements: [{
          from: /basiq.version=[^,]*/,
          to: 'basiq.version="<%= pkg.version %>"'
        }]
      }
    },
    browserify: {
      build: {
        // cwd: 'src',
        src: ['src/*.js'],
        // expand: true,
        dest: 'dist/basiq.js',
        options: {
          // transform: ['browserify-shim'],
          // browserifyOptions: {
          //   debug: true,
          // },

        },
      }
    },
    jsdoc: {
      dist: {
        src: ['README.md', 'src/*.js'],
        options: {
          destination: 'doc',
          template: 'node_modules/ink-docstrap/template',
          configure: 'jsdoc.conf.json'
        }
      }
    }

  });

  grunt.registerTask('default', ['jshint']);

  grunt.registerTask('dist', 'Bitbloq dist Task', [
    'jshint',
    'copy:dist',
    'uglify:dist',
    'uglify:distPlugins',
    'replace'
  ]);

  // grunt.registerTask('test', 'Unit Testing', []);

  grunt.registerTask('watcher', 'Dev mode watching', [
    'watch:js'
  ]);
};
