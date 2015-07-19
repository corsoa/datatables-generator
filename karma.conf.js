module.exports = function(config) {
  config.set({
    autoWatch: true,
    basePath: 'tests',
    browsers: ['Chrome', 'PhantomJS'],
    colors: true,
    files: [
      '*.js'
    ],
    frameworks: ['jasmine-jquery', 'jasmine'],
    exclude: [],
    reporters: ['progress'],
    singleRun: false
  })
};
