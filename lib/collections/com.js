Schema.com = new SimpleSchema({
    num: {
        type: Number,
        label: 'Номер команды'
    },
    name: {
        type: String,
        label: 'Название'
    },
    list: {
        type: [String],
        label: 'Список участников в команде',
        optional: true
    }
});

Com = new Mongo.Collection('com', Schema.com);
Com.attachSchema(Schema.com);