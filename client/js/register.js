import { Cookies } from 'meteor/ostrio:cookies';

const cookies = new Cookies();

const toastr = require('toastr');
Template.adminstart.helpers({
    ami: function () {
        return ServerSettings.find({
            'module': 'ami'
        }).fetch()[0];
    }
});

Template.registerstart.onRendered(function () {
    this.autorun(() => {
        console.log(cookies.keys())
        var result = cookies.get("result")
        console.log('result cookie')
        console.log(result)
        if (result != null) {
            console.log('result not null')
            cookies.remove("result")
            $('.register-result').text(result)
            $('.register-result').delay(5000).fadeOut(1500);
        }
        var error = cookies.get("error")
        console.log('error cookie')
        console.log(error)
        if (error != null) {
            console.log('error not null')
            cookies.remove("error")
            $('.register-error').text(error)
            $('.register-error').delay(5000).fadeOut(1500);
        }
      })
    });

Template.registerHelper('isUserInRole', function(userId, role) {
    console.log(Roles.userIsInRole(userId, role, 'domru.ru'))
    console.log(Roles.userIsInRole(userId, role))
    return Roles.userIsInRole(userId, role, 'domru.ru');
  });

  Template.registerstart.events = {
    'submit form': function (e) {
        console.log('register submit event')
        //e.preventDefault();
        // TODO: Move to server side method instead of updating directly from the client!
        // TODO: Server side method should also check validation (length, etc);
        // TODO: Restrict client updates

        const fullname = $(e.target).find('[name=fullname]').val().trim();
        const username = $(e.target).find('[name=username]').val().trim();
        const password = $(e.target).find('[name=password]').val().trim();
        const repeatpassword = $(e.target).find('[name=repeatpassword]').val().trim();
        const domain = $(e.target).find('[name=domain]').val().trim();
        const email = $(e.target).find('[name=email]').val().trim();

        if (password != repeatpassword){
            $(e.target).find('.register-error').text('Пароли различаются')
            $('.register-error').delay(5000).fadeOut(1500);
            return false
        }
        return true
        //Accounts.createUser({
        //    _id: Meteor.user()._id
        //}, {
        //    $set: {
        //        "profile.email": email,
        //        "profile.name": fullname,
        //        "profile.domain": domain,
        //        "username": username,
        //    }
        //});
    },
};
