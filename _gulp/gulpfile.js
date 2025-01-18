import gulp from 'gulp';
import {deleteSync} from 'del';

// 本番とテストの設定
const env = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : '';

// テスト環境用設定(デフォルト)
let thisCssStyle = 'expanded'; // css圧縮しない
let thisCssMap = true; // css.mapを作成する
// 本番環境用設定
if(env === 'production') {
  thisCssStyle = 'compressed'; // css圧縮する
  thisCssMap = false; // css.mapを作成しない
}

//scss
import sass from 'gulp-dart-sass';//Dart Sass はSass公式が推奨 @use構文などが使える
import plumber from 'gulp-plumber';// エラーが発生しても強制終了させない
import notify from 'gulp-notify';// エラー発生時のアラート出力
import postcss from 'gulp-postcss';// PostCSS利用
import autoprefixer from 'gulp-autoprefixer';//ベンダープレフィックス自動付与
import mqpacker from 'css-mqpacker';//メディアクエリをまとめる
import browserSync from 'browser-sync';//ブラウザリロード
import ssi from 'browsersync-ssi';//ブラウザ_SSI


//webpack
// const webpack = require("webpack");
// const webpackStream = require("webpack-stream"); // gulpでwebpackを使うために必要なプラグイン
// webpackの設定ファイルの読み込み
// const webpackConfig = require("./webpack.config");

//画像圧縮
import imagemin from 'gulp-imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';


//svgスプライト
import svgmin from 'gulp-svgmin';
import svgSprite from 'gulp-svg-sprite';


// 入出力するフォルダを指定
const srcBase = '../_static/src';
const assetsBase = '../_assets';
const publicBase = '../_assets/public';
const distBase = '../_static/dist';
const serverBase = '../_server/wp/wp-content/themes/dummy';

const publicPath = [
  publicBase + '/**/*',
  publicBase + '/**/.*'
];

const srcPath = {
  'scss': assetsBase + '/scss/**/*.scss',
  'js': assetsBase + '/js/**/*.js',
  'img': [assetsBase + '/img/**/*','!' + assetsBase + '/img/svg/*.svg'],
  'svg': [
    assetsBase + '/img/svg/*.svg',
  ],
  'font': assetsBase + '/font/**/*',
  'html': srcBase + '/**/*.html',
  'php': srcBase + '/**/*.php',
};

const distPath = {
  'css': distBase + '/css/',
  'js': distBase + '/js/',
  'img': distBase + '/img/',
  'svg': distBase + '/img/svg/',
  'font': distBase + '/font/',
  'html': distBase + '/',
  'php': distBase + '/',
};

const serverDistPath = {
  'css': serverBase + '/css/',
  'js': serverBase + '/js/',
  'img': serverBase + '/img/',
  'svg': serverBase + '/img/svg/',
  'font': serverBase + '/font/',
};

/**
 * clean
 */
const clean = (cb)=>{
  // return del([distBase+'/**'],{force:true});
  // return deleteSync([distBase+'/**'],{force:true});
  deleteSync([distBase+'/**'],{force:true});
  cb();
}

//postcss-cssnext ブラウザ対応条件 prefix 自動付与
const TARGET_BROWSERS = [
  'last 2 versions',
  'iOS >= 10',
  'Android >= 8.0'
];

/**
 * sass
 *
 */

const cssSass = () => {

  return gulp.src(srcPath.scss, {
    sourcemaps: thisCssMap
  })
      .pipe(
          //エラーが出ても処理を止めない
          plumber({
            errorHandler: notify.onError('Error:<%= error.message %>')
          }))
      .pipe(sass({ outputStyle: thisCssStyle })) //指定できるキー nested expanded compact compressed
      .pipe(postcss([mqpacker()])) // メディアクエリを圧縮
      .pipe(autoprefixer(TARGET_BROWSERS))
      .pipe(gulp.dest(distPath.css, { sourcemaps: './' }))         //コンパイル先
      .pipe(gulp.dest(serverDistPath.css, { sourcemaps: './' }))         //コンパイル先
      .pipe(browserSync.stream())
      .pipe(notify({
        message: 'Sassをコンパイルしました！',
        onLast: true
      }));
}

/**
 * webpack
 * トランスパイルとバンドルを行う
 * 設定はwebpack.config.jsにて行う
 */
// const jsBundle = () => {
//   // bundleする
//   if ( thisJsBundle ) {
//     return webpackStream(webpackConfig, webpack)
//       .pipe(gulp.dest(distPath.js))
//       .pipe(gulp.dest(serverDistPath.js));
//   }
//   // bundleせずにコピーだけ
//   else {
//     return gulp.src(srcPath.js)
//       .pipe(gulp.dest(distPath.js))
//       .pipe(gulp.dest(serverDistPath.js))
//   }
// }

