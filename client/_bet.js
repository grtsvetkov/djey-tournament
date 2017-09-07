var betInterval = false, betTime;

Template._bet.helpers({
    'betList': function(betAction) {

        //0 - Победа\Синие
        //1 - Поражение\Красные

        var betType = this.envStatus == '-2' ? ['win', 'lose'] : ['blue', 'red'];
        
        return Bet.find({bet: betType[betAction]}).fetch();
    },

    'bet': function() {
        var status = Env.findOne({name: 'bet'});
        var time = Env.findOne({name: 'betTime'});

        if(status.val != 3) {

            time = !time ? 0 : parseInt(time.val);

            var min = Math.floor(time / 60);
            var sec = time - min * 60;

            if (sec < 10) {
                sec = '0' + sec;
            }

            time = min + ':' + sec;
        } else {
            time = (this.envStatus == '-2' ? 'Случайный победитель:<br>': '')+ time.val;
        }

        return {envStatus: this.envStatus, betStatus: status.val, time: time};
    },

    'stat': function(betAction) {
        //0 - Победа\Синие
        //1 - Поражение\Красные

        var betType = this.envStatus == '-2' ? ['win', 'lose'] : ['blue', 'red'];

        var count0 = Bet.find({bet: betType[0]}).count();
        var count1 = Bet.find({bet: betType[1]}).count();

        if(count0 == 0 && count1 == 0) {
            return '0%<span>0</span>';
        }

        var prc0 = (count0 * 100) / (count0 + count1);
        prc0 = prc0.toFixed(1);

        return betAction == 0 ? prc0 + '%<span>'+count0+'</span>' : (100 - prc0) + '%<span>'+count1+'</span>';

    }
});


Template._bet.events({
    'click #startBet': function(e) {

        betTime = 300;

        Meteor.call('bet.start', function (err) {
            if (err) {
                console.log(err);
                sAlert.error(err.reason);
            } else {
                betInterval = setInterval(function(){

                    betTime--;

                    Meteor.call('bet.setTime', betTime, function(err){
                        if (err) {
                            console.log(err);
                            sAlert.error(err.reason);
                        }
                    });

                    if(betTime < 1) {
                        clearInterval(betInterval);
                        Meteor.call('bet.endBet', function(err){
                            if (err) {
                                console.log(err);
                                sAlert.error(err.reason);
                            }
                        });
                    }
                }, 1000);
            }
        });
    },

    'click .bet': function(e) {
        var bet = e.currentTarget.dataset.bet;

        if(isAdmin()) {
            clearInterval(betInterval);
            Meteor.call('bet.setWinner', bet, function(err){
                if (err) {
                    console.log(err);
                    sAlert.error(err.reason);
                }
            });
        } else {

            var player = Con.findOne({_id: localStorage.getItem('myPersonalId')});

            if (!player || !player.name) {
                sAlert.error('Нажмите кнопку "Принять участие", что бы делать ставки');
                return;
            }

            Meteor.call('bet.setBet', bet, function(err){
                if (err) {
                    console.log(err);
                    sAlert.error(err.reason);
                }
            });
        }
    },

    'click #stopBet': function(e) {
        Meteor.call('bet.stop', function (err) {
            if (err) {
                console.log(err);
                sAlert.error(err.reason);
            } else {
                clearInterval(betInterval);
            }
        });
    }
});
