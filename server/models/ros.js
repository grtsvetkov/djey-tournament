RosModel = {
    register: function(name) {

        var flag = Ros.findOne({name : name});

        if(flag) {
            return 0;
        } else {
            Ros.insert({name: name, status: 'wait'});
            return 1;
        }

    },

    reset: function() {
        if (!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }

        Ros.remove({});
    },

    randomToPlay: function() {
        if (!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }

        var list = Ros.find({status: 'wait'}).fetch();

        if (!list || list.length == 0) {
            throw new Meteor.Error(3, 'В пуле нет участников онлайн');
            return;
        }

        list = _.shuffle(list);

        var item = list[_.random(0, list.length - 1)];
        
        Ros.update({_id: item._id}, { $set: {status: 'play'}});
        
        return item.name;
    },
    
    setToPlay: function(name) {
        if (!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }

        Ros.update({name: name}, { $set: {status: 'play'}});

        return name;
    },

    setToEnd: function(name) {
        if (!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }

        Ros.update({name: name}, { $set: {status: 'end'}});

        return name;
    },

    setToDelete: function(name) {
        if (!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }

        Ros.remove({name: name});

        return name;
    }
};

Meteor.methods({
    'ros.register': RosModel.register,
    'ros.reset': RosModel.reset,
    'ros.randomToPlay': RosModel.randomToPlay,
    
    'ros.setToPlay': RosModel.setToPlay,
    'ros.setToEnd': RosModel.setToEnd,
    'ros.setToDelete': RosModel.setToDelete
    
    
});

