Meteor.startup(function () {

    if (!localStorage.getItem('myPersonalId')) {
        localStorage.setItem('myPersonalId', Random.id());
    }

    Meteor.call('con.setPersonalId', localStorage.getItem('myPersonalId'), function(err, data){
        
    });


    /*sAlert.config({
        effect: 'stackslide',
        position: 'top-right',
        timeout: 5000,
        html: false,
        onRouteClose: true,
        stack: true,
        offset: 0, // in px - will be added to first alert (bottom or top - depends of the position in config)
        beep: false,
        onClose: _.noop //
    });*/
});

getDataFromTpl = function (struct) {

    let data = {};

    for (let key in struct) {

        let el = struct[key];

        if ((_.isUndefined(el.notRequired) || !el.notRequired) && !el.val) {
            sAlert.error('Заполните поле "' + el.field + '"');
            return false;
        }

        data[key] = el.val;
    }

    return data;
};