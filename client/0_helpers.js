isAdmin = function() {
    return Con.findOne({_id: localStorage.getItem('myPersonalId'), type: 'Admin'});
};

comName = function(n) {

    var com = Com.findOne({num: parseInt(n)});

    return com && com.name ? com.name : '';
};

Template.registerHelper('is_admin', function () {
    return isAdmin();
});

Template.registerHelper('com_name', function (n) {
    return comName(n);
});

var levelColors = ['#ffd700', '#cd8032', '#9b9b9b']; //0 - золото, 1 - бронза, 2 - серебро

Template.registerHelper('levelM', function (level) {
    
    var s = level ? level.split('-'): ['0','0'];

    return '<span class="vg_level" style="color:'+levelColors[s[1]]+'">'+s[0]+'</span>';
});

Template.registerHelper('eq', function (op1, op2) {
    return op1 == op2;
});

Template.registerHelper('consoleLog', function (obj) {
    console.log(obj);
});