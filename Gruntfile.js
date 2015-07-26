module.exports = function(grunt) {
    var jsLocation = 'public/assets/js',
        cssLocation = 'public/assets/css';
    grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
        wiredep: {
            target: {
                src: 'public/index.html'
            }
        },
        jsbeautifier: {
            files: ['<%= jshint.files%>'],
            options: {}
        },
        jshint: {
            reporter: require('jshint-stylish'),
            jshintrc: ".jshintrc",
            files: ['Gruntfile.js', 'app.js', 'public/assets/js/src/**.js']
        },
        less: {
            development: {
                options: {
                    compress: true,
                    sourceMap: true,
                    sourceMapURL: "assets/css/style.min.css.map",
                    sourceMapBasepath: "public"
                },
                files: {
                    "public/assets/css/style.min.css": "public/assets/css/src/style.less"
                }
            }
        },
        watch: {
            javascripts: {
                files: ['<%= jshint.files %>'],
                tasks: ['build-develop']
            },
            css: {
                files: [cssLocation + '/src/*.less'],
                tasks: ['less']
            },
            karma: {
                files: ['tests/']
            }
        },
        uglify: {
            my_target: {
                files: {
                    'public/assets/js/datatables-generator.min.js': [jsLocation + '/src/datatables-generator.js', jsLocation + '/src/utils.js']
                },
                options: {
                    sourceMap: true,
                    sourceMapName: 'public/assets/js/sourcemap.map'
                }
            }
        },
        jsdoc: {
            dist: {
                src: ['public/assets/js/src/*.js'],
                options: {
                    destination: 'public/doc',
                    template: 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template',
                    configure: 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json'
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-karma');

    //the main task to use during development
    grunt.registerTask('build-develop', ['wiredep', 'jsbeautifier', 'jshint', 'jsdoc', 'karma', 'less', 'uglify', 'watch']);
    //verify tests quickly
    grunt.registerTask('test', ['karma:unit']);
    //production builds.
    grunt.registerTask('default', ['wiredep', 'jsdoc', 'less', 'uglify']);
};
