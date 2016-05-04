"use-strict";

var User = function () {};

var usersById = {};
var usersByGoogleId = {};
var nextUserId = 0;

var addUser = function (source, sourceUser) {
	var user;

	if (arguments.length === 1)
	{
		user = sourceUser = source;
		user.id = ++nextUserId;
		return usersById[nextUserId] = user;
	}
	else
	{
		user = usersById[++nextUserId] = {id: nextUserId};
		user[source] = sourceUser;
	}

	return user;
};

var getUserById = function(id) {
	return usersById[id];
};

var getGoogleUser = function (googleUser) {
	usersByGoogleId[googleUser.id] || (usersByGoogleId[googleUser.id] = addUser('google', googleUser));
};

exports.getGoogleUser = getGoogleUser;

exports.getUserById = getUserById;