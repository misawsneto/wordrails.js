function CellDto(id, index, row, term, post) {
	return {
		id: id,
		index: index,
		row: row,
		term: term,
		post: post
	};
}

function CommentDto(id, date, title, body, author, post) {
	return {
		id: id,
		date: date,
		title: title,
		body: body,
		author: author,
		post: post
	};
}

function FileDto(id, type, mime, name, url) {
	return {
		id: id,
		type: type,
		mime: mime,
		name: name,
		url: url
	};
}

function ImageDto(id, title, original, small, medium, large) {
	return {
		id: id,
		title: title,
		original: original,
		small: small,
		medium: medium,
		large: large
	};
}

function NetworkDto(id, name, defaultTaxonomy) {
	return {
		id: id,
		name: name,
		defaultTaxonomy: defaultTaxonomy
	};
}

function PersonDto(id, name) {
	return {
		id: id,
		name: name
	};
}

function PostDto(id, date, title, body, author, station) {
	return {
		id: id,
		date: date,
		title: title,
		body: body,
		author: author,
		station: station
	};
}

function PromotionDto(id, date, post, promoter, station) {
	return {
		id: id,
		date: date,
		post: post,
		promoter: promoter,
		station: station
	};
}

function RowDto(id, type, featuringPerspective, index, term) {
	return {
		id: id,
		type: type,
		featuringPerspective: featuringPerspective,
		index: index,
		term: term
	};
}

function StationDto(id, name, networks, perspectives) {
	return {
		id: id,
		name: name,
		networks: networks,
		perspectives: perspectives
	};
}

function StationPerspectiveDto(id, name, station) {
	return {
		id: id,
		name: name,
		station: station
	};
}

function TaxonomyDto(id, type, name) {
	return {
		id: id,
		type: type,
		name: name
	};
}

function TermDto(id, name, taxonomy) {
	return {
		id: id,
		name: name,
		taxonomy: taxonomy
	};
}

function TermPerspectiveDto(id, featuredRow, perspective) {
	return {
		id: id,
		featuredRow: featuredRow,
		perspective: perspective
	};
}

function BaseWordRails(_url, _username, _password) {
    function logIn(complete) {
        $.ajax({
            type: "POST",
            url: _url + "/j_spring_security_check",
            data: {
                "j_username": _username,
                "j_password": _password
            },
            complete: complete
        });
    }

    var that = {};

    that._ajax = function(settings) {
        var error = settings.error;
        var complete = settings.complete;
        settings.error = function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 403) {
                logIn(function() {
                    settings.error = error;
                    settings.complete = complete;
                    $.ajax(settings);
                });
            } else if (error) {
                error(jqXHR, textStatus, errorThrown);
            }
        };
        settings.complete = function(jqXHR, textStatus) {
            if (jqXHR.status !== 403 && complete) {
                complete(jqXHR, textStatus);
            }
        };
        $.ajax(settings);
    };    

