Schema.env = new SimpleSchema({
    name: {
        type: String,
        label: 'Название'
    },
    val: {
        type: String,
        label: 'Значение',
        optional: true
    }
});

Env = new Mongo.Collection('env', Schema.env);
Env.attachSchema(Schema.env);