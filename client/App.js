var  setPlayer_dialog;

Template.setPlayer.rendered = function() {
    setPlayer_dialog = $('#setPlayer-dialog').dialog({
        autoOpen: false,
        height: 250,
        width: 350,
        modal: true,
        resizable: false,
        buttons: {
            'Принять участие': function() {
                var name = $('#setPlayer-name').val();
                
                if(!name) {
                    sAlert.error('Введите игровой ник');
                    return;
                } else {
                    Meteor.call('con.setName', localStorage.getItem('myPersonalId'), name, function(err){
                        if(err) {
                            console.log(err);
                            sAlert.error(err.reason);
                        }
                        setPlayer_dialog.dialog('close');
                    });
                }
            },
            'Отмена': function() {
                setPlayer_dialog.dialog('close');
            }
        }
    });
};

Template.liPlayer.rendered = function() {
    $(this.firstNode).addClass('moved');
};

Template.index.rendered = function() {
    $('#conList ul, .commandItem ul').sortable({
        connectWith: ".connectedSortable",
        stop: function(e, ui) {
            Meteor.call('con.setCommand', ui.item.data('id'), ui.item.parent().data('key'), function(err){
                if(err) {
                    console.log(err);
                    sAlert.error(err.reason);
                    Meteor.setTimeout(function(){
                        document.location.reload(true);
                    });
                }
            });
        }
    }).disableSelection();
};

Template.index.helpers({
    'con_list': function() {
        return Con.find({type: 'client', name: {$exists: true}, command: { $eq: 0} }, {sort: {online: -1}}).fetch();
    },

    'command_list': function() {
        return [1, 2, 3, 4, 5, 6, 7, 8];
    },

    'command_player': function(num) {
        return Con.find({type: 'client', name: {$exists: true}, command: num}, {sort: {online: -1}}).fetch();
    },

    'stats': function() {
        return {
            all: Con.find({type: 'client', online: true}).count(),
            player: Con.find({type: 'client', name: {$exists: true}}).count()
        }
    },

    'is_player': function() {
        return Con.findOne({type: 'client', _id: localStorage.getItem('myPersonalId'), name: {$exists: true}});
    }
});

Template.index.events({

    'click #commandTable': function() {
        console.log('asdf');
    },

    'click #setPlayer': function() {
        console.log('opn');
        setPlayer_dialog.dialog('open');
    },

    'click .addRondomTo': function(e) {
        var key = e.currentTarget.dataset.key;
        console.log(key);
        var diag = $('<div id="myDialog" title="Testing!"><span id="dialogMsg">Добавить рандомного игрока в комманду №'+key+'</span></div>');
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
    }

});