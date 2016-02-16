require.config({
  paths: {
    'jquery': 'vendor/jquery/dist/jquery',
    'underscore': 'vendor/underscore-amd/underscore',
    'moment': 'vendor/moment/moment',
    'clndr': 'vendor/clndr/clndr.min',
  }
});

require(['views/app'], function(Calendar) {
  Calendar;
});