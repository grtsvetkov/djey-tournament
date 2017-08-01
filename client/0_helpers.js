isAdmin = function() {
    return Con.findOne({_id: localStorage.getItem('myPersonalId'), type: 'Admin'});
};

comName = function(n) {
    return Com.findOne({num: parseInt(n)}).name;
};

Template.registerHelper('is_admin', function () {
    return isAdmin();
});

Template.registerHelper('com_name', function (n) {
    return comName(n);
});

Template.registerHelper('eq', function (op1, op2) {
    return op1 == op2;
});

Template.registerHelper('consoleLog', function (obj) {
    console.log(obj);
});