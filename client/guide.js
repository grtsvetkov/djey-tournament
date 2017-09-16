var heroes = ['reza', 'grace', 'adagio', 'alpha', 'ardan', 'baptiste', 'baron', 'blackfeather', 'catherine', 'celeste', 'flicker',
    'fortress', 'glaive', 'grumpjaw', 'gwen', 'idris', 'joule', 'kestrel', 'koshka', 'krul', 'lance', 'lyra',
    'ozo', 'petal', 'phinn', 'ringo', 'reim', 'rona', 'samuel', 'saw', 'skaarf', 'skye', 'taka', 'vox'
];

var selectedHero = new ReactiveVar('');

Template.guide.helpers({
    'heroes': function() {
        return _.map(heroes, function(i, key){
            return {name: i};
        })
    },
    
    'selectedHero': function() {
        var h = selectedHero.get();
        
        if(!h) {
            return;
        }
        
        return Wiki.findOne({_id: h});
    }
});

Template.guide.events({
    'click .hero .edit': function(e) {
        
        e.preventDefault();
        
        if(!isAdmin()) {
            return;
        }

        var h = e.currentTarget.dataset.h;

        var data = Wiki.findOne({_id: h});

        if(!data) {
            data = {
                name: '',
                stats: '',
                abilities: ''
            }
        }

        var diag = $(`
            <div id="myDialog" title="Редактировать `+h+`">
                <p>Имя: <input id="editName" type="text" value="`+data.name+`"></p>
                <p>Характеристики: <textarea id="editStats">`+data.stats+`</textarea></p>
                <p>Способности: <textarea id="editAbilities">`+data.abilities+`</textarea></p>
            </div>`);
        diag.dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                'Редактировать': function () {

                    Meteor.call('wiki.edit', h, {
                        name: $('#editName').val(),
                        stats: $('#editStats').val(),
                        abilities: $('#editAbilities').val()
                    }, function (err) {
                        if (err) {
                            console.log(err);
                            sAlert.error(err.reason);
                        }
                        diag.dialog('close');
                        diag.remove();
                    });
                },
                'Закрыть': function () {
                    diag.dialog('close');
                    diag.remove();
                }
            }
        });
        diag.dialog('open');
        
        return false;
    },
    
    'click #guide .hero': function(e) {
        selectedHero.set(e.currentTarget.dataset.h);
        $('#guideItemWrap').show();
    },
    
    'click #guideItem #closeItem': function() {
        $('#guideItemWrap').hide();
    }
});