TourModel = {
    newTour: function() {
        Con.remove({online: false});
        Con.update({}, {$set : {command: 0}});
    }
};

Meteor.methods({
    'tour.newTour': TourModel.newTour
});
