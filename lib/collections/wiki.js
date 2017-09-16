Schema.wiki = new SimpleSchema({

    _id: {
        type: String,
        label: 'Герой'
    },

    name: {
        type: String,
        label: 'Имя героя по-русски'
    },

    stats: {
        type: String,
        label: 'Характеристики'
    },
    
    abilities: {
        type: String,
        label: 'Способности'
    }
});

Wiki = new Mongo.Collection('wiki', Schema.wiki);
Wiki.attachSchema(Schema.wiki);