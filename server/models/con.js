ConModel = {

    /** Создание нового пользователя
     * @param data данные пользователя
     * @returns {*}
     */
    setPersonalId: function (_id) {
        Con.upsert({ _id: _id }, { $set: {con_id: this.connection.id, online: true, type: 'client'} });
    },

    setName: function (_id, name) {
        var flag = Con.findOne({name: name});

        if(flag) {
            throw new Meteor.Error(1, 'Игровой ник уже участвует в турнире');
            return;
        }

        Con.update({_id: _id}, {$set: {name: name, command: 0}});
    },

    setCommand: function(_id, command) {

        var flag = Con.find({command: command}).count();

        if(flag >= 3 && command > 0) {
            throw new Meteor.Error(2, 'В команде может быть не больше трёх игроков');
            return;
        }

        Con.update({_id: _id}, {$set: {command: command}});
    },

    setOffline: function(con_id) {
        Con.update({con_id: con_id}, {$set: {online: false}});
    },


    getRandomTo: function(command) {
        var flag = Con.find({command: command}).count();

        if(flag >= 3 && command > 0) {
            throw new Meteor.Error(2, 'В команде может быть не больше трёх игроков');
            return;
        }

        var list = Con.find({type: 'client', name: {$exists: true}, command: { $eq: 0}, online: true }).fetch();

        if(!list || list.length == 0) {
            throw new Meteor.Error(3, 'В пуле нет участников онлайн');
            return;
        }

        var item = list[_.random(0, list.length-1)];

        Con.update({_id: item._id}, {$set: {command: command}});
    }
};

/**
 * Методы Users
 */
Meteor.methods({
    'con.setPersonalId': ConModel.setPersonalId,
    'con.setName': ConModel.setName,
    'con.setCommand': ConModel.setCommand,
    'con.getRandomTo': ConModel.getRandomTo
});

Meteor.onConnection(function(connection) {
    return connection.onClose(function() {
        ConModel.setOffline(connection.id)
    });
});