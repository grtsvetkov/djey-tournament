Schema.con = new SimpleSchema({
    con_id: {
        type: String,
        label: 'Connection ID'
    },

    vg_id: {
        type: String,
        label: 'VainGlory ID',
        optional: true
    },

    vg_level: {
        type: String,
        label: 'VainGlory level',
        optional: true
    },
    
    name: {
        type: String,
        label: 'Имя',
        optional: true
    },
    type: {
        type: String,
        label: 'Тип соединения',
        optional: true
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
    },

    error: {
        type: String,
        label: 'Error',
        optional: true
    }
});

Con = new Mongo.Collection('con', Schema.con);
Con.attachSchema(Schema.con);