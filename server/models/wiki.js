WikiModel = {
    edit: function(_id, data) {
        if (!ConModel.isAdmin(this.connection.id)) {
            throw new Meteor.Error(9, 'Ошибка авторизации');
            return;
        }
        Wiki.upsert({ _id: _id }, { $set: data });
    }
};

Meteor.methods({
    'wiki.edit': WikiModel.edit
});

