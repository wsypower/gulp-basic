var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    livereload = require('gulp-livereload'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    pump = require('pump'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber');
var $ = require('gulp-load-plugins')();

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

//创建静态服务器并监听less文件和html文件的修改
gulp.task('serve', ['cssFix', 'js','Imagemin'], function () {
    browserSync.init({
        server: "./dist/"
    });
    gulp.watch("src/scss/*.scss", ['cssFix']);
    gulp.watch("src/js/*.js", ['js']);
    // gulp.watch("dist/*.html").on('change', reload);
    gulp.watch("src/js/*.js").on('change', reload);
});

//编译scss 自动增加后缀 css压缩

gulp.task('cssFix', function () {
    gulp.src('src/scss/*.scss')
        .pipe(
            sass()
        )
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            remove: false //是否去掉不必要的前缀 默认：true
        }))
        // .pipe(cssmin({
        //   keepSpecialComments: '*'
        // }))
        // .pipe(rename({
        //   suffix: '.min'
        // }))
        // .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('js', function (cb) {
    pump([
            gulp.src('./src/js/*.js'),
            sourcemaps.init(),
            // jshint(),
            concat('static.js'),
            babel({
                presets: ['es2015']
            }),
            // rename({
            //   suffix: '.min'
            // }),
            //压缩操作
            // uglify({}),
            // sourcemaps.write('.'),
            gulp.dest('./dist/js')
        ],
        cb //函数有参数
    );
});

gulp.task('es6', function () {
    gulp.src('src/js/*.js')
        .pipe($.plumber())
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('src/es5'));
});

//图片压缩
gulp.task('Imagemin', function () {
    gulp.src('src/img/*.{png,jpg,gif,ico}')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

gulp.task('default', ['serve']);