/*---------------------------------------------------------------------------*/
    that.getCells = function(_page, _size, _sort, _success, _error, _complete) {
		that._ajax({
            url: _url + "/api/cells",
            data: {
                page: _page,
                size: _size,
                sort: _sort
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.postCell = function(cell, _success, _error, _complete) {
        that._ajax({
            type: "POST",
            url: _url + "/api/cells",
            contentType: "application/json",
            data: JSON.stringify(cell),
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    var _value = _jqXHR.getResponseHeader("Location");
                    if (_value) {
                        var _index = _value.lastIndexOf("/");
                        var _suffix = _value.substring(_index + 1);
                        var id = _suffix;
                        _success(id, _textStatus, _jqXHR);
                    }
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getCell = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/cells/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putCell = function(cell, _success, _error, _complete) {
        that._ajax({
            type: "PUT",
            url: _url + "/api/cells/" + cell.id,
            contentType: "application/json",
            data: JSON.stringify(cell),
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.deleteCell = function(id, _success, _error, _complete) {
        that._ajax({
            type: "DELETE",
            url: _url + "/api/cells/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.findCellByRow = function(row, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/cells/search/findCellByRow",
            data: {
            	row: row
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.findCellsPositioned = function(rowId, lowerLimit, upperLimit, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/cells/search/findCellsPositioned",
            data: {
            	rowId: rowId,
            	lowerLimit: lowerLimit,
            	upperLimit: upperLimit
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getCellRow = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/cells/{id}/row",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putCellRow = function(id, row, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/cells/{id}/row",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getCellTerm = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/cells/{id}/term",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putCellTerm = function(id, term, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/cells/{id}/term",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getCellPost = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/cells/{id}/post",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putCellPost = function(id, post, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/cells/{id}/post",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };
/*---------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------*/
    that.getComments = function(_page, _size, _sort, _success, _error, _complete) {
		that._ajax({
            url: _url + "/api/comments",
            data: {
                page: _page,
                size: _size,
                sort: _sort
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.postComment = function(comment, _success, _error, _complete) {
        that._ajax({
            type: "POST",
            url: _url + "/api/comments",
            contentType: "application/json",
            data: JSON.stringify(comment),
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    var _value = _jqXHR.getResponseHeader("Location");
                    if (_value) {
                        var _index = _value.lastIndexOf("/");
                        var _suffix = _value.substring(_index + 1);
                        var id = _suffix;
                        _success(id, _textStatus, _jqXHR);
                    }
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getComment = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/comments/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putComment = function(comment, _success, _error, _complete) {
        that._ajax({
            type: "PUT",
            url: _url + "/api/comments/" + comment.id,
            contentType: "application/json",
            data: JSON.stringify(comment),
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.deleteComment = function(id, _success, _error, _complete) {
        that._ajax({
            type: "DELETE",
            url: _url + "/api/comments/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };


    that.getCommentImages = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/comments/{id}/images",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getCommentAuthor = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/comments/{id}/author",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putCommentAuthor = function(id, author, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/comments/{id}/author",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getCommentPost = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/comments/{id}/post",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putCommentPost = function(id, post, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/comments/{id}/post",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };
/*---------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------*/
    that.getFiles = function(_page, _size, _sort, _success, _error, _complete) {
		that._ajax({
            url: _url + "/api/files",
            data: {
                page: _page,
                size: _size,
                sort: _sort
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.postFile = function(file, _success, _error, _complete) {
        that._ajax({
            type: "POST",
            url: _url + "/api/files",
            contentType: "application/json",
            data: JSON.stringify(file),
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    var _value = _jqXHR.getResponseHeader("Location");
                    if (_value) {
                        var _index = _value.lastIndexOf("/");
                        var _suffix = _value.substring(_index + 1);
                        var id = _suffix;
                        _success(id, _textStatus, _jqXHR);
                    }
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getFile = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/files/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putFile = function(file, _success, _error, _complete) {
        that._ajax({
            type: "PUT",
            url: _url + "/api/files/" + file.id,
            contentType: "application/json",
            data: JSON.stringify(file),
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.deleteFile = function(id, _success, _error, _complete) {
        that._ajax({
            type: "DELETE",
            url: _url + "/api/files/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };


/*---------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------*/
    that.getImages = function(_page, _size, _sort, _success, _error, _complete) {
		that._ajax({
            url: _url + "/api/images",
            data: {
                page: _page,
                size: _size,
                sort: _sort
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.postImage = function(image, _success, _error, _complete) {
        that._ajax({
            type: "POST",
            url: _url + "/api/images",
            contentType: "application/json",
            data: JSON.stringify(image),
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    var _value = _jqXHR.getResponseHeader("Location");
                    if (_value) {
                        var _index = _value.lastIndexOf("/");
                        var _suffix = _value.substring(_index + 1);
                        var id = _suffix;
                        _success(id, _textStatus, _jqXHR);
                    }
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getImage = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/images/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putImage = function(image, _success, _error, _complete) {
        that._ajax({
            type: "PUT",
            url: _url + "/api/images/" + image.id,
            contentType: "application/json",
            data: JSON.stringify(image),
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.deleteImage = function(id, _success, _error, _complete) {
        that._ajax({
            type: "DELETE",
            url: _url + "/api/images/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };


    that.getImageComment = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/images/{id}/comment",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putImageComment = function(id, comment, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/images/{id}/comment",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getImageOriginal = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/images/{id}/original",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putImageOriginal = function(id, original, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/images/{id}/original",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getImageSmall = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/images/{id}/small",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putImageSmall = function(id, small, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/images/{id}/small",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getImageMedium = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/images/{id}/medium",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putImageMedium = function(id, medium, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/images/{id}/medium",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getImageLarge = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/images/{id}/large",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putImageLarge = function(id, large, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/images/{id}/large",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getImagePost = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/images/{id}/post",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putImagePost = function(id, post, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/images/{id}/post",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getImageFeaturingPosts = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/images/{id}/featuringPosts",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };
/*---------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------*/
    that.getNetworks = function(_page, _size, _sort, _success, _error, _complete) {
		that._ajax({
            url: _url + "/api/networks",
            data: {
                page: _page,
                size: _size,
                sort: _sort
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.postNetwork = function(network, _success, _error, _complete) {
        that._ajax({
            type: "POST",
            url: _url + "/api/networks",
            contentType: "application/json",
            data: JSON.stringify(network),
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    var _value = _jqXHR.getResponseHeader("Location");
                    if (_value) {
                        var _index = _value.lastIndexOf("/");
                        var _suffix = _value.substring(_index + 1);
                        var id = _suffix;
                        _success(id, _textStatus, _jqXHR);
                    }
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getNetwork = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/networks/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putNetwork = function(network, _success, _error, _complete) {
        that._ajax({
            type: "PUT",
            url: _url + "/api/networks/" + network.id,
            contentType: "application/json",
            data: JSON.stringify(network),
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.deleteNetwork = function(id, _success, _error, _complete) {
        that._ajax({
            type: "DELETE",
            url: _url + "/api/networks/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };


    that.getNetworkPersons = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/networks/{id}/persons",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getNetworkStations = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/networks/{id}/stations",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getNetworkTaxonomies = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/networks/{id}/taxonomies",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getNetworkDefaultTaxonomy = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/networks/{id}/defaultTaxonomy",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putNetworkDefaultTaxonomy = function(id, defaultTaxonomy, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/networks/{id}/defaultTaxonomy",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };
/*---------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------*/
    that.getPersons = function(_page, _size, _sort, _success, _error, _complete) {
		that._ajax({
            url: _url + "/api/persons",
            data: {
                page: _page,
                size: _size,
                sort: _sort
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.postPerson = function(person, _success, _error, _complete) {
        that._ajax({
            type: "POST",
            url: _url + "/api/persons",
            contentType: "application/json",
            data: JSON.stringify(person),
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    var _value = _jqXHR.getResponseHeader("Location");
                    if (_value) {
                        var _index = _value.lastIndexOf("/");
                        var _suffix = _value.substring(_index + 1);
                        var id = _suffix;
                        _success(id, _textStatus, _jqXHR);
                    }
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getPerson = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/persons/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putPerson = function(person, _success, _error, _complete) {
        that._ajax({
            type: "PUT",
            url: _url + "/api/persons/" + person.id,
            contentType: "application/json",
            data: JSON.stringify(person),
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.deletePerson = function(id, _success, _error, _complete) {
        that._ajax({
            type: "DELETE",
            url: _url + "/api/persons/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };


    that.getPersonComments = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/persons/{id}/comments",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getPersonNetworks = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/persons/{id}/networks",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.putPersonNetworks = function(id, networks, _success, _error, _complete) {		
    	var _data = "";
    	for (var i = 0; i < networks.length; ++i) {
    		_data += networks[i] + "\n";
    	}
        that._ajax({
        	type: "PUT",
            url: _url + "/api/persons/{id}/networks",
            data: _data,
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getPersonStations = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/persons/{id}/stations",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.putPersonStations = function(id, stations, _success, _error, _complete) {		
    	var _data = "";
    	for (var i = 0; i < stations.length; ++i) {
    		_data += stations[i] + "\n";
    	}
        that._ajax({
        	type: "PUT",
            url: _url + "/api/persons/{id}/stations",
            data: _data,
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getPersonPosts = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/persons/{id}/posts",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getPersonPromotions = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/persons/{id}/promotions",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };
/*---------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------*/
    that.getPosts = function(_page, _size, _sort, _success, _error, _complete) {
		that._ajax({
            url: _url + "/api/posts",
            data: {
                page: _page,
                size: _size,
                sort: _sort
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.postPost = function(post, _success, _error, _complete) {
        that._ajax({
            type: "POST",
            url: _url + "/api/posts",
            contentType: "application/json",
            data: JSON.stringify(post),
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    var _value = _jqXHR.getResponseHeader("Location");
                    if (_value) {
                        var _index = _value.lastIndexOf("/");
                        var _suffix = _value.substring(_index + 1);
                        var id = _suffix;
                        _success(id, _textStatus, _jqXHR);
                    }
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getPost = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/posts/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putPost = function(post, _success, _error, _complete) {
        that._ajax({
            type: "PUT",
            url: _url + "/api/posts/" + post.id,
            contentType: "application/json",
            data: JSON.stringify(post),
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.deletePost = function(id, _success, _error, _complete) {
        that._ajax({
            type: "DELETE",
            url: _url + "/api/posts/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getTermPosts = function(termId, page, size, sort, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/posts/search/getTermPosts",
            data: {
            	termId: termId,
            	page: page,
            	size: size,
            	sort: sort
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.findPosts = function(stationId, termId, page, size, sort, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/posts/search/findPosts",
            data: {
            	stationId: stationId,
            	termId: termId,
            	page: page,
            	size: size,
            	sort: sort
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getStationTermPosts = function(stationId, termId, page, size, sort, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/posts/search/getStationTermPosts",
            data: {
            	stationId: stationId,
            	termId: termId,
            	page: page,
            	size: size,
            	sort: sort
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.findPostsFromOrPromotedToStation = function(stationId, page, size, sort, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/posts/search/findPostsFromOrPromotedToStation",
            data: {
            	stationId: stationId,
            	page: page,
            	size: size,
            	sort: sort
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.findPostsAndPostsPromoted = function(stationId, termId, page, size, sort, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/posts/search/findPostsAndPostsPromoted",
            data: {
            	stationId: stationId,
            	termId: termId,
            	page: page,
            	size: size,
            	sort: sort
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.findPostsNotPositioned = function(stationId, termId, idsToExclude, page, size, sort, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/posts/search/findPostsNotPositioned",
            data: {
            	stationId: stationId,
            	termId: termId,
            	idsToExclude: idsToExclude,
            	page: page,
            	size: size,
            	sort: sort
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getPostComments = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/posts/{id}/comments",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getPostFeaturedImage = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/posts/{id}/featuredImage",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putPostFeaturedImage = function(id, featuredImage, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/posts/{id}/featuredImage",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getPostImages = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/posts/{id}/images",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getPostAuthor = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/posts/{id}/author",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putPostAuthor = function(id, author, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/posts/{id}/author",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getPostPromotions = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/posts/{id}/promotions",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getPostStation = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/posts/{id}/station",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putPostStation = function(id, station, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/posts/{id}/station",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getPostTerms = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/posts/{id}/terms",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.putPostTerms = function(id, terms, _success, _error, _complete) {		
    	var _data = "";
    	for (var i = 0; i < terms.length; ++i) {
    		_data += terms[i] + "\n";
    	}
        that._ajax({
        	type: "PUT",
            url: _url + "/api/posts/{id}/terms",
            data: _data,
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getPostSplashingPerspective = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/posts/{id}/splashingPerspective",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };
/*---------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------*/
    that.getPromotions = function(_page, _size, _sort, _success, _error, _complete) {
		that._ajax({
            url: _url + "/api/promotions",
            data: {
                page: _page,
                size: _size,
                sort: _sort
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.postPromotion = function(promotion, _success, _error, _complete) {
        that._ajax({
            type: "POST",
            url: _url + "/api/promotions",
            contentType: "application/json",
            data: JSON.stringify(promotion),
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    var _value = _jqXHR.getResponseHeader("Location");
                    if (_value) {
                        var _index = _value.lastIndexOf("/");
                        var _suffix = _value.substring(_index + 1);
                        var id = _suffix;
                        _success(id, _textStatus, _jqXHR);
                    }
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getPromotion = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/promotions/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putPromotion = function(promotion, _success, _error, _complete) {
        that._ajax({
            type: "PUT",
            url: _url + "/api/promotions/" + promotion.id,
            contentType: "application/json",
            data: JSON.stringify(promotion),
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.deletePromotion = function(id, _success, _error, _complete) {
        that._ajax({
            type: "DELETE",
            url: _url + "/api/promotions/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };


    that.getPromotionPost = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/promotions/{id}/post",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putPromotionPost = function(id, post, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/promotions/{id}/post",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getPromotionPromoter = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/promotions/{id}/promoter",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putPromotionPromoter = function(id, promoter, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/promotions/{id}/promoter",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getPromotionStation = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/promotions/{id}/station",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putPromotionStation = function(id, station, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/promotions/{id}/station",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };
/*---------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------*/
    that.getRows = function(_page, _size, _sort, _success, _error, _complete) {
		that._ajax({
            url: _url + "/api/rows",
            data: {
                page: _page,
                size: _size,
                sort: _sort
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.postRow = function(row, _success, _error, _complete) {
        that._ajax({
            type: "POST",
            url: _url + "/api/rows",
            contentType: "application/json",
            data: JSON.stringify(row),
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    var _value = _jqXHR.getResponseHeader("Location");
                    if (_value) {
                        var _index = _value.lastIndexOf("/");
                        var _suffix = _value.substring(_index + 1);
                        var id = _suffix;
                        _success(id, _textStatus, _jqXHR);
                    }
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getRow = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/rows/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putRow = function(row, _success, _error, _complete) {
        that._ajax({
            type: "PUT",
            url: _url + "/api/rows/" + row.id,
            contentType: "application/json",
            data: JSON.stringify(row),
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.deleteRow = function(id, _success, _error, _complete) {
        that._ajax({
            type: "DELETE",
            url: _url + "/api/rows/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.findByPerspective = function(perspective, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/rows/search/findByPerspective",
            data: {
            	perspective: perspective
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.findByPerspectiveAndTerm = function(perspective, term, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/rows/search/findByPerspectiveAndTerm",
            data: {
            	perspective: perspective,
            	term: term
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getRowCells = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/rows/{id}/cells",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getRowTerm = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/rows/{id}/term",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putRowTerm = function(id, term, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/rows/{id}/term",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getRowPerspective = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/rows/{id}/perspective",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putRowPerspective = function(id, perspective, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/rows/{id}/perspective",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };
/*---------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------*/
    that.getStations = function(_page, _size, _sort, _success, _error, _complete) {
		that._ajax({
            url: _url + "/api/stations",
            data: {
                page: _page,
                size: _size,
                sort: _sort
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.postStation = function(station, _success, _error, _complete) {
        that._ajax({
            type: "POST",
            url: _url + "/api/stations",
            contentType: "application/json",
            data: JSON.stringify(station),
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    var _value = _jqXHR.getResponseHeader("Location");
                    if (_value) {
                        var _index = _value.lastIndexOf("/");
                        var _suffix = _value.substring(_index + 1);
                        var id = _suffix;
                        _success(id, _textStatus, _jqXHR);
                    }
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getStation = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/stations/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putStation = function(station, _success, _error, _complete) {
        that._ajax({
            type: "PUT",
            url: _url + "/api/stations/" + station.id,
            contentType: "application/json",
            data: JSON.stringify(station),
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.deleteStation = function(id, _success, _error, _complete) {
        that._ajax({
            type: "DELETE",
            url: _url + "/api/stations/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.findByName = function(name, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/stations/search/findByName",
            data: {
            	name: name
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getStationNetworks = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/stations/{id}/networks",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.putStationNetworks = function(id, networks, _success, _error, _complete) {		
    	var _data = "";
    	for (var i = 0; i < networks.length; ++i) {
    		_data += networks[i] + "\n";
    	}
        that._ajax({
        	type: "PUT",
            url: _url + "/api/stations/{id}/networks",
            data: _data,
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getStationPersons = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/stations/{id}/persons",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getStationPosts = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/stations/{id}/posts",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getStationPromotions = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/stations/{id}/promotions",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getStationPerspectives = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/stations/{id}/perspectives",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getStationTaxonomies = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/stations/{id}/taxonomies",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };
/*---------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------*/
    that.getStationPerspectives = function(_page, _size, _sort, _success, _error, _complete) {
		that._ajax({
            url: _url + "/api/stationPerspectives",
            data: {
                page: _page,
                size: _size,
                sort: _sort
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.postStationPerspective = function(stationPerspective, _success, _error, _complete) {
        that._ajax({
            type: "POST",
            url: _url + "/api/stationPerspectives",
            contentType: "application/json",
            data: JSON.stringify(stationPerspective),
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    var _value = _jqXHR.getResponseHeader("Location");
                    if (_value) {
                        var _index = _value.lastIndexOf("/");
                        var _suffix = _value.substring(_index + 1);
                        var id = _suffix;
                        _success(id, _textStatus, _jqXHR);
                    }
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getStationPerspective = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/stationPerspectives/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putStationPerspective = function(stationPerspective, _success, _error, _complete) {
        that._ajax({
            type: "PUT",
            url: _url + "/api/stationPerspectives/" + stationPerspective.id,
            contentType: "application/json",
            data: JSON.stringify(stationPerspective),
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.deleteStationPerspective = function(id, _success, _error, _complete) {
        that._ajax({
            type: "DELETE",
            url: _url + "/api/stationPerspectives/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.findStationPerspectivesByStation = function(stationId, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/stationPerspectives/search/findStationPerspectivesByStation",
            data: {
            	stationId: stationId
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getStationPerspectiveStation = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/stationPerspectives/{id}/station",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putStationPerspectiveStation = function(id, station, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/stationPerspectives/{id}/station",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getStationPerspectiveTaxonomy = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/stationPerspectives/{id}/taxonomy",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putStationPerspectiveTaxonomy = function(id, taxonomy, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/stationPerspectives/{id}/taxonomy",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getStationPerspectivePerspectives = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/stationPerspectives/{id}/perspectives",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };
/*---------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------*/
    that.getTaxonomies = function(_page, _size, _sort, _success, _error, _complete) {
		that._ajax({
            url: _url + "/api/taxonomies",
            data: {
                page: _page,
                size: _size,
                sort: _sort
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.postTaxonomy = function(taxonomy, _success, _error, _complete) {
        that._ajax({
            type: "POST",
            url: _url + "/api/taxonomies",
            contentType: "application/json",
            data: JSON.stringify(taxonomy),
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    var _value = _jqXHR.getResponseHeader("Location");
                    if (_value) {
                        var _index = _value.lastIndexOf("/");
                        var _suffix = _value.substring(_index + 1);
                        var id = _suffix;
                        _success(id, _textStatus, _jqXHR);
                    }
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getTaxonomy = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/taxonomies/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putTaxonomy = function(taxonomy, _success, _error, _complete) {
        that._ajax({
            type: "PUT",
            url: _url + "/api/taxonomies/" + taxonomy.id,
            contentType: "application/json",
            data: JSON.stringify(taxonomy),
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.deleteTaxonomy = function(id, _success, _error, _complete) {
        that._ajax({
            type: "DELETE",
            url: _url + "/api/taxonomies/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.findByTypeAndName = function(type, name, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/taxonomies/search/findByTypeAndName",
            data: {
            	type: type,
            	name: name
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.findTaxonomiesByStation = function(station, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/taxonomies/search/findTaxonomiesByStation",
            data: {
            	station: station
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getTaxonomyTerms = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/taxonomies/{id}/terms",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getTaxonomyDefaultNetworks = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/taxonomies/{id}/defaultNetworks",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getTaxonomyNetwork = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/taxonomies/{id}/network",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putTaxonomyNetwork = function(id, network, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/taxonomies/{id}/network",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getTaxonomyStation = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/taxonomies/{id}/station",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putTaxonomyStation = function(id, station, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/taxonomies/{id}/station",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };
/*---------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------*/
    that.getTerms = function(_page, _size, _sort, _success, _error, _complete) {
		that._ajax({
            url: _url + "/api/terms",
            data: {
                page: _page,
                size: _size,
                sort: _sort
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.postTerm = function(term, _success, _error, _complete) {
        that._ajax({
            type: "POST",
            url: _url + "/api/terms",
            contentType: "application/json",
            data: JSON.stringify(term),
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    var _value = _jqXHR.getResponseHeader("Location");
                    if (_value) {
                        var _index = _value.lastIndexOf("/");
                        var _suffix = _value.substring(_index + 1);
                        var id = _suffix;
                        _success(id, _textStatus, _jqXHR);
                    }
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getTerm = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/terms/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putTerm = function(term, _success, _error, _complete) {
        that._ajax({
            type: "PUT",
            url: _url + "/api/terms/" + term.id,
            contentType: "application/json",
            data: JSON.stringify(term),
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.deleteTerm = function(id, _success, _error, _complete) {
        that._ajax({
            type: "DELETE",
            url: _url + "/api/terms/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.findByParent = function(term, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/terms/search/findByParent",
            data: {
            	term: term
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.findRoots = function(taxonomyId, page, size, sort, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/terms/search/findRoots",
            data: {
            	taxonomyId: taxonomyId,
            	page: page,
            	size: size,
            	sort: sort
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.findRoots = function(taxonomyId, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/terms/search/findRoots",
            data: {
            	taxonomyId: taxonomyId
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.countTerms = function(termsIds, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/terms/search/countTerms",
            data: {
            	termsIds: termsIds
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getTermCells = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/terms/{id}/cells",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getTermPosts = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/terms/{id}/posts",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getTermRows = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/terms/{id}/rows",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getTermTaxonomy = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/terms/{id}/taxonomy",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putTermTaxonomy = function(id, taxonomy, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/terms/{id}/taxonomy",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getTermParent = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/terms/{id}/parent",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putTermParent = function(id, parent, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/terms/{id}/parent",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getTermChildren = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/terms/{id}/children",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getTermPerspectives = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/terms/{id}/perspectives",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };
/*---------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------*/
    that.getTermPerspectives = function(_page, _size, _sort, _success, _error, _complete) {
		that._ajax({
            url: _url + "/api/termPerspectives",
            data: {
                page: _page,
                size: _size,
                sort: _sort
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.postTermPerspective = function(termPerspective, _success, _error, _complete) {
        that._ajax({
            type: "POST",
            url: _url + "/api/termPerspectives",
            contentType: "application/json",
            data: JSON.stringify(termPerspective),
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    var _value = _jqXHR.getResponseHeader("Location");
                    if (_value) {
                        var _index = _value.lastIndexOf("/");
                        var _suffix = _value.substring(_index + 1);
                        var id = _suffix;
                        _success(id, _textStatus, _jqXHR);
                    }
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getTermPerspective = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/termPerspectives/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putTermPerspective = function(termPerspective, _success, _error, _complete) {
        that._ajax({
            type: "PUT",
            url: _url + "/api/termPerspectives/" + termPerspective.id,
            contentType: "application/json",
            data: JSON.stringify(termPerspective),
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.deleteTermPerspective = function(id, _success, _error, _complete) {
        that._ajax({
            type: "DELETE",
            url: _url + "/api/termPerspectives/" + id,
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.findByPerspective = function(perspective, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/termPerspectives/search/findByPerspective",
            data: {
            	perspective: perspective
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.findRootTermByStationPerspective = function(stationPerspectiveId, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/termPerspectives/search/findRootTermByStationPerspective",
            data: {
            	stationPerspectiveId: stationPerspectiveId
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.findPerspectiveAndTerm = function(stationPerspectiveId, termId, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/termPerspectives/search/findPerspectiveAndTerm",
            data: {
            	stationPerspectiveId: stationPerspectiveId,
            	termId: termId
            },
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getTermPerspectiveSplashedPost = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/termPerspectives/{id}/splashedPost",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putTermPerspectiveSplashedPost = function(id, splashedPost, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/termPerspectives/{id}/splashedPost",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getTermPerspectiveRows = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/termPerspectives/{id}/rows",
            success: function(_data, _textStatus, _jqXHR) {
                if (_success) {
                    _success(_data.content, _textStatus, _jqXHR);
                }
            },
            error: _error,
            complete: _complete
        });
    };

    that.getTermPerspectivePerspective = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/termPerspectives/{id}/perspective",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putTermPerspectivePerspective = function(id, perspective, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/termPerspectives/{id}/perspective",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.getTermPerspectiveTerm = function(id, _success, _error, _complete) {
        that._ajax({
            url: _url + "/api/termPerspectives/{id}/term",
            success: _success,
            error: _error,
            complete: _complete
        });
    };

    that.putTermPerspectiveTerm = function(id, term, _success, _error, _complete) {
        that._ajax({
        	type: "PUT",
            url: _url + "/api/termPerspectives/{id}/term",
            contentType: "text/uri-list",
            success: _success,
            error: _error,
            complete: _complete
        });
    };
/*---------------------------------------------------------------------------*/

    return that;
}