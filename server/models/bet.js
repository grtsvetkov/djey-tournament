BetModel = {
    newBet: function() {

        if(!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }

        Bet.remove({});
        Env.update({name: 'status'}, { $set: {val: '-2'} });
        Env.update({name: 'bet'}, { $set: {val: '0'} });
        Env.update({name: 'betTime'}, { $set: {val: '300'} });
    },

    start: function() {
        if(!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }

        Bet.remove({});
        Env.update({name: 'bet'}, { $set: {val: '1'} });
        Env.update({name: 'betTime'}, { $set: {val: '300'} });
    },

    setTime: function(time) {
        if(!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }

        Env.update({name: 'betTime'}, { $set: {val: String(time)} });
    },

    setBet: function(bet) {
        var player = Con.findOne({con_id: this.connection.id});

        if (!player || !player.name) {
            throw new Meteor.Error(50, 'Нажмите кнопку "Принять участие", что бы делать ставки');
            return;
        }
        
        var flag = Bet.findOne({name: player.name});
        
        if(flag) {
            throw new Meteor.Error(51, 'Вы уже сделали ставку');
            return;
        }
        
        Bet.insert({name: player.name, bet: bet});
    },

    setWinner: function(bet) {
        if(!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }
        
        var list = Bet.find({bet: bet}).fetch();

        if(list.length > 0) {

            var item = list[_.random(0, list.length - 1)];

            Env.update({name: 'betTime'}, {$set: {val: item.name}});
        }
        Env.update({name: 'bet'}, { $set: {val: '3'} });
    },

    endBet: function() {
        if(!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }

        Env.update({name: 'bet'}, { $set: {val: '2'} });
    },

    stop: function() {
        if(!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }

        Env.update({name: 'status'}, { $set: {val: '0'} });
        Env.update({name: 'bet'}, { $set: {val: '0'} });
        Env.update({name: 'betTime'}, { $set: {val: '300'} });
    }

};

Meteor.methods({
    'bet.newBet': BetModel.newBet,
    'bet.start': BetModel.start,
    'bet.setTime': BetModel.setTime,
    'bet.setWinner': BetModel.setWinner,
    'bet.setBet': BetModel.setBet,
    'bet.endBet': BetModel.endBet,
    'bet.stop': BetModel.stop
});
