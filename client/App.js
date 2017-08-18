//https://lyra.vgpro.gg/matches/eu/djeyclub/all/

const teamByStep = ['A', 'B', 'A', 'B', 'B', 'A', 'B', 'A', 'A', 'B'];
const actionByStep = ['ban', 'ban', 'pick', 'pick', 'ban', 'ban', 'pick', 'pick', 'pick', 'pick'];
const playerByStep = [0, 0, 0, 0, 0, 0, 1, 1, 2, 2];

var heroes = ['reza', 'grace', 'adagio', 'alpha', 'ardan', 'baptiste', 'baron', 'blackfeather', 'catherine', 'celeste', 'flicker',
    'fortress', 'glaive', 'grumpjaw', 'gwen', 'idris', 'joule', 'kestrel', 'koshka', 'krul', 'lance', 'lyra',
    'ozo', 'petal', 'phinn', 'ringo', 'reim', 'rona', 'samuel', 'saw', 'skaarf', 'skye', 'taka', 'vox'
];

Template.AppLayout.helpers({
    'name': function () {
        var val = Env.findOne({name: 'name'});

        return val && val.name ? val.val : null;
    }
});


var commandSort = function() {
    $('.commandListUL').each(function(){
        var command = parseInt(this.dataset.key);
        var list = [];
        $(this).find('li').each(function(){
            list.push(this.dataset.id);
        });

        Meteor.call('con.setCommandListSort', command, list);
    })
};

