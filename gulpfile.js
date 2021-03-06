var app = {  // 定义目录
  srcPath: 'src/',
  _srcPath: '!src/',
  buildPath: 'build/',
  distPath: 'dist/'
}

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
  plumber = require('gulp-plumber'),
  connect = require('gulp-connect'),
  open = require('open');
var $ = require('gulp-load-plugins')();

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

//创建静态服务器并监听scss文件和html文件的修改
gulp.task('serve', ['cssFix', 'js', 'Imagemin', 'html'], function () {
  browserSync.init({
    server: "./dist/"
  });
  gulp.watch("src/scss/*.scss", ['cssFix']);
  gulp.watch("src/js/*.js", ['js']);
  // gulp.watch("src/*.html").on('change', reload);
  gulp.watch("src/js/*.js").on('change', reload);
  gulp.watch(app.srcPath+'**/*.html',['html']).on('change', reload);
  gulp.watch(app.srcPath+'image/**/*',['image']).on('change', reload);
});
/*同时执行多个任务 [其它任务的名称]
 * 当前bulid时，会自动把数组当中的所有任务给执行了。
 * */
// gulp.task('build', ['cssFix', 'js', 'Imagemin', 'html']);


/*定义server任务
 * 搭建一个服务器。设置运行的构建目录
 * */
// gulp.task('serve', ['build'], function () {
//   /*设置服务器*/
//   connect.server({
//     root: [app.buildPath],//要运行哪个目录
//     livereload: true,  //是否热更新。
//     port: 9999  //端口号
//   })
//   /*监听哪些任务*/
//   gulp.watch("src/scss/*.scss", ['cssFix']);
//   gulp.watch("src/js/*.js", ['js']);
//   // gulp.watch("src/*.html").on('change', reload);
//   gulp.watch("src/js/*.js").on('change', reload);
//   gulp.watch(app.srcPath + '**/*.html', ['html']).on('change', reload);
//   gulp.watch(app.srcPath + 'image/**/*', ['image']).on('change', reload);
//
//   //通过浏览器把指定的地址 （http://localhost:9999）打开。
//   open('http://localhost:9999');
// });

//定义任务 把所有html文件移动另一个位置*/
gulp.task('html', function () {
  /*要操作哪些文件 确定源文件地址*/
  gulp.src([
    app.srcPath + '**/*.html',
    app._srcPath + 'scss/**',//除了scss文件下的文件
  ])  /*src下所有目录下的所有.html文件*/
  //.pipe(gulp.dest(app.buildPath)) //gulp.dest 要把文件放到指定的目标位置
    .pipe(gulp.dest(app.distPath))
    .pipe(connect.reload()) //当内容发生改变时， 重新加载。
});

//定义任务 把把其他文件勿动搬入dist*/
gulp.task('move', function () {
  /*要操作哪些文件 确定源文件地址*/
  gulp.src([
    app.srcPath + '**/**',
    app._srcPath + 'image/**',//除了scss文件下的文件
    app._srcPath + 'scss/**',//除了scss文件下的文件
    app._srcPath + 'js/**',//除了scss文件下的文件
  ])  /*src下所有目录下的所有.html文件*/
  //.pipe(gulp.dest(app.buildPath)) //gulp.dest 要把文件放到指定的目标位置
    .pipe(gulp.dest(app.distPath))
    .pipe(connect.reload()) //当内容发生改变时， 重新加载。
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
      // concat('static.js'),
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
  gulp.src('src/image/*.{png,jpg,gif,ico}')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/image'));
});

gulp.task('default', ['serve']);
