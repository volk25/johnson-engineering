(function (global) {

// Set up a namespace for our utility
var ajaxUtils = {};

// Define a function which returns an HTTP request object
function getRequestObject() {
  if (window.XMLHttpRequest) {
    return (new XMLHttpRequest());
  } else if (window.ActiveXObject) {
    return (new ActiveXObject("Microsoft.XMLHTTP"));
  } else {
    global.alert("Ajax is not supported!");
    return(null); 
  }
};

// Only calls user provided 'responseHandler' function if response is ready and not an error
function handleResponse(request, responseHandler, isJsonResponse) {
  if ((request.readyState == 4) && (request.status == 200)) {
    if (isJsonResponse) {
      responseHandler(JSON.parse(request.responseText));
    } else {
      responseHandler(request.responseText);
    }
  }
};

// Define a function to make an Ajax GET request to 'requestUrl'
ajaxUtils.sendGetRequest = function(requestUrl, responseHandler, isJsonResponse) {
  var request = getRequestObject();
    request.onreadystatechange = function() {
      handleResponse(request, responseHandler, isJsonResponse); 
    }
    request.open("GET", requestUrl, true);
    request.send(null); // for POST only
};

// Expose utility to the global object
global.$ajaxUtils = ajaxUtils;


})(window);