Template.AppLayout.events({

    'click #newTour': function (e) {
        e.preventDefault();
        var diag = $(`
            <div id="myDialog" title="Внимание!">
                <span id="dialogMsg">Уверены, что хотите создать новый турнир?</span>
                <p><input id="newTourName" style="width: 100%" type="text" value="VainGlory турнир от Djey"></p>
            </div>`);
        diag.dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                'Да, создать новый турнир': function () {
                    Meteor.call('tour.newTour', $('#newTourName').val(), function (err) {
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
    },

    'click #logo': function () {
        var win = window.open('https://www.twitch.tv/djey2828', '_blank');
        win.focus();
    }
});

Template.envStatus.helpers({
    'status': function () {
        var val = Env.findOne({name: 'status'});

        if (val) {
            if (val.val == '0') {
                return;

            } else if(val.val == '-1') {
                return val.val;
            } else {
                return 'Турнир окончен.<br> Победа за <strong>' + comName(val.val) + '</strong>!';
            }
        }
    }
});

var setPlayer_dialog;

Template.setPlayer.rendered = function () {
    setPlayer_dialog = $('#setPlayer-dialog').dialog({
        autoOpen: false,
        height: 250,
        width: 350,
        modal: true,
        resizable: false,
        buttons: {
            'Принять участие': function () {
                var name = $('#setPlayer-name').val();

                if (!name) {
                    sAlert.error('Введите игровой ник');
                    return;
                } else {
                    Meteor.call('con.setName', localStorage.getItem('myPersonalId'), name, function (err) {
                        if (err) {
                            console.log(err);
                            sAlert.error(err.reason);
                        }
                    });

                    setPlayer_dialog.dialog('close');
                }
            },
            'Отмена': function () {
                setPlayer_dialog.dialog('close');
            }
        }
    });
};

Template.liPlayer.rendered = function () {
    $(this.firstNode).addClass('moved');
};

Template.index.rendered = function () {
    if (isAdmin()) {
        $('#conList ul, .commandItem ul').sortable({
            connectWith: ".connectedSortable",
            stop: function (e, ui) {
                Meteor.call('con.setCommand', ui.item.data('id'), ui.item.parent().data('key'), function (err) {
                    if (err) {
                        console.log(err);
                        sAlert.error(err.reason);
                        Meteor.setTimeout(function () {
                            document.location.reload(true);
                        });
                    } else {
                        commandSort();
                    }
                });
            }
        }).disableSelection();
    }
};

Template.index.helpers({

    'error': function () {
        var p = Con.findOne({_id: localStorage.getItem('myPersonalId')});

        if (p && p.error) {
            sAlert.error(p.error);
            Meteor.call('con.readError', localStorage.getItem('myPersonalId'));
        }
    },

    'tour_list': function () {
        var tour = {};

        _.each(Tour.find({}).fetch(), function (i) {
            if (!tour[i.tour]) {
                tour[i.tour] = {
                    tour: i.tour,
                    match: {}
                }
            }

            if (!tour[i.tour].match[i.match]) {
                tour[i.tour].match[i.match] = {
                    tour: i.tour,
                    match: i.match,
                    commands: i.commands,
                    status: i.status
                };
            }
        });

        return _.map(tour, function (i) {
            return _.map(i.match, function (j) {
                return j;
            });
        });
    },

    'command_status': function (num) {
        return Con.find({
            name: {$exists: true},
            command: num,
            online: true
        }).count() == 3 ? '' : 'offline';
    },

    'con_list': function () {
        return Con.find({name: {$exists: true}, command: {$eq: 0}}, {sort: {online: -1, name: 1}}).fetch();
    },

    'command_list': function () {
        return [1, 2, 3, 4, 5, 6, 7, 8];
    },

    'last_list': function () {
        return Ban.find({type: 'last_tour'}).fetch();
    },

    'command_player': function (num) {

        var com = Com.findOne({num: parseInt(num)});

        if(!com || !com.list) {
            return;
        }

        return _.map(com.list, function(_id){
            return Con.findOne({_id: _id});
        })
    },

    'stats': function () {
        return {
            all: Con.find({online: true}).count(),
            player: Con.find({name: {$exists: true}}).count()
        }
    },

    'is_player': function () {
        return Con.findOne({_id: localStorage.getItem('myPersonalId'), name: {$exists: true}});
    }
});

Template.index.events({

    'click #setPlayer': function () {
        setPlayer_dialog.dialog('open');
    },

    'click #unsetPlayer': function () {
        var diag = $('<div id="myDialog" title="Внимание!"><span id="dialogMsg">Вы действительно хотите отказаться от участия в турнире?</span></div>');
        diag.dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                'Да, хочу отказаться': function () {

                    Meteor.call('con.unsetName', localStorage.getItem('myPersonalId'), function (err) {
                        if (err) {
                            console.log(err);
                            sAlert.error(err.reason);
                        }
                    });

                    diag.dialog('close');
                    diag.remove();
                },
                'Отмена': function () {
                    diag.dialog('close');
                    diag.remove();
                }
            }
        });
        diag.dialog('open');
    },

    'click .addRondomTo .edit': function (e) {
        e.preventDefault();

        var key = $(e.currentTarget).parent().data('key');

        var diag = $(`
            <div id="myDialog" title="Переименовать команду">
                <p><input id="newCommandName" style="width: 100%" type="text" value="` + comName(key) + `"></p>
            </div>`);
        diag.dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                'Переименовать': function () {
                    Meteor.call('tour.renameCommand', key, $('#newCommandName').val(), function (err) {
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
    },

    'click .addRondomTo': function (e) {

        if (!isAdmin()) {
            return;
        }

        var key = e.currentTarget.dataset.key;
        var diag = $('<div id="myDialog" title="Внимание!"><span id="dialogMsg">Добавить рандомного игрока в "' + comName(key) + '"?</span></div>');
        diag.dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                'Добавить': function () {
                    Meteor.call('con.getRandomTo', key, function (err) {
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
    },

    'click .commandIsWin': function (e) {
        //data-commands="{{match.commands}}" data-tour="{{match.tour}}" data-match="{{match.match}}" data-win="{{.}}"

        var ds = e.currentTarget.dataset;

        var commands = ds.commands.split(',');

        if (commands.length != 2) {
            sAlert.error('Ошибка выбора победителя!');
            return;
        }

        var commandWin = ds.win;
        var winButton = 'Победа за "' + comName(commandWin) + '"';

        var commandLose = commands[0] == commandWin ? commands[1] : commands[0];

        var msg = 'В туре <strong>' + ds.tour + '</strong>, матче <strong>' + ds.match + '</strong>';
        msg += '<br><br>команда "<strong>' + comName(commandWin) + '</strong>" победила команду "<strong>' + comName(commandLose) + '</strong>"?';

        var buttons = {};

        buttons[winButton] = function () {
            Meteor.call('tour.setWin', ds, function (err, data) {
                if (err) {
                    console.log(err);
                    sAlert.error(err.reason);
                }
                diag.dialog('close');
                diag.remove();
            });
        };

        buttons['Отмена'] = function () {
            diag.dialog('close');
            diag.remove();
        };


        var diag = $('<div id="myDialog" title="Победитель"><span id="dialogMsg">' + msg + '</span></div>');
        diag.dialog({
            autoOpen: false,
            modal: true,
            buttons: buttons
        });
        diag.dialog('open');
    },
    
    'click .draft': function(e) {
        var ds = e.currentTarget.dataset;

        Meteor.call('draft.create', ds.tour, ds.match, function (err, data) {
            if (err) {
                console.log(err);
                sAlert.error(err.reason);
            } else {
                sAlert.success('Draft created!');
            }
        });
    },
    
    'click #lastList .remove': function(e) {
        e.preventDefault();
        var diag = $(`
            <div id="myDialog" title="Внимание!">
                <span id="dialogMsg">Удалить `+e.currentTarget.dataset.name+ ` из списка прошлых участинков?</span>
            </div>`);
        diag.dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                'Да, удалить': function () {
                    Meteor.call('con.removeFromBan', e.currentTarget.dataset.name, function (err) {
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
});

Template.signin.events({
    'click #authSend': function () {
        Meteor.call('con.setAdmin', $('#authPassword').val(), function (err) {
            if (err) {
                console.log(err);
                sAlert.error(err.reason);
            } else {
                Router.go('/');
            }
        })
    }
});

Template.dbd.helpers({

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

        return _.map(heroes, function (i) {
            return {name: i, class: steps.indexOf(i) > -1 ? 'checked' : ''};
        });
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

Template.dbd.events({

    'click #closeDBD': function() {
        Meteor.call('draft.close');
    },
    
    'click #heroesIcons div': function (e) {

        var h = e.currentTarget.dataset.name;
        var data = Draft.findOne({name: 'data'});
        var team = Draft.findOne({'val': localStorage.getItem('myPersonalId')});

        if(!team) {
            sAlert.error('Ошибка авторизации');
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
    }
});
 