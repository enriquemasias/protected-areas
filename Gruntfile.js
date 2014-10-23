'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: 'app',
    dist: 'dist',
    tmp: '.tmp'
  };

  grunt.initConfig({
    root: appConfig,

    /**
     * The actual grunt server settings.
     */
    connect: {
      options: {
        port: 9000,
        hostname: '0.0.0.0',
        livereload: 35729,
        base: '<%= root.app %>'
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= root.dist %>'
        }
      }
    },

    /**
     * Watches files for changes and runs tasks based on
     * the changed files.
     */
    watch: {
      gruntfile: {
        files: ['Gruntfile.js']
      },
      js: {
        files: ['<%= root.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['jshint:test']
      },
      stylus: {
        files: ['<%= root.app %>/styles/{,*/}*.styl'],
        tasks: ['stylus:server', 'autoprefixer:server']
      },
      jade: {
        files: [
          '<%= root.app %>/views/{,*/}*.jade',
          '<%= root.app %>/*.jade',
          '<%= root.app %>/templates/{,*/}*.jade'
        ],
        tasks: ['jade:server']
      },
      jadeHandlebars: {
        files: ['<%= root.app %>/scripts/templates/{,*/}*.jade'],
        tasks: ['jade:handlebars']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '.tmp/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= root.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}'
        ]
      }
    },

    /**
     * Stylus module configuration.
     */
    stylus: {
      options: {
        compress: false,
        'include css': true
      },
      server: {
        files: {
          '.tmp/styles/index.css': ['<%= root.app %>/styles/index.styl'],
          '.tmp/styles/bootstrap.css': ['<%= root.app %>/styles/bootstrap.styl']
        }
      },
      dist: {
        options: {
          compress: true
        },
        files: {
          '<%= root.dist %>/styles/index.css': ['<%= root.app %>/styles/index.styl'],
          '<%= root.dist %>/styles/bootstrap.css': ['<%= root.app %>/styles/bootstrap.styl']
        }
      }
    },

    /**
     * Jade module configuration.
     */
    jade: {
      options: {
        pretty: true,
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= root.app %>',
          dest: '.tmp',
          src: ['*.jade'],
          ext: '.html'
        }]
      },
      handlebars: {
        files: [{
          expand: true,
          cwd: '<%= root.app %>',
          dest: '.tmp',
          src: ['scripts/templates/{,*/}*.jade'],
          ext: '.handlebars'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= root.app %>',
          dest: '<%= root.dist %>',
          src: ['*.jade'],
          ext: '.html'
        }]
      }
    },

    /**
     * Make sure code styles are up to par and there
     * are no obvious mistakes.
     */
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= root.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    /**
     * Empties folders to start fresh.
     */
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= root.dist %>/{,*/}*',
            '!<%= root.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    /**
     * The requirejs module.
     */
    requirejs: {
      options: {
        baseUrl: '.tmp/scripts',
        name: '../../bower_components/almond/almond', // assumes a production build using almond
        preserveLicenseComments: false,
        useStrict: true,
        wrap: false
      },
      distIndex: {
        options: {
          mainConfigFile: '.tmp/scripts/index.js',
          include: 'index',
          out: '<%= root.dist %>/scripts/index.js'
        }
      }
    },

    /**
     * Add vendor prefixed styles.
     */
    autoprefixer: {
      options: {
        browsers: ['last 2 version']
      },
      server: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= root.dist %>/styles/',
          src: '{,*/}*.css',
          dest: '<%= root.dist %>/styles/'
        }]
      }
    },

    /**
     * Minify SVG using SVGO
     */
    svgmin: {
      options: {
        plugins: [
          {removeViewBox: false},
          {removeUselessStrokeAndFill: false}
        ]
      },
      server: {
        expand: true,
        cwd: '<%= root.app %>/svg',
        src: ['{,*/}*.svg'],
        dest: '<%= root.tmp %>/svg/raw'
      }
    },

    /**
     * Building SVG Icons into css files.
     */
    grunticon: {
      server: {
        files: [{
          expand: true,
          cwd: '<%= root.tmp %>/svg/raw',
          src: ['{,*/}*.svg'],
          dest: '<%= root.tmp %>/svg'
        }],
        options: {
          cssprefix: '.shape-'
        }
      }
    },

    /**
     * Copy files.
     */
    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= root.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif,ico,xml}',
          dest: '<%= root.dist %>/images'
        }]
      },
      distJs: {
        files: [{
          expand: true,
          cwd: '<%= root.app %>/scripts',
          src: '{,*/}{,*/}{,*/}*.{js,csv,psql,cartocss}',
          dest: '.tmp/scripts'
        }]
      }
    },

    /**
     * Prepare usemin.
     */
    useminPrepare: {
      html: [
        '<%= root.app %>/index.html',
      ],
      options: {
        dest: '<%= root.dist %>'
      }
    },

    /**
     * Performs rewrites based on filerev and the useminPrepare configuration.
     */
    usemin: {
      html: [
        '<%= root.dist %>/{,*/}*.html'
      ],
      css: ['<%= root.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= root.dist %>','<%= root.dist %>/images']
      }
    },

    /**
     * Renames files for browser caching purposes.
     */
    filerev: {
      dist: {
        src: [
          '<%= root.dist %>/scripts/{,*/}*.js',
          '<%= root.dist %>/styles/{,*/}*.css',
          '<%= root.dist %>/images/*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= root.dist %>/images/markers/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: {
          '<%= root.dist %>/index.html': '<%= root.dist %>/index.html',
        }
      }
    },

    /**
     * https://github.com/yeoman/grunt-usemin/issues/192
     * Probably there is a better option but still this works nicely.
     */
    'regex-replace': {
      dist: {
        src: ['<%= root.dist %>/index.html'],
        actions: [{
          name: 'requirejs-newpath',
          search: '<script src="../bower_components/requirejs/require.js" data-main=".*"></script>',
          replace: function(match) {
            var regex = /scripts\/.*index/;
            var result = regex.exec(match);
            return '<script src="' + result[0] + '.js"></script>';
          },
          flags: 'g'
        }]
      }
    }

  });

  grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }
    grunt.task.run([
      'clean:server',
      'jade:server',
      'jade:handlebars',
      'svgmin:server',
      'grunticon:server',
      'stylus:server',
      'autoprefixer:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', []);

  grunt.registerTask('build', [
    'clean:dist',
    'stylus:dist',
    'jade:dist',
    'jade:handlebars',
    'useminPrepare',
    'copy:dist',
    'copy:distJs',
    'requirejs:distIndex',
    'filerev',
    'autoprefixer:dist',
    'regex-replace:dist',
    'usemin',
    'htmlmin:dist',
    'clean:server'
  ]);

  grunt.registerTask('default', [
    'serve'
  ]);
};
