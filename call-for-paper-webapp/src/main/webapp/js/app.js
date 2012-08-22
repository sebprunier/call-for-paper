(function($, ko) {

	// Class to represent a Cfp entry.
	function Cfp(sessionType, submitterEmail, sessionTitle, sessionSummary, speakers, speakersBios) {
		var self = this;
		self.sessionType = sessionType;
		self.submitterEmail = submitterEmail;
		self.sessionTitle = sessionTitle;
		self.sessionSummary = sessionSummary;
		self.speakers = speakers;
		self.speakersBios = speakersBios;
	}

	// ViewModel for Knockout
	function AppViewModel() {
		var self = this;
		// For Cfps list
		self.cfps = ko.observableArray([]);
		
		// For a new Cfp
		self.availableSessionTypes = ko.observableArray([ 'Conference', 'Tool In Action', 'Quickie' ]);
		self.sessionType = ko.observable('Quickie');
		self.submitterEmail = ko.observable('');
		self.sessionTitle = ko.observable('');
		self.sessionSummary = ko.observable('');
		self.speakers = ko.observable('');
		self.speakersBios = ko.observable('');
		
		// Submit a new Cfp
		self.postCfp = function() {
			var data = ko.toJSON({
				"cfp" : new Cfp(self.sessionType, self.submitterEmail, self.sessionTitle, self.sessionSummary,
						self.speakers, self.speakersBios)
			});
			$.ajax({
				url : "cfp",
				type : "POST",
				data : data,
				dataType : "json",
				contentType : "application/json; charset=utf-8",
				success : function() {
					// Re-load Cfps
					$.getJSON('/call-for-paper-webapp/cfp', function(data) {
						model.cfps(data.cfp);
					});
					// clear form
					self.sessionType('Quickie');
					self.submitterEmail('');
					self.sessionTitle('');
					self.sessionSummary('');
					self.speakers('');
					self.speakersBios('');
				}
			});
		};
	}
	// Apply bindings
	var model = new AppViewModel();
	ko.applyBindings(model);

	// When document is ready ...
	$(document).ready(function() {

		// init Twitter Bootstrap popover.
		$('#sessionTypeDetails').popover();

		// load existing Cfps
		$.getJSON('cfp', function(data) {
			model.cfps(data.cfp);
		});
	});

})(jQuery, ko);