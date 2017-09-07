Template._draft.helpers({

    'teamList': function(team) {

        var data = Draft.findOne({name: 'data'});

        if (!data || !data.val ) {
            return;
        }

        var currentTeam = data.val.currentTeam;
        var currentPlayer = data.val.currentPlayer;

        var teamIds = Draft.findOne({name: team});

        if(!teamIds) {
            return;
        }

        var list = [];

        _.each(teamIds.val, function(i, key){
            var player = Con.findOne({_id: i});
            if(currentTeam == team && currentPlayer == key) {
                player.isCurrent = true;
            }

            list.push(player);
        });

        return list;
    },

    'heroes': function () {

        var data = Draft.findOne({name: 'data'});
        var steps = [];

        if (data && data.val && data.val.steps) {
            steps = data.val.steps;
        }

        var team = Draft.findOne({'val': localStorage.getItem('myPersonalId')});

        if(!team) {
            return _.map(heroes, function (i) {
                return {name: i, class: steps.indexOf(i) > -1 ? 'checked' : ''};
            });
        } else {
            return _.map(heroes, function (i) {

                var likes = [];

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
        var data = Draft.findOne({name: 'data'});

        if (data && data.val) {
            if (data.val.currentStep == n) {
                var color = teamByStep[n] == 'A' ? '#63D1F4' : '#FBA16C';
                return 'background-color: ' + color;
            } else if (data.val.steps && data.val.steps[n]) {
                if (actionByStep[n] == 'ban') {
                    var back = teamByStep[n] == 'A' ? 'blueban' : 'orangeban';
                    return 'background-image: url(\'/css/' + back + '.png\'), url(\'/img/' + data.val.steps[n] + '.gif\'); background-position: center, center; background-repeat: no-repeat;';
                } else {
                    return 'background-image: url(\'/img/' + data.val.steps[n] + '.gif\');';
                }
            }
        }
    }
});

var selectHeroes = function(e) {
    var h = e.currentTarget.dataset.name;
    var data = Draft.findOne({name: 'data'});
    var team = Draft.findOne({'val': localStorage.getItem('myPersonalId')});

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
    
    if(!team) {
        sAlert.error('Ошибка авторизации!');
        return;
    }

    if (data && data.val && data.val.currentTeam == team.name && team.val.indexOf(localStorage.getItem('myPersonalId')) == data.val.currentPlayer) {
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

var dblClickDetector = false;

Template._draft.events({

    'click #closeDBD': function() {
        Meteor.call('draft.close');
    },

    'click .likeSelector img, touchend .likeSelector img': function(e) {

        e.preventDefault();

        var _myId = localStorage.getItem('myPersonalId');

        if(!_myId) {
            return;
        }

        var h = e.currentTarget.dataset.name;
        var a = e.currentTarget.dataset.action;
        var team = Draft.findOne({'val': _myId});

        if(!team) {
            return;
        }

        Meteor.call('draft.setLike', h, a);
        $('.likeSelector').addClass('hidden');

        return false;
    },

    'touchend #heroesIcons .heroSelector, click #heroesIcons .heroSelector': function(e) { //NO ZOOM
        e.preventDefault();

        if(dblClickDetector) {
            selectHeroes(e);
            dblClickDetector = false;
        } else {
            dblClickDetector = true;

            Meteor.setTimeout(function() {
                if(dblClickDetector) {
                    if(!Draft.findOne({'val': localStorage.getItem('myPersonalId')})) {
                        return;
                    } else {
                        $('.likeSelector').addClass('hidden');
                        $(e.currentTarget).find('.likeSelector').removeClass('hidden');
                    }
                }
                dblClickDetector = false;
            }, 555);
        }
        return false;
    }
});