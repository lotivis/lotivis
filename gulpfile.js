const {src, dest, watch, parallel} = require("gulp");

const sass = require('gulp-sass');
const stripCssComments = require('gulp-strip-css-comments');

const cleanCSS = require('gulp-clean-css');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const uglify = require("gulp-uglify");

const sync = require("browser-sync").create();
const eslint = require("gulp-eslint");

var rollup = require('rollup-stream');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

function generateJS(cb) {
    rollup({
        input: './source/js/application.js',
        format: 'umd',
        name: 'frcv',
        sourcemap: true,
        banner: `/* @license frcv.js | (c) Lukas Danckwerth */`,
        globals: { d3: 'd3' },
        external: ['d3']
    })
        .pipe(source('frcv.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./public/js'))
        .pipe(minify({
            ext: {
                min: '.min.js'
            }
        }).on('error', function (error) {
            console.log(error);
            cb();
        }))
        .pipe(dest('./public/js'));
    cb();
}

function generateCSS(cb) {
    src('source/sass/main.scss')
        .pipe(sourcemaps.init())
        .pipe(concat('frcv.css'))
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./public/stylesheets'))
    src('source/sass/main.scss')
        .pipe(concat('frcv.min.css'))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(dest('./public/stylesheets'))
    cb();
}

function runLinter(cb) {
    return src(['source/**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .on('end', function () {
            cb();
        });
}

function copyHTML(cb) {
    src('source/html/*.html')
        .pipe(dest('./public/html'));
    cb();
}

function browserSync(cb) {
    // sync.init({
    //     server: {
    //         baseDir: "./public"
    //     },
    //     cors: true,
    //     middleware: function (req, res, next) {
    //         res.setHeader('Access-Control-Allow-Origin', '*');
    //         res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //         next();
    //     }
    // });

    watch('./source/js/**.js', generateJS);//.on('change', sync.reload);
    watch('./source/js/*/**.js', generateJS);//.on('change', sync.reload);
    watch('./source/js/*/*/**.js', generateJS);//.on('change', sync.reload);
    watch('./source/sass/**.scss', generateCSS);//.on('change', sync.reload);
    watch('./source/html/**.html', copyHTML);
    // watch("./public/**.html");// .on('change', sync.reload);
}

exports.js = generateJS;
exports.css = generateCSS;
exports.html = copyHTML;
exports.lint = runLinter;
exports.sync = browserSync;
