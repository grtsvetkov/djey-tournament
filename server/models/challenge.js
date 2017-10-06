ChallengeModel = {
    newChallenge: function() {

        if(!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }

        Challenge.remove({});

        Env.update({name: 'status'}, { $set: {val: '-4'} });

        Env.update({name: 'challenge'}, { $set: {val: '0'} });
    },

    takePart: function(connection_id) {

        if(!connection_id) {
            connection_id = this.connection.id;
        }

        
        
        var player = Con.findOne({con_id: connection_id});

        if (!player || !player.name) {
            throw new Meteor.Error(50, 'Нажмите кнопку "Принять участие" справа');
            return;
        }

        var flag = Challenge.findOne({name: player.name});

        if(flag) {
            throw new Meteor.Error(51, 'Вы уже принимаете участие');
            return;
        }

        Challenge.insert({name: player.name});
    },

    setWinner: function() {
        if(!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }

        var list = Challenge.find({}).fetch();

        var item = list[_.random(0, list.length - 1)];

        console.log(item.name);

        Env.update({name: 'challenge'}, {$set: {val: item.name}});

    },

    stop: function() {
        if(!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }

        Env.update({name: 'status'}, { $set: {val: '0'} });
        Env.update({name: 'challenge'}, { $set: {val: '0'} });
        Challenge.remove({});
    }
};

Meteor.methods({
    'challenge.newChallenge': ChallengeModel.newChallenge,
    'challenge.takePart': ChallengeModel.takePart,
    'challenge.setWinner': ChallengeModel.setWinner,
    'challenge.setWinner': ChallengeModel.setWinner,
    'challenge.stop': ChallengeModel.stop
});
