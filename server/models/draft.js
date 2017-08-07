const teamByStep = ['A', 'B', 'A', 'B', 'B', 'A', 'B', 'A', 'A', 'B'];
const actionByStep = ['ban', 'ban', 'pick', 'pick', 'ban', 'ban', 'pick', 'pick', 'pick', 'pick'];
const playerByStep = [0, 0, 0, 0, 0, 0, 1, 1, 2, 2];

var defaultDraft = {
    status: 'Open',
    currentTeam: 'A',
    currentPlayer: 0,
    currentStep: 0,
    steps: [],
    ban: [],
    pick: []
};

DraftModel = {
    create: function(tour, match) {
        if (!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }

        var data = Tour.findOne({tour: parseInt(tour), match: parseInt(match)});

        console.log(tour, match, data);

        if (!data || !data.commands || !data.commands.length == 2) {
            throw new Meteor.Error(30, 'Ошибка создания драфта');
            return;
        }

        var teamA = _.map(Con.find({command: data.commands[0]}).fetch(), function (i) {
            return i._id;
        });

        var teamB = _.map(Con.find({command: data.commands[1]}).fetch(), function (i) {
            return i._id;
        });

        if(teamA.length == 3 && teamB.length == 3) {

            Draft.update({name: 'A'}, {$set: {val: teamA}});
            Draft.update({name: 'B'}, {$set: {val: teamB}});
            Draft.update({name: 'data'}, {$set: {val: defaultDraft}});
            Env.update({name: 'status'}, { $set: {val: String('-1')} });
        } else {
            throw new Meteor.Error(35, 'Ошибка создания драфта. Не полные команды');
            return;
        }
    },
    
    step: function(h) {
        var currentPlayer = Con.findOne({con_id: this.connection.id});

        if (!currentPlayer) {
            throw new Meteor.Error(31, 'Ошибка авторизации');
            return;
        }

        var data = Draft.findOne({name: 'data'});
        var data_id = 0;

        if (data && data.val) {
            data_id = data._id;
            data = data.val;
        } else {
            throw new Meteor.Error(32, 'Ошибка авторизации');
            return;
        }

        var team = Draft.findOne({'val': currentPlayer._id});

        if (data.currentTeam != team.name) { //Не подходит команда
            throw new Meteor.Error(33, 'Ошибка авторизации');
            return;
        }

        if (team.val.indexOf(currentPlayer._id) != data.currentPlayer) { //Не подходит игрок
            throw new Meteor.Error(34, 'Ошибка авторизации');
            return;
        }

        if (data.pick.indexOf(h) <= -1 && data.ban.indexOf(h) <= -1) {

            var action = actionByStep[data.currentStep];

            data[action].push(h);
            data.steps.push(h);

            data.currentStep++;
            data.currentTeam = teamByStep[data.currentStep];
            data.currentPlayer = playerByStep[data.currentStep];

            Draft.update({_id: data_id}, {
                $set: {
                    'val.currentStep': data.currentStep,
                    'val.currentPlayer': data.currentPlayer,
                    'val.currentTeam': data.currentTeam,
                    'val.steps': data.steps,
                    'val.ban': data.ban,
                    'val.pick': data.pick
                }
            });
        } else {
            throw new Meteor.Error('500', 'Герой уже был выбран ранее');
        }
    },

    close: function() {
        if (!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }

        Env.update({name: 'status'}, { $set: {val: String(0)} });
    }
};

Meteor.methods({
    'draft.create': DraftModel.create,
    'draft.step': DraftModel.step,
    'draft.close': DraftModel.close
});

