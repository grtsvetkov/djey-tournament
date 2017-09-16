var heroes = {'reza': 'Риза', 'grace':'Грэйс', 'adagio': 'Адфжио', 'alpha': 'Альфа', 'ardan': 'Ардан', 'baptiste': 'Батист', 'baron': 'Барон', 'blackfeather': 'Ворон', 'catherine': 'Катрин', 'celeste': 'Селеста', 'flicker': 'Фликер',
    'fortress': 'Фортресс', 'glaive': 'Глейв', 'grumpjaw': 'Грамп', 'gwen': 'Гвен', 'idris': 'Идрис', 'joule': 'Джоуль', 'kestrel': 'Кэстрел', 'koshka': 'Кошка', 'krul': 'Крул', 'lance': 'Ланс', 'lyra': 'Лира',
    'ozo': 'Озо', 'petal': 'Петаль', 'phinn': 'Финн', 'ringo': 'Ринго', 'reim': 'Райм', 'rona': 'Рона', 'samuel': 'Сэмюэль', 'saw': 'П.И.Л.А.', 'skaarf': 'Скаарф', 'skye': 'Скай', 'taka': 'Така', 'vox': 'Вокс'
};

var selectedHero = new ReactiveVar('');

Template.guide.helpers({
    'heroes': function() {
        return _.map(heroes, function(i, key){
            return {_id: key, name: i};
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