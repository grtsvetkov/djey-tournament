
Meteor.publish('con', function() {
    return Con.find({}, {fields: { _id: 1, name: 1, online: 1, type: 1, command: 1, vg_level: 1, vg_id: 1, error: 1 }});
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

Meteor.publish('ban', function() {
    return Ban.find({});
});

Meteor.publish('bet', function() {
    return Bet.find({});
});

Meteor.publish('djeycoin', function() {
    return Djeycoin.find({});
});

Meteor.publish('draft', function (code) {
    return Draft.find({});
});