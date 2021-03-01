
Template.header.events = {
    'click #logout': function (e) {
        e.preventDefault();
		console.log('logging out'); 
		Meteor.logout(function(){ 
            //Modal.show('loginModal');
            Router.go('home')
            return true
        });
        return true
    }
}

Template.header.helpers({
    active: function (page) {
        if (page && page == Router.current().route.getName()) {
            return 'active';
        }
        return '';
    }
});