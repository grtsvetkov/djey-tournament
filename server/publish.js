
Meteor.publish('con', function() {
    return Con.find({}, {fields: { _id: 1, name: 1, online: 1, type: 1, command: 1 }});
});

Meteor.publish('tour', function() {
    return Tour.find({});
});

Meteor.publish('com', function() {
    return Com.find({});
});

Meteor.publish('env', function() {
    return Env.find({name: {$ne: 'password'}});
});