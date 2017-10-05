Fiber = Npm.require('fibers');
// ================  Vainglory ============
import Vainglory from "vainglory";

const VGkey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxODZlZjg4MC00NTU1LTAxMzUtMWUzNC0wMjQyYWMxMTAwMDMiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNDk5NDQwNTU1LCJwdWIiOiJzZW1jIiwidGl0bGUiOiJ2YWluZ2xvcnkiLCJhcHAiOiIxODZiZjY2MC00NTU1LTAxMzUtMWUzMi0wMjQyYWMxMTAwMDMiLCJzY29wZSI6ImNvbW11bml0eSIsImxpbWl0IjoxMH0.3pdwjO-TGuwJdlohmeAFpk5lem6S5N3dYJ065OHlegM';

const vainglory = new Vainglory(VGkey, {
    host: 'https://api.dc01.gamelockerapp.com/shards/',
    region: 'eu',
    title: 'semc-vainglory'
});

vainglory.setRegion('eu');

// ================  Vainglory ============

ConModel = {

    /** Создание нового пользователя
     * @param data данные пользователя
     * @returns {*}
     */
    setPersonalId: function (_id) {
        Con.upsert({_id: _id}, {$set: {con_id: this.connection.id, online: true}});
    },

    setName: function (_id, name) {

        vainglory.players.getByName([name]).then(Meteor.bindEnvironment(function (player) {

            if (!player || !player.player || !player.player[0].data || !player.data[0].id) {
                //console.log('player not found', player);
                Con.update({_id: _id}, {$set: {error: 'Игрок не найден в игре (EU регион)'}});
                //throw new Meteor.Error(1, 'Игрок не найден в игре (EU регион)');
                return;
            }

            var lvl = String(Math.ceil((player.data[0].attributes.stats.skillTier + 1) / 3));
            var lvlM = String((player.data[0].attributes.stats.skillTier + 1) % 3); //0 - золото, 1 - бронза, 2 - серебро

            ConModel._setName(_id, player.data[0].attributes.name, player.data[0].id, lvl+'-'+lvlM);
        })).catch(function (errors) {
            Con.update({_id: _id}, {$set: {error: 'Игрок не найден в игре (EU регион)'}});
            //console.log('errors', errors);
            //console.log('error3');
            //throw new Meteor.Error(1, 'Игрок не найден в игре (EU регион)');
            return;
        });
    },

    _setName: function (_id, name, vg_id, level) {
        var flag = Con.findOne({name: name});

        if (flag) {
            Con.update({_id: _id}, {$set: {error: 'Игровой ник уже участвует в турнире'}});
            //console.log('error1');
            //throw new Meteor.Error(1, 'Игровой ник уже участвует в турнире');
            return;
        }

        var flag = Con.findOne({vg_id: vg_id});

        if (flag) {
            Con.update({_id: _id}, {$set: {error: 'Игровой ник уже участвует в турнире'}});
            //console.log('error2');
            //throw new Meteor.Error(1, 'Игровой ник уже участвует в турнире');
            return;
        }

        Con.update({_id: _id}, {
            $set: {
                name: name,
                command: 0,
                vg_id: vg_id,
                vg_level: String(level)
            }
        });
    },

    unsetName: function (_id) {
        Con.update({_id: _id, con_id: this.connection.id}, {$set: {name: '', command: null, vg_id: '', vg_level: ''}});

        var testCom = Com.find({list: _id}).fetch();

        if(testCom) {
            _.each(testCom, function(i){
                if(i && i.list) {

                    var newArr = [];

                    _.each(i.list, function(j){
                        if(j != _id) {
                            newArr.push(j);
                        }
                    });

                    Com.update({_id: i._id}, {$set: {list: newArr}});
                }
            })
        }
    },

    deleteName: function(name) {
        var testCon = Con.find({name: name}).fetch();

        if(testCon) {
            _.each(testCon, function(con){

                var testCom = Com.find({list: con._id}).fetch();

                if(testCom) {
                    _.each(testCom, function(i){
                        if(i && i.list) {

                            var newArr = [];

                            _.each(i.list, function(j){
                                if(j != con._id) {
                                    newArr.push(j);
                                }
                            });

                            Com.update({_id: i._id}, {$set: {list: newArr}});
                        }
                    })
                }

                Con.remove({_id: con._id});
            })
        }
    },

    banByName: function(name) {
        Ban.insert({name: name, type: 'permanent'});
    },

    setCommand: function (_id, command) {

        if (!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }

        var flag = Con.find({command: command}).count();

        if (flag > 3 && command > 0) {
            throw new Meteor.Error(2, 'В команде может быть не больше трёх игроков');
            return;
        }

        Con.update({_id: _id}, {$set: {command: command}});
    },

    setOffline: function (con_id) {
        Con.update({con_id: con_id}, {$set: {online: false}});
    },


    getRandomTo: function (command) {

        if (!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }

        var flag = Con.find({command: command}).count();

        if (flag > 3 && command > 0) {
            throw new Meteor.Error(2, 'В команде может быть не больше трёх игроков');
            return;
        }

        var list = Con.find({name: {$exists: true}, command: {$eq: 0}, online: true}).fetch();

        if (!list || list.length == 0) {
            throw new Meteor.Error(3, 'В пуле нет участников онлайн');
            return;
        }

        list = _.shuffle(list);
        
        var item = list[_.random(0, list.length - 1)];

        var test = Ban.findOne({name: item.name});

        if (test) {
            throw new Meteor.Error(3, 'Был выбран ' + item.name + ', который не может принимать участие в турнире');
            return;
        }

        Con.update({_id: item._id}, {$set: {command: command}});

        Com.update({num: parseInt(command)}, {$push: {list: item._id}});
    },

    setAdmin: function (password) {

        if (ConModel.isAdmin(this.connection.id)) {
            Env.update({name: 'password'}, {$set: {val: password}});
            return;
        }

        var realP = Env.findOne({name: 'password'});

        if (!realP && !realP.val) {
            throw new Meteor.Error(7, 'Ошибка авторизации');
            return;
        }

        if (realP.val != password) {
            throw new Meteor.Error(8, 'Ошибка авторизации');
            return;
        }

        Con.update({con_id: this.connection.id}, {$set: {type: 'Admin'}});
    },

    isAdmin: function (_id) {
        var flag = Con.findOne({con_id: _id});

        return flag && flag.type == 'Admin';
    },

    readError: function (_id) {

        Con.update({_id: _id}, {$set: {error: ''}});
    },

    removeFromBan: function (name) {
        
        
        
        if (!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }
        
        Ban.remove({name: name});
    },

    setCommandListSort: function (num, list) {

        if (!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }

        Com.update({num: num}, {$set: {list: list}});
    }
};

/**
 * Методы Users
 */
Meteor.methods({
    'con.setPersonalId': ConModel.setPersonalId,
    'con.setName': ConModel.setName,
    'con.unsetName': ConModel.unsetName,
    'con.deleteName': ConModel.deleteName,
    'con.setCommand': ConModel.setCommand,
    'con.getRandomTo': ConModel.getRandomTo,
    'con.setAdmin': ConModel.setAdmin,
    'con.readError': ConModel.readError,
    'con.removeFromBan': ConModel.removeFromBan,
    'con.banByName': ConModel.banByName,
    'con.setCommandListSort': ConModel.setCommandListSort
});

Meteor.onConnection(function (connection) {
    return connection.onClose(function () {
        ConModel.setOffline(connection.id)
    });
});