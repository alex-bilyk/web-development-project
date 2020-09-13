const { src, dest, series, watch } = require('gulp')
const cnf = require('./package.json').config
const sass = require('gulp-sass')
const browserSync = require('browser-sync').create()
const uglify = require('gulp-uglify-es').default
const cssnano = require('gulp-cssnano')
const del = require('del')
const imagemin = require('gulp-imagemin')
const cache = require('gulp-cache')
const autoprefixer = require('gulp-autoprefixer')
const babel = require('gulp-babel')
const include = require('gulp-include')
const tildeImporter = require('node-sass-tilde-importer')

function html () {
	return src('src/**.html')
		.pipe(dest('dist'))
}

function scss () {
	return src(cnf.src.sass)
		.pipe(sass({
			importer: tildeImporter
		}))
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7']))
		.pipe(cssnano())
		.pipe(dest('src/css/'))
}

function js () {
	return src(cnf.src.js)
		.pipe(babel())
		.pipe(include({
		    extensions: 'js',
		    hardFail: true
		}))
		.pipe(uglify())
		.pipe(dest(cnf.dist.js))
}

function css () {
	return src('src/css/**.*')
		.pipe(dest('dist/css/'))
}

function img () {
	return src('src/img/*.*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		optimizationLevel: 5,
		svgPlugins: [
			{ removeViewBox: false },
			{ cleanupIDs: false }
		]
	})))
	.pipe(dest('dist/img'))
}

function fonts () {
	return src(cnf.src.fonts)
		.pipe(dest(cnf.dist.fonts))
}

function clear () {
	return del('dist')
}

function serve () {
	browserSync.init({
		server: './src'
	})
  
	watch('src/**.html', series(html)).on('change', browserSync.reload)
	watch('src/sass/**/**.scss', series(scss)).on('change', browserSync.reload)
	watch('src/js/**.js', series(js)).on('change', browserSync.reload)
}

exports.build = series(clear, css, html, js, fonts, img)
exports.serve = series(clear, scss, serve)
exports.clear = clear