const teamByStep = ['A', 'B', 'A', 'B', 'B', 'A', 'B', 'A', 'B', 'A', 'A', 'B', 'A', 'B', 'A', 'B'];
const actionByStep = ['ban', 'ban', 'pick', 'pick', 'pick', 'pick', 'ban', 'ban', 'pick', 'pick', 'pick', 'pick', 'ban', 'ban', 'pick', 'pick'];

var heroes = ['adagio', 'alpha', 'ardan', 'baptiste', 'baron', 'blackfeather', 'catherine', 'celeste',
    'churnwalker', 'flicker', 'fortress', 'glaive', 'grace', 'grumpjaw', 'gwen', 'idris', 'joule', 'kestrel', 
    'koshka', 'krul', 'lance', 'lorelai', 'lyra', 'ozo', 'petal', 'phinn', 'reim', 'reza', 'ringo', 'rona', 'samuel', 
    'saw', 'skaarf', 'skye', 'taka', 'varya', 'vox'];

Template._draft.helpers({

    'heroes': function () {

        let data = Draft.findOne({name: 'data'}),
            steps = [];

        if (data && data.val && data.val.steps) {
            steps = data.val.steps;
        }

        let team = Draft.findOne({'val': localStorage.getItem('myPersonalId')});

        if(!team) {

            return _.map(heroes, function (i) {
                return {name: i, class: steps.indexOf(i) > -1 ? 'checked' : ''};
            });

        } else {

            return _.map(heroes, function (i) {

                let likes = [];

                if(data.val.like[team.name][i]) {
                    likes = _.map(data.val.like[team.name][i], function(action, name){
                        return {name: name, action: action};
                    })
                }

                return {name: i, class: steps.indexOf(i) > -1 ? 'checked' : '', 'likes': likes};
            });
        }
    },

    'styleStep': function (n) {
        let data = Draft.findOne({name: 'data'}),
            byStep = teamByStep[n] == 'A' ? {color : '#63D1F4', bk: 'blueban'} : {color : '#FBA16C', bk: 'orangeban'};

        if (data && data.val) {
            if (data.val.currentStep == n) {
                return 'background-color: ' + byStep.color;
            } else if (data.val.steps && data.val.steps[n]) {
                if (actionByStep[n] == 'ban') {
                    return 'background-image: url(\'/css/' + byStep.bk + '.png\'), url(\'/img/' + data.val.steps[n] + '.gif\'); background-position: center, center; background-repeat: no-repeat;';
                } else {
                    return 'background-image: url(\'/img/' + data.val.steps[n] + '.gif\');';
                }
            }
        }
    },

    'playerPlace': function(team, position, steps) {

        let _id = localStorage.getItem('myPersonalId'),
            teamIds = Draft.findOne({name: team});

        if(!teamIds || !teamIds.val || !teamIds.val[position]) {
            return;
        }
        
        let player = Con.findOne({_id: teamIds.val[position]}),
            currentTeam = Draft.findOne({'val': _id});
        
        if(!player) {
            return;
        }

        if(currentTeam && currentTeam.name == team) {
            var data = Draft.findOne({name: 'data'});

            if (!data || !data.val ) {
                return;
            }
            
            if(data.val.role[team][player._id]) {
                player.role = data.val.role[team][player._id];
            }
        }

        /*steps = String(steps).split('-');

        let draft = Draft.findOne({name: 'data'});

        player.isCurrent = draft && draft.val && steps.indexOf(String(draft.val.currentStep)) > -1 ? true : false;

        console.log(player);*/

        player.isMe = player._id == _id;

        return player;
    },

    'isCurrent': function(steps) {

        steps = String(steps).split('-');
        
        let data = Draft.findOne({name: 'data'});

        return data && data.val && steps.indexOf(String(data.val.currentStep)) > -1 ? true : false;
    },
    
    currentRole: function() {
        
        let _id = localStorage.getItem('myPersonalId'),
            data = Draft.findOne({name: 'data'}),
            team = Draft.findOne({'val': _id});

        if(!team || !team.name || !data || !data.val) {
            return;
        }
        
        return !data.val.role[team.name][_id] ? {role: '', build: ''} : data.val.role[team.name][_id];
    }
});

