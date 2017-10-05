//https://lyra.vgpro.gg/matches/eu/djeyclub/all/

/*
 468 × 60
 <script type="text/javascript">
 var begun_auto_pad = 464665398;
 var begun_block_id = 464665854;
 </script>
 <script src="//autocontext.begun.ru/autocontext2.js" type="text/javascript"></script>
 код бегуна
 */

var mobilecheck = function () {
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)))
};

var commandSort = function () {
    $('.commandListUL').each(function () {
        var command = parseInt(this.dataset.key);
        var list = [];
        $(this).find('li').each(function () {
            list.push(this.dataset.id);
        });

        Meteor.call('con.setCommandListSort', command, list);
    });
};

Template.AppLayout.rendered = function () {
}

Template.AppLayout.helpers({
    'name': function () {
        var val = Env.findOne({name: 'name'});

        return val && val.name ? val.val : null;
    },

    'is_player': function () {
        return Con.findOne({_id: localStorage.getItem('myPersonalId'), name: {$exists: true}});
    }
});


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

    'click #newBetWinLose': function (e) {
        //type = -2 : #ПобедаИлиПоражение
        Meteor.call('bet.newBet', '-2', function (err) {
            if (err) {
                console.log(err);
                sAlert.error(err.reason);
            }
        });
    },

    'click #newBetRedBlue': function (e) {
        //type = -3 : #КраснаяИлиСиняя
        Meteor.call('bet.newBet', '-3', function (err) {
            if (err) {
                console.log(err);
                sAlert.error(err.reason);
            }
        });
    },

    'click #randomDjeycoin': function () {

        var max = Djeycoin.findOne({}, {sort: {coin: -1}});

        max = max && max.coin ? max.coin : 0;

        var list = Djeycoin.find({coin: max}).fetch();

        if (list.length > 0) {
            var item = list[_.random(0, list.length - 1)];
            var msg = _.map(list, function (i) {
                return i.name;
            })
        } else {
            sAlert.error('Не найдено чемпионов по Djeycoin');
            return;
        }

        var diag = $(`
            <div id="myDialog" title="Чемпион по DjeyCoin!">
                <p>Поздравляем следующих победителей!</p>
                <p>` + msg.join(', ') + `</p>
                <p>Случайным победителем выбран ` + item.name + `!</p>
            </div>`);
        diag.dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                'Сбросить все DjeyCoin': function () {
                    Meteor.call('bet.resetDjeyCoin', function (err) {
                        if (err) {
                            console.log(err);
                            sAlert.error(err.reason);
                        }
                        diag.dialog('close');
                        diag.remove();
                    });
                },
                'Закрыть': function () {
                    diag.dialog('close');
                    diag.remove();
                }
            }
        });
        diag.dialog('open');
    },

    'click #banList': function () {

        var list = Ban.find({type: 'permanent'}).fetch();


        var html = '';

        _.each(list, function (i) {
            html += `<p>` + i.name + `<button onclick="Meteor.call('con.removeFromBan', '` + i.name + `'); $(this).parent().remove()">&#8635;</button></p>`;
        });

        var diag = $('<div id="myDialog" title="Черный список">' + html + '</div>');
        diag.dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                'Закрыть': function () {
                    diag.dialog('close');
                    diag.remove();
                }
            }
        });
        diag.dialog('open');
    },

    'click #randomLucky': function () {

        var list = Con.find({name: {$exists: true}}).fetch();

        if (!list || list.length == 0) {
            throw new Meteor.Error(3, 'В пуле нет участников онлайн');
            return;
        }

        list = _.shuffle(list);

        var item = list[_.random(0, list.length - 1)];

        var diag = $(`
            <div id="myDialog" title="Поздравляем победителя!">
                <p>Поздравляем победителея!</p>
                <p><b>` + item.name + `</b></p>
            </div>`);
        diag.dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                'Закрыть': function () {
                    diag.dialog('close');
                    diag.remove();
                }
            }
        });
        diag.dialog('open');
    },

    'click #showDjeycoin': function () {

        var player = Con.findOne({_id: localStorage.getItem('myPersonalId'), name: {$exists: true}});

        if (!player || !player.name) {
            return;
        }

        var coin = Djeycoin.findOne({name: player.name});

        coin = (!coin || !coin.coin) ? 0 : coin.coin;

        if(mobilecheck()) {
            alert('На данный момент у Вас ' + coin + ' Djeycoin');
        } else {
            var diag = $(`
            <div id="myDialog" title="Мои DjeyCoin">
                <span id="dialogMsg">На данный момент у Вас <strong>` + coin + `</strong> Djeycoin </span>
            </div>`);
            diag.dialog({
                autoOpen: false,
                modal: true,
                buttons: {
                    'Хорошо': function () {
                        diag.dialog('close');
                        diag.remove();
                    }
                }
            });
            diag.dialog('open');
        }
    }
});

