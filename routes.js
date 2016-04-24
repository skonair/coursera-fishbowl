Router.configure({
  layoutTemplate: 'tmpl_layout'
});
Router.route('/', function() {
  this.render('tmpl_home');
});
Router.route('/about', function() {
  this.render('tmpl_about');
});
