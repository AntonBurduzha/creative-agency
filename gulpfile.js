var gulp = require('gulp');
var sass = require('gulp-sass');
var sassLint = require('gulp-sass-lint');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var spritesmith = require('gulp.spritesmith');
var replace = require('gulp-replace');

gulp.task('html', function () {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
});

gulp.task('images', function () {
    gulp.src('src/img/**/*')
        .pipe(gulp.dest('dist/img'))
});

gulp.task('watch',function () {
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/**/*.scss', ['sass']);
});

gulp.task('sass-lint', function () {
    return gulp.src(['src/**/*.scss'])
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

gulp.task('autoprefixer', function () {
    return gulp.src('./dist/css/style.css')
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        .pipe(gulp.dest('./dist'));
});

gulp.task('vendor', function () {
    gulp.src('node_modules/skeleton-css/css/normalize.css')
        .pipe(gulp.dest('dist/css'));
    gulp.src('node_modules/skeleton-css/css/skeleton.css')
        .pipe(gulp.dest('dist/css'));
    gulp.src('node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('dist/js'));
    gulp.src('node_modules/jquery-lazyload/jquery.lazyload.js')
        .pipe(gulp.dest('dist/js'));
});

gulp.task('replace', function(){
    gulp.src(['dist/css/skeleton.css'])
        .pipe(replace('@media (min-width: 550px)', '@media (min-width: 768px)'))
        .pipe(gulp.dest('dist/css/skeleton-changed.css'));
});

gulp.task('sprite', function () {
    var spriteData = gulp.src('src/img/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.scss'
    }));
    return spriteData.pipe(gulp.dest('dist/sprites'));
});

gulp.task('build', ['html', 'sass', 'images']);
