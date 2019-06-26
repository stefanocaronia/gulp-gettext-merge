# gulpPoSync

Gulp wrapper for gettext-merge, used for syncing multiple po files with a single pot file.
Hope it can be useful to automate wordpress developing.

The actual merge script is almost copy and pasted from:

https://www.npmjs.com/package/gettext-merge

## Install

```bash
npm install gulp-po-sync --save-dev
```

## Basic Usage

```javascript
const gulpPoSync = require('gulp-po-sync');

gulp.task('poSyncTask', function () {
    return gulp.src(themedir + 'languages/**/*.po')
        .pipe(gulpPoSync(themedir + 'languages/theme.pot'))
        .pipe(gulp.dest(themedir + 'languages'));
});

```

## Advanced wordpress workflow example

```javascript
const wpPot = require('gulp-wp-pot');
const po2mo = require('gulp-po2mo');
const poSync = require('gulp-po-sync');

const cssTask = () => {
    // gulp sass conversion
}

const tsTask = () => {
    // gulp ts conversion
}

const createPotTask = () => {
    return gulp.src(themedir + '**/*.php')
        .pipe(wpPot({domain: 'themedomain', theme: 'themedomain'}))
        .pipe(gulp.dest(themedir + 'languages/theme.pot'));
};

const poSyncTask = (done) => {
    return gulp.src(themedir + 'languages/**/*.po')
        .pipe(poSync(themedir + 'languages/theme.pot'))
        .pipe(gulp.dest(themedir + 'languages'));
};

const po2moTask = () => {
    return gulp.src(themedir + 'languages/**/*.po')
        .pipe(po2mo())
        .pipe(gulp.dest(themedir + 'languages'));
};

const localizationTask = gulp.series(createPotTask, poSyncTask, po2moTask);
const buildTask = gulp.parallel(cssTask, tsTask, localizationTask);

const watchTask = () => {
    livereload.listen();
    gulp.watch(sassFiles, cssTask);
    gulp.watch(tsFiles, tsTask);
    gulp.watch(themedir + '**/*.php', createPotTask);
    gulp.watch(themedir + 'languages/**/*.pot', poSyncTask);
    gulp.watch(themedir + 'languages/**/*.po', po2moTask);
};

exports.default = gulp.series(buildTask, watchTask);

```