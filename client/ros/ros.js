Template.ros.helpers({
   'list': function() {

       let list = {'wait':[], 'play': [], 'end': []};
       
       _.each(Ros.find({}).fetch(), function(item){
           list[item.status].push(item.name);
       });

       return list;
   } 
});

Template.ros.events({
    'click #register': function() {
        if (mobilecheck()) {

            var name = prompt('Введите имя персонажа в игре Rules of Survival ', '');

            if (name) {
                Meteor.call('ros.register', name, function (err, data) {
                    if (err) {
                        console.log(err);
                        sAlert.error(err.reason);
                    } else {
                        if(data == 1) {
                            sAlert.success('Игровой ник успешно добавлен');
                        } else {
                            sAlert.error('Игровой ник уже в был добавлен')
                        }
                    }
                });
            }
        } else {

            var diag = $(`<div id="RosRegister-dialog" title="Принять участие">
                            <br>
                            <label for="name">Введите имя персонажа в игре Rules of Survival</label>
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
                            Meteor.call('ros.register', name, function (err, data) {
                                if (err) {
                                    console.log(err);
                                    sAlert.error(err.reason);
                                } else {
                                    if (data == 1) {
                                        sAlert.success('Игровой ник успешно добавлен');
                                    } else {
                                        sAlert.error('Игровой ник уже в был добавлен')
                                    }
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
    
    'click #reset': function(e) {

        e.preventDefault();
        var diag = $(`
            <div id="myDialog" title="Внимание!">
                <span id="dialogMsg">Уверены, что хотите очистить список?</span>
            </div>`);
        diag.dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                'Да': function () {
                    Meteor.call('ros.reset', function (err) {
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

    'click #randomToPlay': function(e) {

        if (!isAdmin()) {
            return;
        }

        e.preventDefault();
        var diag = $(`
            <div id="myDialog" title="Рандомный боевой товарищ!">
                <span id="dialogMsg">Добавить рандомного игрока из очереди?</span>
            </div>`);
        diag.dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                'Да': function () {
                    Meteor.call('ros.randomToPlay', function (err, data) {
                        if (err) {
                            console.log(err);
                            sAlert.error(err.reason);
                        } else {
                            sAlert.success('Игрок ' + data + ' добавлен в пул!')
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

    'click #ros-table p': function(e) {


        if (!isAdmin()) {
            return;
        }

        var l = false;
        var name = e.currentTarget.innerHTML;

        switch ($(e.currentTarget).parent().parent().attr('id')) {
            case 'wait':
                l = {
                    text: 'Добавить ' + name + ' в боевые товарищи?',
                    method: 'setToPlay'
                };
                break;

            case 'play':
                l = {
                    text: 'Добавить ' + name + ' в боевые отставку?',
                    method: 'setToEnd'
                };
                break;

            case 'end':
                l = {
                    text: 'Убрать ' + name + ' из списка?',
                    method: 'setToDelete'
                };
                break;
        }

        var diag = $(`
            <div id="myDialog" title="Rules of Survival `+name+`">
                <span id="dialogMsg">`+l.text+`</span>
            </div>`);
        diag.dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                'Да': function () {
                    Meteor.call('ros.'+l.method, name, function (err, data) {
                        if (err) {
                            console.log(err);
                            sAlert.error(err.reason);
                        } else {
                            sAlert.success('Игрок ' + data + '. Изменено')
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

    }
});