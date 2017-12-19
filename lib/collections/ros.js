Schema.ros = new SimpleSchema({

    name: {
        type: String,
        label: 'Игровой ник'
    },

    status: {
        type: String,
        label: 'Статус'
    }
});

Ros = new Mongo.Collection('ros', Schema.ros);
Ros.attachSchema(Schema.ros);