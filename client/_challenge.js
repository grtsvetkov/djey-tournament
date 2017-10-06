Template._challenge.helpers({
    'list': function () {

        return Challenge.find({}).fetch();
    },

    'winner': function () {

        var name = Env.findOne({name: 'challenge'}).val;

        return name && name != '0' ? name : false;
    }
});

Template._challenge.events({

    'click .close': function (e) {

        if (isAdmin()) {
            if (e.currentTarget.dataset.mode == 'open') {
                $('#envChallengeWrap').attr('style', 'height: 30px;');
                e.currentTarget.dataset.mode = 'close';
            } else {
                $('#envChallengeWrap').attr('style', '');
                e.currentTarget.dataset.mode = 'open'
            }

        } else {
            $('#envChallenge').remove();
        }
    },


    'click #setWinner': function () {
        if (isAdmin()) {
            Meteor.call('challenge.setWinner', function(err){
                if (err) {
                    console.log(err);
                    sAlert.error(err.reason);
                }
            });
        }
    },

    'click #takePart': function (e) {

        var player = Con.findOne({_id: localStorage.getItem('myPersonalId')});

        if (!player || !player.name) {
            setPlayer('challengeTakePart');
            return;
        }

        Meteor.call('challenge.takePart', function (err) {
            if (err) {
                console.log(err);
                sAlert.error(err.reason);
            }
        });
    },

    'click #stop': function () {
        if (isAdmin()) {
            Meteor.call('challenge.stop', function(err){
                if (err) {
                    console.log(err);
                    sAlert.error(err.reason);
                }
            });
        }
    }
});
