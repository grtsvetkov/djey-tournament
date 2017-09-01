Schema.bet = new SimpleSchema({

    name: {
        type: String,
        label: 'Игровой ник'
    },

    bet: {
        type: String,
        label: 'Ставка (победа \ проигрыш)'
    }
});

Bet = new Mongo.Collection('bet', Schema.bet);
Bet.attachSchema(Schema.bet);