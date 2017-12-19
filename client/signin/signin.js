Template.signin.events({
    'click #authSend': function () {
        Meteor.call('con.setAdmin', $('#authPassword').val(), function (err) {
            if (err) {
                console.log(err);
                sAlert.error(err.reason);
            } else {
                Router.go('/');
            }
        })
    }
});