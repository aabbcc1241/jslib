// reference [babel] : https://babeljs.io/docs/setup/#installation
// reference [gulp] : https://github.com/gulpjs/gulp/blob/master/docs/API.md
// reference [watchify, browserify] : https://gist.github.com/danharper/3ca2273125f500429945
// refernece [filesize] : http://stackoverflow.com/questions/21806925/get-the-current-file-name-in-gulp-src

// to try [argument, conditional operation] : http://stackoverflow.com/questions/23023650/is-it-possible-to-pass-a-flag-to-gulp-to-have-it-run-tasks-in-different-ways

const
  gulp = require('gulp')
  , clean = require('gulp-clean')
  , filesize = require('gulp-filesize')
  , sourcemaps = require('gulp-sourcemaps')
  , babel = require('gulp-babel')
  , concat = require('gulp-concat')
  , ts = require('gulp-typescript')
  , merge = require('merge2')
  , sass = require('gulp-sass')
  , minifyCss = require('gulp-minify-css')
  , uglify = require('gulp-uglify')
  , rename = require('gulp-rename')
  , replace = require('gulp-replace')
  ;

const paths = {
  html: ['www/index.html']
  , sass: ['www/stylesheet/**/*.scss', 'www/stylesheet/**/*.css']
  , script: [
    'www/script/**/*.ts'
    , 'www/script/**/*.js'
    // , 'www/lib/**/*.js'
    // , '!www/lib/**/typings/**/*.d.ts'
    , 'www/templates/dev/comm.ts'
    , '!www/app.js' // this must be loaded first

    // ,'!www/lib/**/*.ts'
    // , 'www/**/*.ts', 'www/**/*.js' /* include codes */
    // , '!www/lib/**/lib/*.ts', '!www/lib/**/lib/*.ts' /* exclude codes */
    // , '!www/lib/jslib/stub.ts', '!www/lib/jslib/lib/**' /* jslib exclude codes */
  ]
  , distDir: 'www/dist'
  , distFile: ['es5/dist/*', 'es6/dist/*']
  // , srcFile: ['www/**/*', '!www/dist/**/*']
};

/* not used */
gulp.task('babel', () => {
  return gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(filesize())
    .pipe(babel({
      presets: [
        'es2015'
      ]
      , plugins: [
        'transform-runtime'
        , 'babel-plugin-transform-es2015-modules-umd'
      ]
    }))
    .pipe(concat('bundle.js'))
    .pipe(filesize()) // babel output
    .pipe(gulp.dest(paths.distDir));
});

/* not used */
gulp.task('typescript', ()=> {
  return gulp.src('src/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(filesize())
    .pipe(ts({
      target: 'es6'
      , noImplicitAny: true
      , out: 'bundle.js'
    }))
    .pipe(filesize()) // tsc output
    // .pipe(concat('bundle.ts'))
    .pipe(gulp.dest(paths.distDir));
});

gulp.task('sass', done=> {
  gulp.src(paths.sass)
    .pipe(sourcemaps.init())
    .pipe(filesize()) // raw file
    // .pipe(concat('bundle.scss'))
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(filesize()) // sass output
    .pipe(concat('bundle.css'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(filesize()) // minifyCss output
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.distDir))
});

gulp.task('script', (done)=> {
  return gulp.src(paths.script)
    .pipe(sourcemaps.init())
    // .pipe(filesize()) // raw files
    .pipe(ts({
      target: 'es5'
      // , noImplicitAny: true
      // , out: 'bundle.es6.js'
      , allowJs: true
    }))
    // .pipe(gulp.dest('bundle.es6.js'))
    // .pipe(filesize()) // tsc output
    // .pipe(babel({
    //   presets: ['es2015']
    //   , plugins: [
    // 'transform-runtime'
    // , 'babel-plugin-transform-es2015-modules-amd'
    // , 'babel-plugin-transform-es2015-modules-umd'
    // , 'babel-plugin-transform-es2015-modules-commonjs'
    // ]
    // }))
    //   .pipe(sourcemaps.assign)
    // .pipe(concat('bundle.babel.js'))
    // .pipe(filesize()) // babel output

    // .pipe(browserify({
    //   insertGlobals: true
    //   , debug: !gulp.env.production
    // }))
    // .pipe(filesize()) // browserify output

    .pipe(uglify({
      mangle: false
      , define: true
    }))
    .pipe(concat('bundle.min.js'))
    .pipe(filesize()) // uglify output
    .pipe(sourcemaps.write('.'))
    // .pipe(gulp.dest(paths.distDir))
    .pipe(gulp.dest(paths.distDir))
});

/* not used */
gulp.task('html', ()=> {
  gulp.src(paths.html)
    .pipe(replace(/dist\//g, ''))
    .pipe(gulp.dest(paths.distDir))
});

gulp.task('build', ['script', 'sass']);

gulp.task('watch-script', ()=> {
  gulp.watch(paths.script, ['script'])
});

gulp.task('watch-style', ()=> {
  gulp.watch(paths.sass, ['sass'])
});

gulp.task('watch', ['watch-script', 'watch-style']);

gulp.task('clean', ()=> {
  return gulp.src(paths.distFile, {read: false})
    .pipe(filesize())
    .pipe(clean());
});

/* this is for library, not for web app project*/
gulp.task('typescript-library', ()=> {
  const tsResult = gulp.src(paths.script)
    .pipe(ts({
      declaration: true,
      noExternalResolve: true
    }));
  return merge([
    tsResult.dts.pipe(gulp.dest(paths.distDir + '/definitions'))
    , tsResult.js.pipe(gulp.dest(paths.distDir + '/js'))
  ]);
});

function run_webserver(host, port) {
  return gulp.src('www')
    .pipe(webserver({
      livereload: true
      , host: host || 'localhost'
      , port: port || 8080
      , directoryListing: {
        enable: false
        , path: paths.distDir
      }
      , open: true
    }))
}

gulp.task('run_local', done=> {
  run_webserver('localhost', 8100)
    .on('end', done)
});

// gulp.task('start', ['build', 'watch', 'run']);
gulp.task('start', ['watch', 'run_local']);
