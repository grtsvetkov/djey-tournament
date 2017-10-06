if (Meteor.isClient) {

    ApplicationController = RouteController.extend({
    });

    Router.configure({
        layoutTemplate: 'AppLayout', //AppLayout.html
        notFoundTemplate: 'Error404', //Error404.html
        loadingTemplate: 'Loading', //Loading.html
        controller: ApplicationController
    });
    
    Router.route('/', {
        name: 'index',

        waitOn: function() {
            return [
                Meteor.subscribe('con'),
                Meteor.subscribe('tour'),
                Meteor.subscribe('env'),
                Meteor.subscribe('com'),
                Meteor.subscribe('ban'),
                Meteor.subscribe('bet'),
                Meteor.subscribe('djeycoin'),
                Meteor.subscribe('draft'),
                Meteor.subscribe('challenge')
            ];
        }
    });

    Router.route('/guide/', {
        name: 'guide',

        waitOn: function() {
            return [
                Meteor.subscribe('con'),
                Meteor.subscribe('wiki')
            ];
        }
    });
    
    Router.route('/signin', {
        name: 'signin'
    });
}