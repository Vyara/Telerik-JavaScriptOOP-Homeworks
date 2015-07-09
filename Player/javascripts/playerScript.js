function solve() {
    var module = (function () {
        var player,
            playlist,
            playable,
            audio,
            video,
            validator,
            CONSTANTS = {
                TEXT_MIN_LENGTH: 3,
                TEXT_MAX_LENGTH: 25,
                IMDB_MIN_RATING: 1,
                IMDB_MAX_RATING: 5,
                MAX_NUMBER: 9007199254740992
            };

        function indexOfElementWithIdInCollection(collection, id) {
            var i,
                len = collection.length;
            for (i = 0; i < len; i += 1) {
                if (collection[i].id == id) {
                    return i;
                }
            }

            return -1;
        }

        function getSortingFunction(firstParameter, secondParameter) {
            return function (first, second) {
                if (first[firstParameter] < second[firstParameter]) {
                    return -1;
                } else if (first[firstParameter] > second[firstParameter]) {
                    return -1;
                }
                if (first[secondParameter] < second[secondParameter]) {
                    return -1;
                } else if (first[secondParameter] > second[secondParameter]) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
        }

        validator = {
            validateIfUndefined: function (val, name) {
                name = name || 'Value';
                if (val === undefined) {
                    throw new Error(name + ' cannot be undefined');
                }
            },

            validateIfObject: function (val, name) {
                name = name || 'Value';
                if (typeof val !== 'object') {
                    throw new Error(name + ' must be an object');
                }
            },

            validateIfNumber: function (val, name) {
                name = name || 'Value';
                if (typeof val !== 'number') {
                    throw new Error(name + ' must be a number');
                }
            },

            validatePositiveNumber: function (val, name) {
                name = name || 'Value';
                if (val <= 0) {
                    throw new Error(name + ' must be greater than zero')
                }
            },

            validateIfString: function (val, name) {
                name = name || 'Value';
                if (typeof val !== 'string') {
                    throw new Error(name + ' must be a string');
                }
            },

            validateStringLength: function (val, name) {
                if (val.length < CONSTANTS.TEXT_MIN_LENGTH || val.length > CONSTANTS.TEXT_MAX_LENGTH) {
                    throw new Error(name + ' must be between ' + CONSTANTS.TEXT_MIN_LENGTH + ' and ' +
                        CONSTANTS.TEXT_MAX_LENGTH + ' symbols');
                }
            },


            validateId: function (id) {
                this.validateIfUndefined(id, 'Object id');
                if (typeof id !== 'number') {
                    id = id.id;
                }

                this.validateIfUndefined(id, 'Object must have id and it ');
                return id;
            },

            validateImdbRating: function (val) {
                if (val < CONSTANTS.IMDB_MIN_RATING || val > CONSTANTS.IMDB_MAX_RATING) {
                    throw new Error('IMDB rating must be between ' + CONSTANTS.IMDB_MIN_RATING + ' and ' +
                        CONSTANTS.IMDB_MAX_RATING);
                }
            },

            validatePageAndSize: function (page, size, maxElements) {
                this.validateIfUndefined(page);
                this.validateIfUndefined(size);
                this.validateIfNumber(page);
                this.validateIfNumber(size);

                if (page < 0) {
                    throw new Error('Page must be greater or equal to 0');
                }

                this.validatePositiveNumber(size, 'Size');

                if (page * size > maxElements) {
                    throw new Error('Page * size will not return any elements from the collection.')
                }
            }
        };

        player = (function () {
            var currentPlayerId = 0;
            var player = Object.create({});

            Object.defineProperty(player, 'init', {
                value: function (name) {
                    this.name = name;
                    this._id = ++currentPlayerId;
                    this._playlists = [];
                    return this;
                }
            });

            Object.defineProperty(player, 'name', {
                get function() {
                    return this._name;
                },

                set: function (val) {
                    validator.validateIfUndefined(val, 'Player name');
                    validator.validateIfString(val, 'Player name');
                    validator.validateStringLength(val, 'Player name');

                    this._name = val;
                }
            });

            Object.defineProperty(player, 'id', {
                get: function () {
                    return this._id;
                }
            });


            Object.defineProperty(player, 'addPlaylist', {

                value: function (playlist) {
                    validator.validateIfUndefined(playlist, 'Player playlist parameter to add');
                    validator.validateIfObject(playlist, 'Player playlist parameter to add');
                    validator.validateIfUndefined(playlist.id, 'Player playlist parameter to add');
                    this._playlists.push(playlist);
                    return this;
                }
            });

            Object.defineProperty(player, 'getPlaylistById', {

                value: function (id) {
                    var foundIndex;
                    validator.validateIfUndefined(id, 'Player get playlist id');
                    validator.validateIfNumber(id, 'Player get playlist id');

                    foundIndex = indexOfElementWithIdInCollection(this._playlists, id);
                    if (foundIndex < 0) {
                        return null;
                    }

                    return this._playlists[foundIndex];
                }
            });

            Object.defineProperty(player, 'removePlaylist', {
                value: function (id) {
                    var foundIndex;
                    id = validator.validateId(id);

                    foundIndex = indexOfElementWithIdInCollection(this._playlists, id);
                    if (foundIndex < 0) {
                        throw new Error('Playlist with id ' + id + ' was not found in the collection.');
                    }

                    this._playlists.splice(foundIndex, 1);
                    return this;
                }
            });

            Object.defineProperty(player, 'listPlaylists', {
                value: function (page, size) {
                    page = page || 0;
                    size = size || CONSTANTS.MAX_NUMBER;
                    validator.validatePageAndSize(page, size, this._playlists.length);

                    return this
                        ._playlists
                        .slice()
                        .sort(getSortingFunction('name', 'id'))
                        .splice(page * size, size);
                }
            });

            Object.defineProperty(player, 'contains', {
                value: function (playable, playlist) {
                    validator.validateIfUndefined(playable);
                    validator.validateIfUndefined(playlist);
                    var playableId = validator.validateId(playable.id);
                    var playlistId = validator.validateId(playlist.id);

                    var playlist = this.getPlaylist(playlistId);
                    if (playlist === null) {
                        return false;
                    }

                    return true;
                }
            });

            Object.defineProperty(player, 'search', {
                value: function (pattern) {
                    validator.validateIfString(pattern, 'Search pattern');
                    validator.validateIfUndefined(pattern, 'Search pattern');

                    return this._playlists
                        .filter(function (playlist) {
                            return playlist
                                .listPlayables()
                                .some(function (playable) {
                                    return playable.length !== undefined
                                        && playable.title.toLowerCase().indexOf(pattern.toLowerCase()) >= 0;
                                });
                        })
                        .map(function (playlist) {
                            return {
                                id: playlist.id,
                                name: playlist.name
                            }
                        })

                }
            });

            return player;
        }());

        playlist = (function () {
            var currentPlaylistId = 0;
            var playlist = Object.create({});

            Object.defineProperty(playlist, 'init', {
                value: function (name) {
                    this.name = name;
                    this._id = ++currentPlaylistId;
                    this._playables = [];
                    return this;
                }
            });

            Object.defineProperty(playlist, 'name', {
                get: function () {
                    return this._name;
                },

                set: function (val) {
                    validator.validateIfUndefined(val, 'Playlist name');
                    validator.validateIfString(val, 'Playlist name');
                    validator.validateStringLength(val, 'Playlist name');

                    this._name = val;
                }
            });

            Object.defineProperty(playlist, 'id', {
                get: function () {
                    return this._id;
                }
            });

            Object.defineProperty(playlist, 'addPlayable', {

                value: function (playable) {
                    validator.validateIfUndefined(playable, 'Playlist playable parameter to add');
                    validator.validateIfObject(playable, 'Playlist playable parameter to add');
                    validator.validateIfUndefined(playable.id, 'Playlist playable parameter id');
                    this._playables.push(playable);
                    return this;
                }
            });

            Object.defineProperty(playlist, 'getPlayableById', {

                value: function (id) {
                    var foundIndex;
                    validator.validateIfUndefined(id, 'Playlist get playable id');
                    validator.validateIfNumber(id, 'Playlist get playable id');

                    foundIndex = indexOfElementWithIdInCollection(this._playables, id);
                    if (foundIndex < 0) {
                        return null;
                    }

                    return this._playables[foundIndex];
                }
            });

            Object.defineProperty(playlist, 'removePlayable', {
                value: function (id) {
                    var foundIndex;
                    id = validator.validateId(id);

                    foundIndex = indexOfElementWithIdInCollection(this._playables, id);
                    if (foundIndex < 0) {
                        throw new Error('Playable with id ' + id + ' was not found in the collection.');
                    }

                    this._playables.splice(foundIndex, 1);
                    return this;
                }
            });

            Object.defineProperty(playlist, 'listPlayables', {
                value: function (page, size) {
                    page = page || 0;
                    size = size || CONSTANTS.MAX_NUMBER;
                    validator.validatePageAndSize(page, size, this._playables.length);

                    return this
                        ._playables
                        .slice()
                        .sort(getSortingFunction('title', 'id'))
                        .splice(page * size, size);
                }
            });

            return playlist;

        }());

        playable = (function () {
            var currentPlayableId = 0;
            var playable = Object.create({});

            Object.defineProperty(playable, 'init', {

                value: function (title, author) {
                    this.title = title;
                    this.author = author;
                    this._id = ++currentPlayableId;
                    return this;
                }
            });

            Object.defineProperty(playable, 'title', {
                get: function () {
                    return this._title;
                },

                set: function (val) {
                    validator.validateIfUndefined(val, 'Title');
                    validator.validateIfString(val, 'Title');
                    validator.validateStringLength(val, 'Title');

                    this._title = val;
                }
            });

            Object.defineProperty(playable, 'author', {
                get: function () {
                    return this._author;
                },

                set: function (val) {
                    validator.validateIfUndefined(val, 'Author');
                    validator.validateIfString(val, 'Author');
                    validator.validateStringLength(val, 'Author');

                    this._author = val;
                }
            });

            Object.defineProperty(playable, 'id', {
                get: function () {
                    return this._id;
                }
            });

            Object.defineProperty(playable, 'play', {
                value: function () {
                    return this.id + '. ' + this.title + ' - ' + this.author;

                }
            });

            return playable;
        }());

        audio = (function (parent) {
            var audio = Object.create(parent);

            Object.defineProperty(audio, 'init', {

                value: function (title, author, length) {
                    parent.init.call(this, title, author);
                    this.length = length;
                    return this;

                }
            });

            Object.defineProperty(audio, 'play', {

                value: function () {
                    return parent.play.call(this) + ' - ' + this.length;
                }
            });

            return audio;

        }(playable));

        video = (function (parent) {
            var video = Object.create(parent);

            Object.defineProperty(video, 'init', {

                value: function (title, author, imdbRating) {
                    parent.init.call(this, title, author);
                    this.imdbRating = imdbRating;
                    return this;
                }
            });

            Object.defineProperty(video, 'imdbRating', {

                get: function () {
                    return this._imdbRating;
                },

                set: function (val) {
                    validator.validateIfNumber(val, 'IMDB rating');
                    validator.validateIfUndefined(val, 'IMDB rating');
                    validator.validateImdbRating(val);

                    this._imdbRating = val;
                }
            });

            Object.defineProperty(video, 'play', {

                value: function () {
                    return parent.play.call(this) + ' - ' + this.imdbRating;
                }
            });

            return video;
        }(playable));

        return {
            getPlayer: function (name) {
                // returns a new player instance with the provided name
                return Object.create(player).init(name);
            }
            ,
            getPlaylist: function (name) {
                //returns a new playlist instance with the provided name
                return Object.create(playlist).init(name);
            }
            ,
            getAudio: function (title, author, length) {
                //returns a new audio instance with the provided title, author and length
                return Object.create(audio).init(title, author, length);
            }
            ,
            getVideo: function (title, author, imdbRating) {
                //returns a new video instance with the provided title, author and imdbRating
                return Object.create(video).init(title, author, imdbRating);
            }
        };
    }());

    return module;
}

//general purpose testing
var module = solve();

//audio testing
//for (var i = 1; i <= 10; i += 1) {
//    var currentAudio = module.getAudio('Audio ' + i, 'Author ' + i, i);
//    console.log(currentAudio.play());
//}

//audio exceptions testing
//var incorrectAudio = module.getAudio('aksjfkahsjkhSDKLFJlsdhfIYDFGUfdhSKFDJldfj', 'str1', 26);

//video testing
for (var i = 0; i < 10; i += 1) {
    var currentVideo = module.getVideo('Video ' + i, 'Author ' + i, 2.4);
    console.log(currentVideo.play());
}

//video exceptions testing
//var incorrectVideo = module.getVideo('aksjfkahs', 'str1', 26);

//player and playlist testing
player = module.getPlayer('pesho');
playlist = module.getPlaylist('gosho');
player.addPlaylist(playlist);
var audio = module.getAudio('ivan', 'ivanov', 4);
playlist.addPlayable(audio);

console.log(player.search('van'));