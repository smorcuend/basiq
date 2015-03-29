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
            demo: ['demo', '.tmp']
        },
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['src/{,*/}*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            // jsTest: {
            //     files: ['test/spec/{,*/}*.js'],
            //     tasks: ['newer:jshint:test', 'karma']
            // },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            html: {
                files: ['src/index.html'],
                tasks: ['demoPage']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: ['src/index.html']
            }
        },
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729,
                open: true
            },
            livereload: {
                options: {
                    open: true,
                    // base: 'src',
                    middleware: function(connect) {
                        return [
                            connect.static('demo'),
                            // connect.static('src'),
                            connect().use(
                                './scripts',
                                connect.static('demo/scripts')
                            )
                        ];
                    }
                }
            },
            dist: {
                options: {
                    base: 'demo/'
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function(connect) {
                        return [
                            connect.static('src'),
                            connect.static('test'),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            )
                        ];
                    }
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            files: [
                'Gruntfile.js',
                'src/**/*.js',
                'test/**/*.js',
                '!test/assets/**/*',
                '!test/reports/**/*',
                '!test/tmp/**/*'
            ]
        },
        uglify: {
            dist: {
                files: {
                    'dist/basiq.min.js': ['src/basiq.js'],
                    'dist/basiq.polyfills.min.js': ['bower_components/es6-shim/es6-shim.min.js', 'src/basiq.js']
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
            },
            demo: {
                expand: true,
                cwd: '.tmp/js',
                src: ['{,*/}*.min.js', '!basiq.min.js'],
                dest: 'demo/scripts/'
            }
        },
        // Automatically inject Bower components into the app
        wiredep: {
            demo: {
                src: ['demo/index.html'],
                dest: 'demo/index.html',
                options: {
                    // See wiredep's configuration documentation for the options
                    // you may pass:

                    // https://github.com/taptapship/wiredep#configuration
                }
            }
        },
        injector: {
            options: {
                ignorePath: 'demo',
                addRootSlash: false
            },
            demo: {
                files: {
                    'demo/index.html': ['demo/scripts/**/*.js', '!demo/scripts/basiq.polyfills.min.js'],
                }
            }
        },
        copy: {
            demoJs: {
                expand: true,
                cwd: 'dist/',
                src: ['{,*/}*.js', '!basiq.js', '!basiq.min.js'],
                dest: 'demo/scripts/'
            },
            dist: {
                // flatten: true,
                expand: true,
                cwd: 'src/',
                src: ['*.js'],
                dest: 'dist/'
            }
        },
        template: {
            dist: {
                options: {
                    data: {
                        'title': '<%= pkg.name %>',
                        'author': '<%= pkg.authors %>',
                        'description': '<%= pkg.description %>',
                        'homepage': '<%= pkg.homepage %>',
                        'repository': '<%= pkg.repository.url %>',
                        'version': '<%= pkg.version %>',
                        'plugins': '<%= pkg.plugins %>'
                    }
                },
                files: {
                    'demo/index.html': ['src/index.html']
                }
            }
        },
        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: 'demo/index.html',
            options: {
                dest: 'demo',
                flow: {
                    html: {
                        steps: {
                            js: ['concat'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['demo/{,*/}*.html'],
            // css: ['demo/styles/{,*/}*.css'],
            js: ['demo/scripts/{,*/}*.js'],
            options: {
                assetsDirs: ['demo']
            }
        },
        // The following *-min tasks will produce minified files in the dist folder
        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        cssmin: {
            dist: {
                files: {
                    'demo/styles/main.css': ['bower_components/{,*/}*.css']
                }
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

    grunt.registerTask('demoPage', 'Generate demo page', [
        'dist',
        'clean',
        'template',
        'wiredep',
        'copy:demoJs',
        'uglify:demo',
        'injector'
    ]);

    grunt.registerTask('demo', 'Generate demo page', function(target) {

        if (target === 'dist') {

            grunt.task.run([
                'demoPage',
                // 'useminPrepare',
                'usemin'
            ]);

        } else if (target === 'server') {

            grunt.task.run([
                'demoPage',
                // 'useminPrepare',
                'usemin',
                'connect:dist',
                'watch'
            ]);

        }

    });

};
