Schema.djeycoin = new SimpleSchema({

    name: {
        type: String,
        label: 'Игровой ник'
    },

    coin: {
        type: Number,
        label: 'Djeycoin'
    }
});

Djeycoin = new Mongo.Collection('djeycoin', Schema.djeycoin);
Djeycoin.attachSchema(Schema.djeycoin);