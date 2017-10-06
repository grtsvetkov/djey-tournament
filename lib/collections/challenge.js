Schema.challenge = new SimpleSchema({
    name: {
        type: String,
        label: 'Игровой ник'
    }
});

Challenge = new Mongo.Collection('challenge', Schema.challenge);
Challenge.attachSchema(Schema.challenge);