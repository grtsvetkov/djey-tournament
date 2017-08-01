ConModel = {

    /** Создание нового пользователя
     * @param data данные пользователя
     * @returns {*}
     */
    setPersonalId: function (_id) {
        Con.upsert({ _id: _id }, { $set: {con_id: this.connection.id, online: true} });
    },

    setName: function (_id, name) {
        var flag = Con.findOne({name: name});

        if(flag) {
            throw new Meteor.Error(1, 'Игровой ник уже участвует в турнире');
            return;
        }

        Con.update({_id: _id}, {$set: {name: name, command: 0}});
    },

    unsetName: function (_id) {
        Con.update({_id: _id, con_id: this.connection.id}, {$set: {name: '', command: null}});
    },

    setCommand: function(_id, command) {

        if(!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }
        
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

        if(!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }
       
        var flag = Con.find({command: command}).count();

        if(flag >= 3 && command > 0) {
            throw new Meteor.Error(2, 'В команде может быть не больше трёх игроков');
            return;
        }

        var list = Con.find({name: {$exists: true}, command: { $eq: 0}, online: true }).fetch();

        if(!list || list.length == 0) {
            throw new Meteor.Error(3, 'В пуле нет участников онлайн');
            return;
        }

        var item = list[_.random(0, list.length-1)];

        Con.update({_id: item._id}, {$set: {command: command}});
    },

    setAdmin: function(password) {

        if(ConModel.isAdmin(this.connection.id)) {
            Env.update({name: 'password'}, { $set: {val: password} });
            return;
        }

        var realP = Env.findOne({name: 'password'});
        
        if(!realP && !realP.val) {
            throw new Meteor.Error(7, 'Ошибка авторизации');
            return;
        }
        
        if(realP.val != password) {
            throw new Meteor.Error(8, 'Ошибка авторизации');
            return;
        }
        
        Con.update({con_id: this.connection.id}, { $set: {type: 'Admin'}});
    },
    
    isAdmin: function(_id) {
        var flag = Con.findOne({con_id: _id});

        return flag && flag.type == 'Admin';
    }
};

/**
 * Методы Users
 */
Meteor.methods({
    'con.setPersonalId': ConModel.setPersonalId,
    'con.setName': ConModel.setName,
    'con.unsetName': ConModel.unsetName,
    'con.setCommand': ConModel.setCommand,
    'con.getRandomTo': ConModel.getRandomTo,
    'con.setAdmin': ConModel.setAdmin
});

Meteor.onConnection(function(connection) {
    return connection.onClose(function() {
        ConModel.setOffline(connection.id)
    });
});