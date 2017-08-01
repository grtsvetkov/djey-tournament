isAdmin = function() {
    return Con.findOne({_id: localStorage.getItem('myPersonalId'), type: 'Admin'});
};

Template.registerHelper('is_admin', function () {
    return isAdmin();
});

Template.registerHelper('eq', function (op1, op2) {
    return op1 == op2;
});

Template.registerHelper('consoleLog', function (obj) {
    console.log(obj);
});