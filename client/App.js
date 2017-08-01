Template.AppLayout.events({

    'click #newTour': function(e) {
        e.preventDefault();
        var diag = $('<div id="myDialog" title="Внимание!"><span id="dialogMsg">Уверены, что хотите создать новый турнир?</span></div>');
        diag.dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                'Да, создать новый турнир': function () {
                    Meteor.call('tour.newTour', function (err) {
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
    'status': function() {
        var val = Env.findOne({name: 'status'});

        if(val) {
            if (val.val == '1') {
                return;
            } else {
                return 'Турнир окончен.<br>' + val.val;
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
                        setPlayer_dialog.dialog('close');
                    });
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
    if(isAdmin()) {
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
                    }
                });
            }
        }).disableSelection();
    }
};

Template.index.helpers({

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
        return Con.find({name: {$exists: true}, command: {$eq: 0}}, {sort: {online: -1}}).fetch();
    },

    'command_list': function () {
        return [1, 2, 3, 4, 5, 6, 7, 8];
    },

    'command_player': function (num) {
        return Con.find({name: {$exists: true}, command: num}, {sort: {online: -1}}).fetch();
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

    'click .addRondomTo': function (e) {

        if(!isAdmin()) {
            return;
        }

        var key = e.currentTarget.dataset.key;
        var diag = $('<div id="myDialog" title="Внимание!"><span id="dialogMsg">Добавить рандомного игрока в комманду №' + key + '</span></div>');
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
        var winButton = 'Победила команда №' + commandWin;

        var commandLose = commands[0] == commandWin ? commands[1] : commands[0];

        var msg = 'В туре <strong>' + ds.tour + '</strong>, матче <strong>' + ds.match + '</strong>';
        msg += '<br><br>команда <strong>' + commandWin + '</strong> победила команду <strong>' + commandLose + '</strong>?';

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
    }

});

Template.signin.events({
    'click #authSend': function() {
        Meteor.call('con.setAdmin', $('#authPassword').val(), function(err){
            if(err) {
                console.log(err);
                sAlert.error(err.reason);
            } else {
                Router.go('/');
            }
        })
    }
});