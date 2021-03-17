Router.configure({
    progress: true,
    loadingTemplate: 'loading',
    layoutTemplate: 'layout',
    fastRender: true
});

AccountsTemplates.configureRoute('ensureSignedIn', {
    template: 'login'
});

AccountsTemplates.configure({
    onSubmitHook: function (error, state) {
        if (!error) {
            if (state === "signIn") {
                // Successfully logged in
                // ...
            }
            if (state === "signUp") {
                // Successfully registered
                // ...
            }
        }
    },
    showAddRemoveServices: false,
    showForgotPasswordLink: true,
    lowercaseUsername: true,
    forbidClientAccountCreation: false,
    showForgotPasswordLink: false,
    hideSignUpLink: true,
    hideSignInLink: true,
});

//Meteor.users.deny({ update: () => true });

AccountsTemplates.addField({
    _id: 'username',
    type: 'text',
    required: true,
    func: function (value) {
        if (Meteor.isClient) {
            console.log("Validating username...");
            var self = this;
            Meteor.call("userExists", value, function (err, userExists) {
                if (!userExists)
                    self.setSuccess();
                else
                    self.setError(userExists);
                self.setValidating(false);
            });
            return;
        }
        // Server
        return Meteor.call("userExists", value);
    }
});

AccountsTemplates.addField({
    _id: 'name',
    type: 'text',
    displayName: "Full Name",
    func: function (value) {
        if (value.trim().indexOf(' ') == -1) {
            this.setSuccess();
        }
        this.setError("Please include your full name.");
        this.setValidating(false);
        return false;
    },
    errStr: 'Please include your full name.'
});

AccountsTemplates.addField({
    _id: 'domain',
    type: 'text',
    displayName: "Domain",
    func: function (value) {
        if (value.trim().indexOf(' ') == -1) {
            this.setSuccess();
        }
        this.setError("Please enter domain.");
        this.setValidating(false);
        return false;
    },
    errStr: 'Please enter domain.'
});

Router.plugin('ensureSignedIn', {
    except: ['login', 'setup', 'about']
});

Router.route('/', {
    name: 'home',
    title: function () {
        return 'Home'
    },
    waitOn: function () {
        return Meteor.subscribe('userInfo');
    },
    fastRender: true
});

Router.route('/logout', {
    name: 'logout',
    title: function () {
        return 'Logout'
    },
    waitOn: function () {
        return Meteor.subscribe('userInfo');
    },
    fastRender: true
});

Router.route('/about', {
    name: 'about',
    title: function () {
        return 'About'
    },
    fastRender: true
});

Router.route('/setup', {
    name: 'setup',
    title: function () {
        return 'Setup'
    },
    fastRender: true
});

Router.route('/login', {
    name: 'login',
    title: function () {
        return 'Login'
    },
    fastRender: true
});

Router.route('/admin', {
    name: 'admin',
    title: function () {
        return 'Панель администратора'
    },
    waitOn: function () {
        return [
            Meteor.subscribe('ServerSettings'),
            Meteor.subscribe('userInfo')
        ];
    },
    fastRender: true
});

Router.route('/register', {
    name: 'register',
    title: function () {
        return 'Регистрация'
    },
    waitOn: function () {
        return [
            Meteor.subscribe('ServerSettings'),
            Meteor.subscribe('userInfo')
        ];
    },
    fastRender: true
});

Router.route('/events/calls', {
    name: 'calls',
    title: function () {
        return 'Calls'
    },
    waitOn: function () {
        return [
            Meteor.subscribe('AmiLog'),
            Meteor.subscribe('userInfo')
        ];
    },
    fastRender: true
});

Router.route('/events/amilog', {
    name: 'amilog',
    title: function () {
        return 'Asterisk Manager Interface Log'
    },
    waitOn: function () {
        return [
            Meteor.subscribe('AmiLog'),
            Meteor.subscribe('userInfo')
        ];
    },
    fastRender: true
});

Router.route('/conferences', {
    name: 'conferences',
    title: function () {
        return 'Conferences'
    },
    waitOn: function () {
        return [
            Meteor.subscribe('ActiveConferences'),
            Meteor.subscribe('ActiveConferencesCount'),
            Meteor.subscribe('CompleteConferences'),
            Meteor.subscribe('CompleteConferencesCount'),
            Meteor.subscribe('userInfo')
        ];
    },
    fastRender: true
});

Router.route('/directory', {
    name: 'directory',
    title: function () {
        return 'Directory'
    },
    waitOn: function () {
        return [
            Meteor.subscribe('Directory'),
            Meteor.subscribe('userInfo')
        ];
    },
    fastRender: true
});

Router.route('/conference/:_bridgeuniqueid', {
    name: 'ConferenceSingle',
    title: function () {
        var user = Meteor.user() 
        if (!user) {
            return 'Авторизуйтесь для доступа к этой странице'
        }
        if ((user.roles != null && 'admin' in user.roles) || user.username == 'admin') {
            //var conf = Conferences.findOne({ 'bridgeuniqueid': this.params._bridgeuniqueid, 'user_id': {$ne: null} });
            var conf = Conferences.findOne();
        } else {
            //var conf = Conferences.findOne({ 'bridgeuniqueid': this.params._bridgeuniqueid, 'user_id': user._id });
            var conf = Conferences.findOne();
        }
        if (conf) {
            return `Номер конференции ${conf.conference}`;
        } else {
            return 'Конференции с таким ID не существует';
        }
    },
    data: function () {
        var user = Meteor.user()
        if ((user.roles != null && 'admin' in user.roles) || user.username == 'admin') {
            var conf = Conferences.findOne({ 'bridgeuniqueid': this.params._bridgeuniqueid, 'user_id': {$ne: null} });
        } else {
            var conf = Conferences.findOne({ 'bridgeuniqueid': this.params._bridgeuniqueid, 'user_id': user._id });
        }
        return conf
    },
    waitOn: function () {
        return [
            Meteor.subscribe('ConferenceEvents', this.params._bridgeuniqueid),
            Meteor.subscribe('ConferenceSingle', this.params._bridgeuniqueid),
            Meteor.subscribe('ConferenceMembers', this.params._bridgeuniqueid),
            Meteor.subscribe('userInfo')
        ];
    },
    fastRender: true
});
Router.route('/events/queue', {
    name: 'queue',
    title: function () {
        return 'Queue'
    },
    waitOn: function () {
        return [
            Meteor.subscribe('Queue'),
            Meteor.subscribe('userInfo')
        ];
    },
    fastRender: true
});