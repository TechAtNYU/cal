var calendars = {};
define(['jquery', 'underscore', 'moment', 'clndr'], function($, _, moment, clndr) {
  /*var App = Backbone.View.extend({
    initialize: function() {
      console.log( 'Wahoo!' );
    }
  });*/
	$(document).ready(function() {
		var currentYear;
		var now = moment();
		var showingPast = false;
		var showingCurrent = true;
		function sortEvents(sortBy) {
			if (sortBy === 'past') {
				showingPast = true;
				showingCurrent = false;
				$( ".event-item.isPasttrue.currentMonthtrue" ).each(function() {
				  	 $(this).show();
				});
				$( ".event-item.isPastfalse.currentMonthtrue" ).each(function() {
				  	 $(this).hide();
				});
			}
			else {
				showingCurrent = true;
				showingPast = false;
				$( ".event-item.isPasttrue.currentMonthtrue" ).each(function() {
				  	 $(this).hide();
				});
				$( ".event-item.isPastfalse.currentMonthtrue" ).each(function() {
				  	 $(this).show();
				});
			}
		}
		/** get events from api **/
		function getData(getEventsThisYear) {
			var tNyuApi = "https://api.tnyu.org/v2/events/?page%5Blimit%5D=10&sort=%2bstartDateTime";
			$.getJSON(tNyuApi, {

			}).done(getEventsThisYear);
		}
		/*
		function toggleEventState() {
			var calendarDay = this.className.match(/calendar[-]day[-](20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])/);
			var date = calendarDay[0].substring(13);
			var events = calendars.clndr1.eventsThisInterval;
			for (var i = 0; i < events.length; i++) {
				if (date === events[i].startDate) {
					events[i].state = "active";
					calendars.clndr1.render();
				}
			}	
		}
		function makeInactive() {
			var events = calendars.clndr1.eventsThisInterval;
			for (var i = 0; i < events.length; i++) {
				events[i].state = "notactive";
				//calendars.clndr1.render();
			}
		}*/
		getData(function(json) {
    		currentYear  = json.data.filter(function(event) {
				var date = event.attributes.startDateTime;
				var isInternal = event.attributes.isInternal;
				var year = moment(date).year();
				return ((year === now.year()) && (!isInternal));
			 });
    		populateCalendar();
		});

		  // var eventArray = [
		  //   { startDate: thisMonth + '-10', endDate: thisMonth + '-14', title: 'Multi-Day Event' },
		  //   { startDate: thisMonth + '-21', endDate: thisMonth + '-23', title: 'Another Multi-Day Event' },
		  //   { date: thisMonth + '-01', title: 'Single Day Event' }
		  // ];
		 function isInPast(eventDate) {
			if (eventDate.isAfter(now)) {
			    return false;
			}
			else 
		    	return true;
		 }
		 function isInCurrentMonth(eventDate) {
		 	if (eventDate.get('month') === now.get('month')) {
		 		return true;
		 	}
		 	else
		 		return false;
		 	}
	 	function urlify(text) {
		    var urlRegex = /(https?:\/\/[^\s]+)/g;
		    return text.replace(urlRegex, function(url) {
		        return url.link(url);
		    });
		}

		 function SimpleEvent(start, end, title, description, rsvpUrl) {
		 	var start = moment(start);
		  	this.startDate = start.format('YYYY-MM-DD');
		  	this.isPast = isInPast(start);
		  	this.isInCurrentMonth = isInCurrentMonth(start);
		  	this.endDate = moment(end).format('YYYY-MM-DD');
		  	this.description = description;
		  	this.title = title;
		  	rsvpUrl ? this.rsvpUrl = rsvpUrl : this.rsvpUrl = "http://rsvp.techatnyu.org/";
		  }

		 function populateCalendar() {
		 	var nutso = currentYear;
		 	var eventArray = [];

		 	for (var i = 0; i < nutso.length; i++) {
		  		var currentAttr = nutso[i].attributes;
		  		var description = currentAttr.description;
		  		if (description) {
		  			description = urlify(currentAttr.description);
		  		}	
		  		//console.log(currentAttr.rsvpUrl);
		  		//console.log(moment(currentAttr.startDateTime).format('YYYY-MM-DD'));
		  		eventArray.push(new SimpleEvent(currentAttr.startDateTime, currentAttr.endDateTime, currentAttr.title, description, currentAttr.rsvpUrl))
		 	 }

		 	 calendars.clndr1 = $('.cal1').clndr({
				template: $('#test').html(),
			    events: eventArray,
			    // constraints: {
			    //   startDate: '2013-11-01',
			    //   endDate: '2013-11-15'
			    // },
			    clickEvents: {
			      click: function(target) {
			      	for (var i = 0; i < target.events.length; i++) {
			      		if (target.events[i].state === "active") {
			      			target.events[i].state = "inactive"
			      		}
						else target.events[i].state = "active";
					}
			        calendars.clndr1.render();
			        // if you turn the `constraints` option on, try this out:
			        // if($(target.element).hasClass('inactive')) {
			        //   console.log('not a valid datepicker date.');
			        // } else {
			        //   console.log('VALID datepicker date.');
			        // }
			      },
			      nextMonth: function() {
			        console.log('next month.');
			      },
			      previousMonth: function() {
			        console.log('previous month.');
			      },
			      onMonthChange: function() {
			        console.log('month changed.');
			      },
			      nextYear: function() {
			        console.log('next year.');
			      },
			      previousYear: function() {
			        console.log('previous year.');
			      },
			      onYearChange: function() {
			        console.log('year changed.');
			      }
			    },
			    multiDayEvents: {
			      startDate: 'startDate',
			      endDate: 'endDate',
			      singleDay: 'date'
			    },
			    showAdjacentMonths: true,
			    adjacentDaysChangeMonth: false,
			    doneRendering: function() {
    				$(".sortByUpcoming" ).click(function() {
    					if (!showingCurrent)
					  	sortEvents("upcoming");
					});

					$( ".sortByPast" ).click(function() {
						if (!showingPast)
					  	sortEvents("past");
					});
					/*$('.day.event').hover(function() {
						makeInactive();
						toggleEventState.call(this);
					});*/
				
  				}
			});	
		}
	});

});

