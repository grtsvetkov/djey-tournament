Meteor.startup(function(){
    var flag = Env.findOne({name: 'password'});
    
    if(!flag) {
        Env.insert({name: 'password', val: '123'});
    }

    var flag = Env.findOne({name: 'status'});

    if(!flag) {
        Env.insert({name: 'status', val: '0'});
    }

    var flag = Env.findOne({name: 'name'});

    if(!flag) {
        Env.insert({name: 'name', val: 'VainGlory турнир от Djey'});
    }

    var flag = Env.findOne({name: 'bet'});

    if(!flag) {
        Env.insert({name: 'bet', val: '0'});
    }

    var flag = Env.findOne({name: 'betTime'});

    if(!flag) {
        Env.insert({name: 'betTime', val: '0'});
    }

    if(Draft.find({}).count() == 0) {
        Draft.insert({name: 'A', val: 0});
        Draft.insert({name: 'B', val: 0});
        Draft.insert({name: 'data', val: {}});
    }
});