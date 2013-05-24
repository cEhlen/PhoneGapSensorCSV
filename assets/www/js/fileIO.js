(function (window) {
    "use strict";

    var log = document.getElementById("log");

    function fail (error) {
        alert("FAIL");
        console.log(error.code);
    };

    var Writer = null;
    var gPath = null;
    var cb = null;

    var initWriter = function (path, callback) {
        gPath = path;
        cb = callback;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    };

    var gotFS = function (fs) {
        fs.root.getFile(gPath, { create: true, exclusive: false }, gotFileEntry, fail);
    };

    var gotFileEntry = function (fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail);
    };

    var gotFileWriter = function (writer) {
        Writer = writer;
        cb();
    }

    var write = function (text) {
        Writer.write(text);
        log.value = log.value + text;
        log.scrollTop = log.scrollHeight;
    }

    var loadFile = function (path, callback) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
            fs.root.getFile(path, { create: true, exclusive: false }, function (fileEntry) {
                fileEntry.file(function (file) {
                    var reader = new window.FileReader();
                    reader.onloadend = function (evt) {
                        callback(evt.target.result, file);
                    };
                    reader.readAsText(file);
                }, fail);
            }, fail);
        }, fail);
    };

    window.fileIO = {
        initWriter: initWriter,
        loadFile: loadFile,
        write: write
    };

})(window);