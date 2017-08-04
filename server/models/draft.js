/*Draft = new Mongo.Collection('draft');

const teamByStep = ['A', 'B', 'A', 'B', 'B', 'A', 'B', 'A', 'A', 'B'];
const actionByStep = [ 'ban', 'ban', 'pick', 'pick', 'ban', 'ban', 'pick', 'pick', 'pick', 'pick'];

const ADMIN_CODE = '916555';

// ================  Vainglory ============
import Vainglory from 'vainglory';

const VGkey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxODZlZjg4MC00NTU1LTAxMzUtMWUzNC0wMjQyYWMxMTAwMDMiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNDk5NDQwNTU1LCJwdWIiOiJzZW1jIiwidGl0bGUiOiJ2YWluZ2xvcnkiLCJhcHAiOiIxODZiZjY2MC00NTU1LTAxMzUtMWUzMi0wMjQyYWMxMTAwMDMiLCJzY29wZSI6ImNvbW11bml0eSIsImxpbWl0IjoxMH0.3pdwjO-TGuwJdlohmeAFpk5lem6S5N3dYJ065OHlegM';

const vainglory = new Vainglory(VGkey, {
    host: 'https://api.dc01.gamelockerapp.com/shards/',
    region: 'eu',
    title: 'semc-vainglory'
});

// ================  Vainglory ============

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

var defaultDraft = {
    status: 'Open',
    currentTeam: 'A',
    currentStep: 0,
    steps: [],
    log: ['New draft created'],
    ban: [],
    pick: []
};

Meteor.startup(function(){
    if(Draft.find({}).count() == 0) {
        Draft.insert({name: 'A', val: 0});
        Draft.insert({name: 'B', val: 0});
        Draft.insert({name: 'data', val: {}});
    }
});

Meteor.methods({

    'draft.create': function(code) {

        if(code == ADMIN_CODE) {

            var codeA = getRandomArbitrary(100, 999);
            var codeB = getRandomArbitrary(100, 999);

            Draft.update({name: 'A'}, {$set: {val: codeA}});
            Draft.update({name: 'B'}, {$set: {val: codeB}});
            Draft.update({name: 'data'}, {$set: {val: defaultDraft}});

            return {A: codeA, B: codeB};
        } else {
            throw new Meteor.Error('500', 'Ошибка авторизации');
        }
    },

    'draft.auth': function(code, token) {
        if(code == ADMIN_CODE) {
            return 'Admin';
        }

        var test = Draft.findOne({val: parseInt(code)});

        console.log(code, token, test);

        if(test) {
            Draft.update({_id: test._id}, {$set: {val: token}});
            Draft.update({ name: 'data' },{ $push: { 'val.log': 'Team '+test.name+' connected' }});
            return test.name;
        } else {
            throw new Meteor.Error('500', 'Ошибка авторизации');
        }
    },

    'draft.step': function(token, h) {

        console.log(token, h);

        var team = Draft.findOne({val: token});

        if(!team) {
            throw new Meteor.Error('500', 'Ошибка авторизации');
        }

        var data = Draft.findOne({name: 'data'});
        var data_id = 0;


        if(data && data.val) {
            data_id = data._id;
            data = data.val;
        } else {
            throw new Meteor.Error('500', 'Draft not created');
        }

        if(data.currentTeam == team.name) {
            if(data.pick.indexOf(h) <= -1 && data.ban.indexOf(h) <= -1) {

                var action = actionByStep[data.currentStep];

                data[action].push(h);
                data.steps.push(h);

                data.log.push('#'+data.currentStep+': Team '+team.name+' '+action+ ' '+ h);

                data.currentStep++;
                data.currentTeam = teamByStep[data.currentStep];

                Draft.update({_id: data_id}, {$set: {
                    'val.log': data.log,
                    'val.currentStep': data.currentStep,
                    'val.currentTeam': data.currentTeam,
                    'val.steps': data.steps,
                    'val.ban': data.ban,
                    'val.pick': data.pick
                }});
            } else {
                throw new Meteor.Error('500', 'Герой уже был выбран ранее');
            }
        } else {
            throw new Meteor.Error('500', 'Сейчас не Ваш ход');
        }
    },

    'test': function() {

        console.log('TEst');

        const playerNames = ['-djey-'];

        vainglory.players.getByName(playerNames).then(function(player) {
            console.log('======================');
            _.each(player.data, function(i, key){
                console.log('all', i);
                console.log('i.errors', i.errors);
                console.log('i.name', i.name);
                console.log('i.id', i.id);
                console.log('i.stats', i.stats);
            });
            console.log('======================');
            console.log(player);
            console.log('======================');
            console.log('player.errors', player.errors);
            console.log('player.name', player.name);
            console.log('player.id', player.id);
            console.log('player.stats', player.stats);
        }).catch(function(errors) {
            console.log('errors', errors);
        });
    }
});

Meteor.publish('draft', function (code) {
    return code == ADMIN_CODE ? Draft.find({}) : Draft.find({name: 'data'});
});
*/
