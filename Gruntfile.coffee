module.exports = (grunt) ->
  application_name = "Fluidity UI Build"

  grunt.initConfig
    coffee:
      compile_build:
        expand: true
        cwd: 'src/'
        src: ['fluidity-ui.coffee']
        dest: '.'
        ext: '.js'

    coffeelint:
      lintall: ['*.coffee']

    uglify:
      js:
        files:
          'fluidity-ui.min.js': 'fluidity-ui.js'

    clean:
      build:
        src:
          ['*.js']
        filter: 'isFile'


  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-clean'

  grunt.registerTask 'default', ['build']

  grunt.registerTask 'build',
     ['clean',
      'coffee:compile_build',
      'uglify']
