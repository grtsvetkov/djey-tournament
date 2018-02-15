const teamByStep = ['A', 'B', 'A', 'B', 'B', 'A', 'B', 'A', 'B', 'A', 'A', 'B', 'A', 'B', 'A', 'B'];
const actionByStep = ['ban', 'ban', 'pick', 'pick', 'pick', 'pick', 'ban', 'ban', 'pick', 'pick', 'pick', 'pick', 'ban', 'ban', 'pick', 'pick'];
const playerByStep = [0, 0, 0, 0, 1, 1, 0, 0, 2, 2, 3, 3, 0, 0, 4, 4];

var draftTimerHandler = null;

var defaultDraft = {
    status: 'Open',
    currentTeam: 'A',
    currentPlayer: 0,
    currentStep: 0,
    steps: [],
    ban: [],
    pick: [],
    like: {'A': {}, 'B': {}},
    role: {'A': {}, 'B': {}}
};

DraftModel = {
    create: function(tour, match) {
        if (!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }

        var data = Tour.findOne({tour: parseInt(tour), match: parseInt(match)});


        if (!data || !data.commands || !data.commands.length == 2) {
            throw new Meteor.Error(30, 'Ошибка создания драфта');
            return;
        }

        var teamA = Com.findOne({num: parseInt(data.commands[0])}).list;

        var teamB = Com.findOne({num: parseInt(data.commands[1])}).list;

        if(teamA.length == 3 && teamB.length == 3) {
            Draft.update({name: 'A'}, {$set: {val: teamA}});
            Draft.update({name: 'B'}, {$set: {val: teamB}});
            Draft.update({name: 'data'}, {$set: {val: defaultDraft}});
            Env.update({name: 'status'}, { $set: {val: String('-1')} });

            DraftModel._draftTimerFunction('start');
            
        } else {
            throw new Meteor.Error(35, 'Ошибка создания драфта. Не полные команды');
            return;
        }
    },
    
    _draftTimerFunction: function(step) {

        if(draftTimerHandler) {
            Meteor.clearTimeout(draftTimerHandler);
        }

        let time;
        
        if(step == 'stop') {

            time = 0;    
        } else {
            time = (step == 'start') ? 1: parseInt(Env.findOne({name: 'draftTime'}).val) + 1;

            draftTimerHandler = Meteor.setTimeout(DraftModel._draftTimerFunction, 600);
        }

        Env.update({name: 'draftTime'}, {$set: {val: String(time)}});
    },
    
    _getTeamByPlayerId: function(_id) {
        var team = Draft.findOne({'val': _id});

        if(!team || !team.name) {
            throw new Meteor.Error(36, 'Ошибка авторизации');
            return;
        }
        
        return team;
    },
    
    _getCurrentPlayerAndData: function(con_id) {

        var currentPlayer = Con.findOne({con_id: con_id});

        if (!currentPlayer) {
            throw new Meteor.Error(31, 'Ошибка авторизации');
            return;
        }
        
        var data = Draft.findOne({name: 'data'});

        if (!data || !data.val) {
            throw new Meteor.Error(32, 'Ошибка авторизации');
            return;
        }

        return [currentPlayer, data.val];
    },
    
    _updateData: function(data) {
        Draft.update({name: 'data'}, {
            $set: {
                'val.currentStep': data.currentStep,
                'val.currentPlayer': data.currentPlayer,
                'val.currentTeam': data.currentTeam,
                'val.steps': data.steps,
                'val.ban': data.ban,
                'val.pick': data.pick,
                'val.like': data.like,
                'val.role': data.role
            }
        });
    },
    
    step: function(h) {
        
        var [currentPlayer, data] = DraftModel._getCurrentPlayerAndData(this.connection.id);
         
        if (ConModel.isAdmin(this.connection.id)) { //ЭТО АДМИНИСТРАТОР
            DraftModel._pick(data, h);
            return;
        }

        var team = DraftModel._getTeamByPlayerId(currentPlayer._id);
        
        if (data.currentTeam != team.name) { //Не подходит команда
            throw new Meteor.Error(33, 'Ошибка авторизации');
            return;
        }

        if (team.val.indexOf(currentPlayer._id) != data.currentPlayer) { //Не подходит игрок
            throw new Meteor.Error(34, 'Ошибка авторизации');
            return;
        }

        
        DraftModel._pick(data, h);
    },

    _pick: function(data, h) {

        if (data.pick.indexOf(h) <= -1 && data.ban.indexOf(h) <= -1) {

            var action = actionByStep[data.currentStep];

            data[action].push(h);
            data.steps.push(h);

            data.currentStep++;
            data.currentTeam = teamByStep[data.currentStep];
            data.currentPlayer = playerByStep[data.currentStep];

            DraftModel._updateData(data);

            if(data.currentStep == 10) {
                DraftModel._draftTimerFunction('stop');
            } else {
                DraftModel._draftTimerFunction('start');
            }

            
            
        } else {
            throw new Meteor.Error('500', 'Герой уже был выбран ранее');
        }
    },

    setLike: function(h, a) {
        
        var [currentPlayer, data] = DraftModel._getCurrentPlayerAndData(this.connection.id);

        var team = DraftModel._getTeamByPlayerId(currentPlayer._id);

        if(!data.like[team.name][h]) {
            data.like[team.name][h] = {};
        }

        if(data.like[team.name][h][currentPlayer.name] && data.like[team.name][h][currentPlayer.name] == a) {
            delete data.like[team.name][h][currentPlayer.name];
        } else {
            data.like[team.name][h][currentPlayer.name] = a;
        }

        DraftModel._updateData(data);
    },

    setRole: function(role) {

        var [currentPlayer, data] = DraftModel._getCurrentPlayerAndData(this.connection.id);

        var team = DraftModel._getTeamByPlayerId(currentPlayer._id);

        if(!data.role[team.name][currentPlayer._id]) {
            data.role[team.name][currentPlayer._id] = { role: '', build: '' };
        }

        if(data.role[team.name][currentPlayer._id].role == role) {
            data.role[team.name][currentPlayer._id].role = '';
        } else {
            data.role[team.name][currentPlayer._id].role = role;
        }

        DraftModel._updateData(data);
    },

    setBuild: function(build) {

        var [currentPlayer, data] = DraftModel._getCurrentPlayerAndData(this.connection.id);

        var team = DraftModel._getTeamByPlayerId(currentPlayer._id);

        if(!data.role[team.name][currentPlayer._id]) {
            data.role[team.name][currentPlayer._id] = { role: '', build: '' };
        }

        if(data.role[team.name][currentPlayer._id].build == build) {
            data.role[team.name][currentPlayer._id].build = '';
        } else {
            data.role[team.name][currentPlayer._id].build = build;
        }

        DraftModel._updateData(data);
    },

    close: function() {
        if (!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }

        DraftModel._draftTimerFunction('stop');
        Env.update({name: 'status'}, { $set: {val: String(0)} });
    }
};

Meteor.methods({
    'draft.create': DraftModel.create,
    'draft.step': DraftModel.step,
    'draft.setLike': DraftModel.setLike,
    'draft.setRole': DraftModel.setRole,
    'draft.setBuild': DraftModel.setBuild,
    'draft.close': DraftModel.close
});

