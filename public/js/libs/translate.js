function googleTranslateElementInit() {
  	new google.translate.TranslateElement({pageLanguage: 'pt-br', layout: google.translate.TranslateElement.FloatPosition.TOP_LEFT}, 'google_translate_element');
};
function triggerHtmlEvent(element, eventName) {
  	var event;
	if (document.createEvent){
		event = document.createEvent('HTMLEvents');
		event.initEvent(eventName, true, true);
		element.dispatchEvent(event);
  	} else {
		event = document.createEventObject();
		event.eventType = eventName;
		element.fireEvent('on' + event.eventType, event);
  	}
};