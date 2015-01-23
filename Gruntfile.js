/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        // banner: '<%= banner %>',
        // stripBanners: true
      },
      dist: {
        src: [
            'bower_components/phaser/build/phaser.min.js',
            'develop/**/*.js',
            '!develop/tmp/*'
            ],
        dest: 'develop/tmp/all.js'
      }
    },
    uglify: {
      options: {
        // banner: '<%= banner %>'
      },
      dist: {
        src: 'develop/tmp/all.js',
        dest: 'Gravity/assets/all.min.js'
      }
    },
    watch: {
      gruntfile: {
        files: [
            'develop/**/*.js',
            '!develop/tmp/*'
            ],
        tasks: ['main']
      },
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['concat', 'uglify', 'watch']);
  grunt.registerTask('main', ['concat', 'uglify']);

};
