var gulp = require('gulp');
var sass = require('gulp-sass');
var sassLint = require('gulp-sass-lint');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var spritesmith = require('gulp.spritesmith');
var replace = require('gulp-replace');
var concat = require('gulp-concat');

gulp.task('watch',function () {
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/**/*.scss', ['sass']);
});

gulp.task('html', function () {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
});

gulp.task('sass-lint', function () {
    return gulp.src(['src/**/*.scss', '!src/styles/sprite.scss'])
        .pipe(sassLint({
            options: {
                formatter: 'stylish'
            }
        }))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
});

gulp.task('sass',['sass-lint'], function () {
    gulp.src('src/styles/style.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        .pipe(gulp.dest('./dist/css'))
        .pipe(gulp.dest('dist/css/'))
});

gulp.task('images', function () {
    gulp.src('src/img/**/*')
        .pipe(gulp.dest('dist/img'));
});

gulp.task('vendor', function () {
    gulp.src('node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('dist/js'));
    gulp.src('node_modules/jquery-lazyload/jquery.lazyload.js')
        .pipe(gulp.dest('dist/js'));
});

gulp.task('skeleton', function(){
    gulp.src(['node_modules/skeleton-css/css/skeleton.css'])
        .pipe(replace('@media (min-width: 550px)', '@media (min-width: 768px)'))
        .pipe(gulp.dest('node_modules/skeleton-css/css/'));
});

gulp.task('autoprefixer', function () {
    return gulp.src('./dist/css/style.css')
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('concat-css', function() {
    return gulp.src(['dist/css/vendor.css', 'dist/css/style.css'])
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('vendor-css', ['skeleton'], function() {
    return gulp.src(['node_modules/skeleton-css/css/normalize.css', 'node_modules/skeleton-css/css/skeleton.css'])
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('concat-js', function() {
    return gulp.src(['dist/js/jquery.min.js', 'dist/js/jquery.lazyload.js'])
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('sprite', function () {
    var spriteData = gulp.src('src/sprites/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.scss',
        algorithm: 'top-down'
    }));
    return spriteData.pipe(gulp.dest('dist/sprites'));
});

gulp.task('sprite-to-styles', function () {
    gulp.src('dist/sprites/sprite.scss')
        .pipe(gulp.dest('src/styles'));
});

gulp.task('replace-sprite', function(){
    gulp.src(['src/styles/sprite.scss'])
        .pipe(replace('background-image: url(#{$sprite-image});', 'background-image: url(../sprites/#{$sprite-image});'))
        .pipe(gulp.dest('src/styles'));
});

gulp.task('build', ['html', 'sass', 'images', 'vendor', 'vendor-css','autoprefixer', 'sprite', 'sprite-to-styles', 'replace-sprite']);
