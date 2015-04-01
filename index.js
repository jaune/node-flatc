var path_ = require('path'),
	fs_ = require('fs'),
	tmp_ = require('tmp'),
    fse_ = require('fs-extra'),
	spawn_ = require('child_process').spawn;

function flatc_json_to_bin(schema_path, json_path, bin_path, done) {
    var flatc_path = path_.join(__dirname, 'run.bat');

    tmp_.dir({unsafeCleanup: true}, function (error, output_path, cleanupCallback) {
        if (error) { return done(error); }

        var child = spawn_(flatc_path, ['-b', schema_path, json_path], {
             cwd: output_path
        });

        var stdout = '';

        child.stdout.on('data', function (data) {
            stdout += data.toString();
        });

        child.on('exit', function () {
            fs_.readdir(output_path, function (error, files) {
                if (error) { return done(error); }

                if (files.length !== 1) {
                    done(new Error(stdout));
                    return;
                }

                fse_.copy(path_.join(output_path, files.pop()), bin_path, function (error) {
                    cleanupCallback();
                    if (error) { return done(error); }

                    done(null);
                });
            });
        });
      
    });
}

var Schema = function (path) {
    this.path = path;
};

Schema.prototype.encode = function(json_path, bin_path, done) {
    flatc_json_to_bin(this.path, json_path, bin_path, done);
};

module.exports = {
    bin_path: fs_.readFileSync(path_.join(__dirname, 'path.txt'), 'utf-8'),
    Schema: Schema
};