/**
 * js
 */
const js = () => {
  return gulp.src(srcPath.js)
      .pipe(gulp.dest(distPath.js))
      .pipe(gulp.dest(serverDistPath.js))
}

/**
 * 画像圧縮
 */
const imgImagemin = () => {
  return gulp.src(srcPath.img)
      .pipe(
          imagemin(
              [
                // 下記を使用すると、圧縮後の画像でwindowsとmacで差分が出るため注意
                // imageminMozjpeg({
                //   quality: 95
                // }),
                // imageminPngquant(),
                // imageminSvgo({
                //   plugins: [
                //     {
                //       removeViewbox: false
                //     }
                //   ]
                // })
              ],
              {
                verbose: true
              }
          )
      )
      .pipe(gulp.dest(distPath.img))
      .pipe(gulp.dest(serverDistPath.img))
}

/**
 * SVGスプライト
 */
// sprite
const svg = () => {
  return gulp
    .src(srcPath.svg)
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(svgmin({
      plugins: [
        { removeTitle: true },
        { removeAttrs: { attrs: ['fill', 'class', 'id', 'data-name', 'stroke'] } },
        { removeStyleElement: true },
        { removeViewBox: false },
      ]
    }))
    .pipe(svgSprite({
      mode: {
        symbol: {
          dest: '.',
          sprite: 'sprite.min.svg'
        }
      }
    }))
    .pipe(gulp.dest(distPath.svg))
    .pipe(gulp.dest(serverDistPath.svg))
    .pipe(notify({
      message: 'SVGスプライトを生成しました！',
      onLast: true
    }));
}

/**
 * 独自fontをsrc配下に読み込む際の対応
 */
const font = () => {
  return gulp.src(srcPath.font)
      .pipe(gulp.dest(distPath.font))
      .pipe(gulp.dest(serverDistPath.font))
}

/**
 * html
 */
const html = () => {
  return gulp.src(srcPath.html)
      .pipe(gulp.dest(distPath.html))
}

/**
 * public
 */
const public_file = () => {
  return gulp.src(publicPath)
      .pipe(gulp.dest(distBase))
      .pipe(gulp.dest(serverBase))
}

/**
 * php
 */
const php = () => {
  return gulp.src(srcPath.php)
      .pipe(gulp.dest(distPath.php))
}


/**
 * ローカルサーバー立ち上げ
 */
const browserSyncFunc = () => {
  browserSync.init(browserSyncOption);
}

const browserSyncOption = {
  /**
   * MAMPなどを使う時はコメントアウトの方を使用
   */
  // proxy: 'http://localhost:80', //環境によって変更する 80はMAMPのアドレスと同じにすること！
  server : {
    baseDir: distBase,
    middleware: [
      ssi({
        baseDir: distBase,
        ext: ".html"
      })
    ]
  }
}

/**
 * リロード
 */
const browserSyncReload = (done) => {
  browserSync.reload();
  done();
}

/**
 *
 * ファイル監視 ファイルの変更を検知したら、browserSyncReloadでreloadメソッドを呼び出す
 * series 順番に実行
 * watch('監視するファイル',処理)
 */
const watchFiles = () => {
  gulp.watch(srcPath.scss, gulp.series(cssSass))
  gulp.watch(srcPath.js, gulp.series(js,browserSyncReload))
  gulp.watch(srcPath.img, gulp.series(imgImagemin, browserSyncReload))
  gulp.watch(srcPath.svg, gulp.series(svg, browserSyncReload))
  gulp.watch(srcPath.font, gulp.series(font, browserSyncReload))
  gulp.watch(srcPath.html, gulp.series(html, browserSyncReload))
  gulp.watch(srcPath.php, gulp.series(php, browserSyncReload))
  gulp.watch(publicPath, gulp.series(public_file, browserSyncReload))
}

/**
 * seriesは「順番」に実行
 * parallelは並列で実行
 *
 * 一度cleanでdistフォルダ内を削除し、最新のものをdistする
 */
export default　gulp.series(
  clean,
  gulp.parallel(cssSass, imgImagemin, svg, js, font, html, php, public_file),
    gulp.parallel(watchFiles,browserSyncFunc),
);


export function build(cb){
  gulp.series(
      clean,
      gulp.parallel(cssSass, imgImagemin, svg, js, font, html, php, public_file),
  );
  cb();
}
