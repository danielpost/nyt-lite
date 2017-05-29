'use strict';

module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  /**
   * Grunt configuration
   */
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    /**
     * Set project info
     */
    project: {
      src: {
        dir: './src',
        node: './node_modules',
        sass: '<%= project.src.dir %>/scss',
        svg: '<%= project.src.dir %>/svg',
        js: '<%= project.src.dir %>/js'
      },
      app: {
        dir: './dist',
        assets: '<%= project.app.dir %>/assets',
        js: '<%= project.app.assets %>/js',
        css: '<%= project.app.assets %>/css',
        images: '<%= project.app.assets %>/images',
        svg: '<%= project.app.assets %>/svg',
      },
      banner: {
        general: '/*!\n' +
          ' * <%= pkg.title %>\n' +
          ' * <%= pkg.url %>\n' +
          ' * @author <%= pkg.author.name %> <<%= pkg.author.email %>> (<%= pkg.author.url %>)\n' +
          ' * @version <%= pkg.version %>\n' +
          ' * Copyright <%= pkg.copyright %> <%= pkg.author.name %>.\n' +
          ' */\n',
        theme: '/*!\n' +
          ' * Theme Name:    <%= pkg.title %>\n' +
          ' * Theme URI:     <%= pkg.url %>\n' +
          ' * Description:   <%= pkg.description %>\n' +
          ' * Author:        <%= pkg.author.name %>\n' +
          ' * Author URI:    <%= pkg.author.url %>\n' +
          ' * Version:       <%= pkg.version %>\n' +
          ' * Text Domain:   <%= pkg.name %>\n' +
          ' */\n'
      }
    },

    /*
     * Set notify hooks options
     */
    notify_hooks: {
      options: {
        enabled: true,
        max_jshint_notifications: 5,
        title: "<%= pkg.title %>"
      }
    },

    /**
     * JSHint
     * https://github.com/gruntjs/grunt-contrib-jshint
     * Validates JS files
     */
    jshint: {
      options: {
        jshintrc: true
      },
      dist: {
        options: {
          "devel": false
        },
        files: {
          src: ['<%= project.src.js %>/*.js']
        }
      },
      dev: {
        options: {
          "devel": true
        },
        files: {
          src: ['<%= project.src.js %>/*.js']
        }
      }
    },

    /**
     * Uglify
     * https://github.com/gruntjs/grunt-contrib-uglify
     * Compresses and minifies all JavaScript files into one
     */
    uglify: {
      dist: {
        options: {
          banner: '<%= project.banner.general %>'
        },
        files: {
          '<%= project.app.js %>/main.js': '<%= project.src.js %>/*.js',
          '<%= project.app.js %>/vendor/html5shiv.min.js': '<%= project.src.node %>/html5shiv/dist/html5shiv.js',
          '<%= project.app.js %>/vendor/vue.min.js': '<%= project.src.node %>/vue/dist/vue.min.js'
        }
      },
      dev: {
        options: {
          banner: '<%= project.banner.general %>'
        },
        files: {
          '<%= project.app.js %>/main.js': '<%= project.src.js %>/*.js',
          '<%= project.app.js %>/vendor/html5shiv.min.js': '<%= project.src.node %>/html5shiv/dist/html5shiv.js',
          '<%= project.app.js %>/vendor/vue.min.js': '<%= project.src.node %>/vue/dist/vue.js'
        }
      }
    },

    /**
     * ImageMIN
     * https://github.com/gruntjs/grunt-contrib-imagemin
     * Minifies images
     */
    imagemin: {
      svg: {
        options: {
          svgoPlugins: [{
            removeViewBox: false
          }, {
            removeUselessStrokeAndFill: false
          }, {
            sortAttrs: true
          }, {
            removeDimensions: true
          }, {
            removeTitle: true
          }]
        },
        files: [{
          expand: true,
          cwd: '<%= project.src.svg %>/',
          src: '{,*/}*.svg',
          dest: '<%= project.app.svg %>/'
        }]
      },
      dist: {
        options: {
          optimizationLevel: 7,
          cache: false
        },
        files: [{
          expand: true,
          cwd: '<%= project.app.images %>/',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= project.app.images %>/'
        }]
      }
    },

    /**
     * SASS
     * https://github.com/sindresorhus/grunt-sass
     * Compiles SASS/SCSS to CSS
     */
    sass: {
      options: {
        imagePath: '<%= project.app.images %>'
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          '<%= project.app.css %>/main.css': '<%= project.src.sass %>/main.scss',
        }
      },
      dev: {
        options: {
          outputStyle: 'nested',
          sourceMap: true
        },
        files: {
          '<%= project.app.css %>/main.css': '<%= project.src.sass %>/main.scss'
        }
      }
    },

    postcss: {
      options: {
        processors: [
          require('autoprefixer')({
            browsers: ['last 3 versions', 'ie >= 9', 'and_chr >= 2.3']
          }),
        ]
      },
      dev: {
        options: {
          map: true
        },
        src: '<%= project.app.css %>/*.css'
      },
      dist: {
        src: '<%= project.app.css %>/*.css'
      }
    },

    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '<%= project.banner.theme %>',
          linebreak: true
        },
        files: {
          src: [ '<%= project.app.css %>/main.css', '<%= project.app.css %>/main.css' ]
        }
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          '<%= project.app.dir %>/index.html': '<%= project.src.dir %>/index.html'
        }
      },
      dev: {
        files: {
          '<%= project.app.dir %>/index.html': '<%= project.src.dir %>/index.html'
        }
      },
    },

    /**
     * Copy other files
     */
    copy: {
      headers: {
        src: '<%= project.src.dir %>/_headers',
        dest: '<%= project.app.dir %>/_headers',
      },
    },

    /**
     * Notify
     * https://github.com/dylang/grunt-notify
     * Notify when a task is succesful
     */
    notify: {
      js: {
        options: {
          title: 'JavaScript',
          message: 'Minified and checked successfully.'
        }
      },
      sass: {
        options: {
          title: 'SASS',
          message: 'Compiled and moved successfully.'
        }
      },
      dev: {
        options: {
          title: 'Development mode',
          message: 'Development tasks succesfully executed.'
        }
      },
      dist: {
        options: {
          title: 'Production mode',
          message: 'Production tasks succesfully executed.'
        }
      }
    },

    /**
     * Watch
     * https://github.com/gruntjs/grunt-contrib-watch
     * Watches certain files and runs relevant tasks
     */
    watch: {
      options: {
        spawn: false,
        debounceDelay: 1,
        livereload: true,
      },
      grunt: {
        files: ['Gruntfile.js'],
        tasks: ['default']
      },
      js: {
        files: '<%= project.src.js %>/{,*/}*.js',
        tasks: ['jshint:dev', 'uglify:dist', 'notify:js']
      },
      sass: {
        files: '<%= project.src.sass %>/{,*/}*.scss',
        tasks: ['sass:dev', 'postcss:dev', 'usebanner', 'notify:sass'],
        options: {
          livereload: false
        }
      },
      css: {
        files: ['style.css'],
        tasks: []
      },
      html: {
        files: '<%= project.src.dir %>/{,*/}*.html',
        tasks: ['htmlmin:dev']
      }
    }
  });

  /**
   * 'Default' tasks
   * Run `grunt` in the command line
   */
  grunt.registerTask('default', [
    'jshint:dev',
    'uglify:dev',
    'sass:dev',
    'postcss:dev',
    'usebanner',
    'htmlmin:dev',
    'notify:dev',
    'watch'
  ]);

  /**
   * 'Build' tasks
   * Run `grunt build` in the command line
   */
  grunt.registerTask('build', [
    'jshint:dist',
    'uglify:dist',
    'sass:dist',
    'postcss:dist',
    'usebanner',
    'htmlmin:dist',
    'copy',
    'newer:imagemin',
    'notify:dist'
  ]);

  /**
   * Runs the task 'notify_hooks'
   * Required for custom notify options
   */
  grunt.task.run('notify_hooks');
}
