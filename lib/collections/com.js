Schema.com = new SimpleSchema({
    num: {
        type: Number,
        label: 'Номер команды'
    },
    name: {
        type: String,
        label: 'Название'
    }
});

Com = new Mongo.Collection('com', Schema.com);
Com.attachSchema(Schema.com);