Template.envStatus.helpers({


    'resetZoom': function () {
        $('#dbd').focus()
    },

    'status': function () {
        /*
         0 = Турнир
         -1 = Драфт
         -2 = Ставки #ПобедаИлиПоражение
         -3 = Стаки #КраснаяИлиСиняя
         Что-то другое = Победа какой-то комманды в турнире
         */

        var val = Env.findOne({name: 'status'});

        if (val) {
            if (val.val == '0') {
                return;
            } else if (val.val == '-1' || val.val == '-2' || val.val == '-3') {
                return val.val;
            } else {
                return 'Турнир окончен.<br> Победа за <strong>' + comName(val.val) + '</strong>!';
            }
        }
    }
});

Template.envStatus.events({
    'click p.close': function () {
        $('#envStatus').remove();
    }
});

Template.liPlayer.rendered = function () {
    $(this.firstNode).addClass('moved');
    $('#conList ul').height($('#commandTable').height() - 150);
};

Template.liPlayer.helpers({
    'isMe': function () {
        return this._id == localStorage.getItem('myPersonalId') ? 'isMe' : '';
    }
});

Template.liPlayer.events({

    'dblclick li': function (e) {

        if (isAdmin()) {
            var name = e.currentTarget.dataset.name;

            var diag = $('<div id="myDialog" title="Выкинуть игрока?">Вы действительно выкинуть <strong>' + name + '</strong>?</div>');
            diag.dialog({
                autoOpen: false,
                modal: true,
                buttons: {
                    'Да, выкинуть его': function () {
                        Meteor.call('con.deleteName', name, function (err) {
                            if (err) {
                                console.log(err);
                                sAlert.error(err.reason);
                            }
                        });

                        diag.dialog('close');
                        diag.remove();
                    },
                    'Не учавствует в турнирах': function () {
                        Meteor.call('con.banByName', name, function (err) {
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
        }
    },

    'click li': function (e) {
        if (!isAdmin()) {
            window.open('https://vgpro.gg/players/eu/' + e.currentTarget.dataset.name, '_blank');
        }
    }
});

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

        if (!com || !com.list) {
            return;
        }

        return _.map(com.list, function (_id) {
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

        if (mobilecheck()) {

            var name = prompt('Введите имя персонажа в игре VainGlory ', '');

            if (name) {
                Meteor.call('con.setName', localStorage.getItem('myPersonalId'), name, function (err) {
                    if (err) {
                        console.log(err);
                        sAlert.error(err.reason);
                    }
                });
            }
        } else {

            var diag = $(`<div id="setPlayer-dialog" title="Принять участие">
                            <br>
                            <label for="name">Ник в игре VainGlory</label>
                            <br><br>
                            <input type="text" id="setPlayer-name" value="" class="text ui-widget-content ui-corner-all">
                            <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
                        </div>`);

            var diag = diag.dialog({
                autoOpen: false,
                height: 250,
                width: 350,
                modal: true,
                resizable: true,
                buttons: {
                    'Принять участие': function (e) {
                        var name = $(this).find('#setPlayer-name').val();

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

                            diag.dialog('close');
                            diag.remove();
                        }
                    },
                    'Отмена': function () {
                        diag.dialog('close');
                        diag.remove();
                    }
                }
            });

            diag.dialog('open');
        }

        return;
    },

    'click #unsetPlayer': function () {

        if(mobilecheck()) {
            if(confirm('Хотите отказаться от участия в турнире?')) {
                Meteor.call('con.unsetName', localStorage.getItem('myPersonalId'), function (err) {
                    if (err) {
                        console.log(err);
                        sAlert.error(err.reason);
                    }
                });
            }
        } else {

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
        }
    },

    'click .edit': function (e) {
        e.preventDefault();

        var key = e.currentTarget.dataset.key;

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

    'click .draft': function (e) {
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

    'click #lastList .remove': function (e) {
        e.preventDefault();
        var diag = $(`
            <div id="myDialog" title="Внимание!">
                <span id="dialogMsg">Удалить ` + e.currentTarget.dataset.name + ` из списка прошлых участинков?</span>
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
 