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
            return [ Meteor.subscribe('con') ];
        }
    });
}