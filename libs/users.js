"use-strict";
// load up the user model


var usersById = {};
var usersByGoogleId = {};
var nextUserId = 0;

var addUser = function(source, sourceUser) {
	
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

var getUser = function(googleUser)
{
	return usersByGoogleId[googleUser.id] || (usersByGoogleId[googleUser.id] = addUser('google', googleUser));
};

var getById = function (id)
{
	return usersById[id];
};

exports.getById = getById;

exports.get = getUser;

exports.add = addUser;