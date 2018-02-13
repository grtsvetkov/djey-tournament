Meteor.startup(function(){

    var flag = Env.findOne({name: 'password'});
    
    if(!flag) {
        Env.insert({name: 'password', val: '123'});
    }

    /*
    0 = Турнир
    -1 = Драфт
    -2 = Ставки #ПобедаИлиПоражение
    -3 = Стаки #КраснаяИлиСиняя
    -4 = #ВызовПринят
    Что-то другое = Победа какой-то комманды в турнире
     */
    var flag = Env.findOne({name: 'status'});

    if(!flag) {
        Env.insert({name: 'status', val: '0'});
    }

    var flag = Env.findOne({name: 'name'});

    if(!flag) {
        Env.insert({name: 'name', val: 'VainGlory турнир от Djey'});
    }

    var flag = Env.findOne({name: 'minrang'});

    if(!flag) {
        Env.insert({name: 'minrang', val: '4'});
    }

    //BET
    var flag = Env.findOne({name: 'bet'});

    if(!flag) {
        Env.insert({name: 'bet', val: '0'});
    }

    var flag = Env.findOne({name: 'betTime'});

    if(!flag) {
        Env.insert({name: 'betTime', val: '0'});
    }

    
    //CHALLENGE
    var flag = Env.findOne({name: 'challenge'});

    if(!flag) {
        Env.insert({name: 'challenge', val: '0'});
    }
    
    //DRAFT
    if(Draft.find({}).count() == 0) {
        Draft.insert({name: 'A', val: 0});
        Draft.insert({name: 'B', val: 0});
        Draft.insert({name: 'data', val: {}});
    }

    //DRAFT TIMER
    var flag = Env.findOne({name: 'draftTime'});

    if(!flag) {
        Env.insert({name: 'draftTime', val: '0'});
    }
});