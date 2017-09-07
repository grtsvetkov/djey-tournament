Schema.bet = new SimpleSchema({

    name: {
        type: String,
        label: 'Игровой ник'
    },

    bet: {
        type: String,
        label: 'Ставка'
    },
    
    currentCoin: {
        type: Number,
        label: 'Текущее кол-во Djeycoin'
    }
});

Bet = new Mongo.Collection('bet', Schema.bet);
Bet.attachSchema(Schema.bet);