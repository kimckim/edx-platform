(function (window, undefined) {
    Transcripts.Utils = (function () {
console.log('[Utils]');

        var _getField = function (collection, field_name) {
console.log('[Utils::_getField]');
            var model;

            if (collection && field_name) {
                model = collection.findWhere({
                    field_name: field_name
                });
            }

            return model;
        };

        // These are the types of URLs supported:
        // http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index
        // http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/QdK8U-VIH_o
        // http://www.youtube.com/v/0zM3nApSvMg?fs=1&amp;hl=en_US&amp;rel=0
        // http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s
        // http://www.youtube.com/embed/0zM3nApSvMg?rel=0
        // http://www.youtube.com/watch?v=0zM3nApSvMg
        // http://youtu.be/0zM3nApSvMg
        var _youtubeParser = (function () {
console.log('[Utils::_youtubeParser]');
            var cache = {};

            return function (url) {
console.log('[Utils::_youtubeParser: return]');
                if (typeof url !== 'string') {
                    console.log('Transcripts.Utils.parseYoutubeLink');
                    console.log('TypeError: Wrong argument type.');

                    return false;
                }

                if (cache[url]) {
                    return cache[url];
                }

                var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
                var match = url.match(regExp);
                cache[url] = (match && match[1].length === 11) ? match[1] : void(0);

                return cache[url];
            };
        }());

        var _videoLinkParser = (function () {
console.log('[Utils::_videoLinkParser]');
            var cache = {};

            return function (url) {
console.log('[Utils::_videoLinkParser: return]');

                if (typeof url !== 'string') {
                    console.log('Transcripts.Utils.parseHTML5Link');
                    console.log('TypeError: Wrong argument type.');

                    return false;
                }

                if (cache[url]) {
                    return cache[url];
                }

                var link = document.createElement('a'),
                    match;

                link.href = url;
                match = link.pathname
                            .split('/')
                            .pop()
                            .match(/(.+)\.(mp4|webm)$/);

                if (match) {
                    cache[url] = {
                        video: match[1],
                        type: match[2]
                    };
                }

                return cache[url];
            };
        }());

        var _linkParser = function (url) {
console.log('[Utils::_linkParser]');
            var result;

            if (typeof url !== 'string') {
                console.log('Transcripts.Utils.parseLink');
                console.log('TypeError: Wrong argument type.');

                return false;
            }

            if (_youtubeParser(url)) {
                result = {
                    mode: 'youtube',
                    video: _youtubeParser(url),
                    type: 'youtube'
                };
            } else if (_videoLinkParser(url)) {
                result = $.extend({mode: 'html5'}, _videoLinkParser(url));
            } else {
                result = {
                    mode: 'incorrect'
                };
            }

            return result;
        };

        var _getYoutubeLink = function (video_id) {
console.log('[Utils::_getYoutubeLink]');
            return 'http://youtu.be/' + video_id;
        };

        var _syncCollections = function (fromCollection, toCollection) {
console.log('[Utils::_syncCollections]');
            fromCollection.each(function (m) {
console.log('[Utils::_syncCollections: each]');
                var model = toCollection.findWhere({
                        field_name: m.getFieldName()
                    });

                if (model) {
                    model.setValue(m.getDisplayValue());
                }
            });
        };

        // [Function] _command(action, component_id, videoList, extraParams)
        //
        // [Parameters] TODO: Write purpose and type of each parameter.
        //     action -
        //     component_id -
        //     videoList -
        //     extraParams -
        //
        // [Purpose] TODO: Write the purpose of this function.
        //
        // [Returns] XMLHttpRequest object. Using this object, we can attach
        //     callbacks to AJAX request events (for example on 'done', 'fail',
        //     etc.).
        var _command = (function () {
console.log('[Utils::_command]');
            // We will store the XMLHttpRequest object that $.ajax() function
            // returns, to abort an ongoing AJAX request (if necessary) upon
            // subsequent invocations of _command() function.
            //
            // A new AJAX request will be made on each invocation of the
            // _command() function.
            var xhr = null;

            return function (action, component_id, videoList, extraParams) {
console.log('[Utils::_command: return]');
                var params, data;

                console.log('[_command]: arguments = ', arguments);

                if (extraParams) {
                    if ($.isPlainObject(extraParams)) {
                        params = extraParams;
                    } else {
                        params = {params: extraParams};
                    }
                }

                data = $.extend(
                    { id: component_id },
                    { videos: videoList },
                    params
                );

                if (xhr && xhr.abort) {
                    xhr.abort();
                }

                xhr = $.ajax({
                    url: '/transcripts/' + action,
                    data: { data: JSON.stringify(data) },
                    type: 'get'
                });

                return xhr;
            };
        }());

        return {
            getField: _getField,
            parseYoutubeLink: _youtubeParser,
            parseHTML5Link: _videoLinkParser,
            parseLink: _linkParser,
            getYoutubeLink: _getYoutubeLink,
            syncCollections: _syncCollections,
            command: _command
        };
    }());
}(this));
