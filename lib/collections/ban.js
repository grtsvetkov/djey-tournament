Schema.ban = new SimpleSchema({
    con_id: {
        type: String,
        label: 'Connection ID',
        optional: true
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

Ban = new Mongo.Collection('ban', Schema.ban);
Ban.attachSchema(Schema.ban);