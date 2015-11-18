var clndr1;
define(['jquery', 'underscore', 'moment', 'clndr'], function($, _, moment, clndr) {
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
		getData(function(json) {
    		currentYear  = json.data.filter(function(event) {
				var date = event.attributes.startDateTime;
				var isInternal = event.attributes.isInternal;
				var year = moment(date).year();
				return ((year === now.year()) && (!isInternal));
			 });
    		populateCalendar();
    		setValues();
		});
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
		 	else {
		 		return false;
		 	}
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
		  		eventArray.push(new SimpleEvent(currentAttr.startDateTime, currentAttr.endDateTime, currentAttr.title, description, currentAttr.rsvpUrl))
		 	 }
		 	 
		 	  clndr1 = $('.cal1').clndr({
				template: $('#test').html(),
			    events: eventArray,
			    clickEvents: {
			      click: function(target) {

			      	for (var i = 0; i < target.events.length; i++) {
			      		if (target.events[i].state === "active") {
			      			target.events[i].state = "inactive"
			      		}
						else target.events[i].state = "active";
					}
			        clndr1.render();
			      },
			      nextMonth: function() {
			        console.log('next month.');
			      },
			      previousMonth: function() {
			        console.log('previous month.');
			      },
			      onMonthChange: function() {
			      	setValues();
			        console.log('month changed.');
			        setValues();
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
    					if (!showingCurrent) {
    						$(this).addClass('active');
    						$(".sortByPast").removeClass('active');
					  		sortEvents("upcoming");
					  	}
					});

					$( ".sortByPast" ).click(function() {
						if (!showingPast) {
							$(this).addClass('active');
							$(".sortByUpcoming").removeClass('active');
						  	sortEvents("past");
						}
					});
  				}
			});	
		}
		function setValues() {
			if (clndr1.month.get('month') !== now.get('month')) {
				if ($(".sort-options").css('display') != 'none') {
					$(".sort-options").hide();
				}
			}
		}
	});

});

