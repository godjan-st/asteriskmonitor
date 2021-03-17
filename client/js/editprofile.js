Template.editprofile.events = {
    'submit form': function (e) {
        e.preventDefault();
        console.log('editprofile form submit')
        // TODO: Move to server side method instead of updating directly from the client!
        // TODO: Server side method should also check validation (length, etc);
        // TODO: Restrict client updates

        const fullname = $(e.target).find('[name=fullname]').val().trim();
        const username = $(e.target).find('[name=username]').val().trim();
        //const domain = $(e.target).find('[name=domain]').val().trim();

        Meteor.users.update({
            _id: Meteor.user()._id
        }, {
            $set: {
                "profile.name": fullname,
                "username": username,
            }
        });
    },
};