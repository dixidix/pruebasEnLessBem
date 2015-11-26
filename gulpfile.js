var gulp = require('gulp'),
    $ = require('gulp-load-plugins')();
    
$.paths = {
        html: {
            all: 'app/**/*.html',
            app:'app/index.html',
            excludeComponents: ['components/**/*template.html'],
            components:['app/components/**/*template.html']
        },
        app: 'app',
        tmp: 'tmp',
        out: 'dist'
    };
$.isDebug = false;


/* @function
* @name getTasks
* @description Get a group of gulp tasks
* @returns {Object} An object containing functions for gulp tasks*/
function getTasks(groupName) {
    return require('./gulp-tasks/' + groupName)(gulp, $);
}

// get the different tasks per group
var scriptTasks = getTasks('scripts'),
    styleTasks = getTasks('styles'),
    htmlTasks = getTasks('html'),
    serveTasks = getTasks('serve');


/*
*************************
* Scripts tasks: */
gulp.task('createComponentTemplates', function(){
    return scriptTasks.createComponentTemplates();
});

gulp.task('bundleComponents', ['createComponentTemplates'], function(done){
    return scriptTasks.directiveBundle(done);
});

gulp.task('libsBundle', function(){
    return scriptTasks.libBundle();
});

gulp.task('moveJSToTmp', function(){
    return scriptTasks.moveToTmp();
});

gulp.task('appBundle', ['bundleComponents','moveJSToTmp'], function(){
    return scriptTasks.appBundle();
});

gulp.task('scripts', ['libsBundle','appBundle'], function(){
    return scriptTasks.scripts();
});

/*
*********************
*/

gulp.task('less', function(){
    return styleTasks.less();
});

gulp.task('styles', ['less', 'resources'], function(){
    return styleTasks.autoprefixAndMin();
});

gulp.task('resources', function () {
    return styleTasks.moveResourcesToDist();
});

gulp.task('html:serve', function(){
    return htmlTasks.htmlServe();
});

gulp.task('html:build', function(){
    return htmlTasks.htmlBuild();
});

gulp.task('serve', ['html:serve','scripts','styles'], function () {
    return serveTasks.serve();
});

gulp.task('build', ['html:build','scripts','styles'], function () {
    return { }; // do nothing other than the pre-reqs (DO NOT SERVE!)
});