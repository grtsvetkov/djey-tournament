Schema.tour = new SimpleSchema({
    tour: {
        type: Number,
        label: 'Номер тура (этапа)'
    },
    match: {
        type: Number,
        label: 'Номер матча в туре (этапе)'
    },
    commands: {
        type: [Number],
        label: 'Команды в матче',
        optional : true
    },
    status: {
        type: Number,
        label: 'Статус матча'
    }
});

Tour = new Mongo.Collection('tour', Schema.tour);
Tour.attachSchema(Schema.tour);