Schema.con = new SimpleSchema({
    con_id: {
        type: String,
        label: 'Connection ID'
    },
    name: {
        type: String,
        label: 'Имя',
        optional: true
    },
    type: {
        type: String,
        label: 'Тип соединения'
    },
    online: {
        type: Boolean,
        label: 'Соединение онлайн'
    },

    command: {
        type: Number,
        label: 'Номер команды',
        optional: true,
        defaultValue: 0
    }
});

Con = new Mongo.Collection('con', Schema.con);
Con.attachSchema(Schema.con);