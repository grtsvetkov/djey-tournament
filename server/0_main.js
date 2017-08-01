Meteor.startup(function(){
    var flag = Env.findOne({name: 'password'});
    
    if(!flag) {
        Env.insert({name: 'password', val: '123'});
    }

    var flag = Env.findOne({name: 'status'});

    if(!flag) {
        Env.insert({name: 'status', val: '1'});
    }
});