var selectHeroes = function(h) {

    if(isAdmin()) {
        var diag = $('<div id="myDialog" title="Выполнить драфт за игрока?">Вы хотите выбрать '+h+ ' за игрока?/div>');
        diag.dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                'Да, выбрать': function () {
                    Meteor.call('draft.step', h, function (err) {
                        if (err) {
                            console.log(err);
                            sAlert.error(err.reason);
                        }
                        diag.dialog('close');
                        diag.remove();
                    });
                },
                'Отмена': function () {
                    diag.dialog('close');
                    diag.remove();
                }
            }
        });
        diag.dialog('open');

        return false;
    }

    let _id = localStorage.getItem('myPersonalId'),
        data = Draft.findOne({name: 'data'}),
        team = Draft.findOne({'val': _id});
    
    if(!team) {
        sAlert.error('Ошибка авторизации!');
        return;
    }

    if (data && data.val && data.val.currentTeam == team.name && team.val.indexOf(_id) == data.val.currentPlayer) {
        if (data.val.steps && data.val.steps.indexOf(h) <= -1) {
            Meteor.call('draft.step', h, function (err) {
                if (err) {
                    console.log(err);
                    sAlert.error(err.reason);
                }
            })
        } else {
            sAlert.error('Герой уже был выбран ранее');
        }
    } else {
        sAlert.error('Сейчас не Ваш ход');
    }
};

var preSelectHero = false;
var dblClickDetector = false;

Template._draft.events({

    'click .block-action .pick': function(e) {

        e.preventDefault();

        let team = e.currentTarget.dataset.team,
            teamIds = Draft.findOne({name: team}),
            position = parseInt(e.currentTarget.dataset.position);

        if(!team || !teamIds || !teamIds.val || !teamIds.val[position]) {
            return;
        }

        if(localStorage.getItem('myPersonalId') == teamIds.val[position]) {
            $( '#roleSelect' ).toggle();
        }

        return false;
    },

    'click #closeDBD': function() {
        Meteor.call('draft.close');
    },

    'click .likeSelector img, touchend .likeSelector img': function(e) {
        e.preventDefault();

        preSelectHero = false;

        let h = e.currentTarget.dataset.name,
            a = e.currentTarget.dataset.action,
            _id = localStorage.getItem('myPersonalId'),
            team = Draft.findOne({'val': _id});

        if(!_id || !team) {
            return;
        }

        Meteor.call('draft.setLike', h, a);
        
        $('.likeSelector').addClass('hidden');

        return false;
    },

    'touchend #heroesIcons .heroSelector, click #heroesIcons .heroSelector': function(e) { //NO ZOOM
        e.preventDefault();

        let hero = e.currentTarget.dataset.name;

        if(dblClickDetector && hero == preSelectHero) {
            $('.likeSelector').addClass('hidden');
            selectHeroes(hero);
            dblClickDetector = false;

        } else {

            preSelectHero = hero;

            dblClickDetector = true;

            if(!Draft.findOne({'val': localStorage.getItem('myPersonalId')})) {
                return;
            } else {
                $('.likeSelector').addClass('hidden');
                $(e.currentTarget).find('.likeSelector').removeClass('hidden');
            }

            Meteor.setTimeout(function() { dblClickDetector = false; }, 666);
        }
        return false;
    },
    
    'click #roleSelect .roleItem div': function(e) {
        Meteor.call('draft.setRole', e.currentTarget.dataset.role);
    },

    'click #roleSelect .buildItem': function(e) {
        Meteor.call('draft.setBuild', e.currentTarget.dataset.build);
    }
});

Template._draft_time.helpers({
    time: function() {
        
        let time = parseInt(Env.findOne({name: 'draftTime'}).val);
        
        return time > 100 ? 100 : time;
    }
});