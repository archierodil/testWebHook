/*
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* jshint node: true, devel: true */
'use strict';

var https2 = require('follow-redirects').https;
         	
const
  bodyParser = require('body-parser'),
  crypto = require('crypto'),
  express = require('express');
//fb = require('work-chat.js');
// Using dotenv to allow local running with environment variables
require('dotenv').load();

var app = express();
app.set('port', process.env.PORT || 5000);
app.use(bodyParser.json({ verify: verifyRequestSignature }));


/*
 * Be sure to setup your config values before running this code. You can
 * set them using environment variables.
 *
 * APP_SECRET can be retrieved from the App Dashboard
 * VERIFY_TOKEN can be any arbitrary value used to validate a webhook
 * ACCESS_TOKEN is generated by creating a new Custom Integration
 *
 */
//
const
  APP_SECRET = process.env.APP_SECRET,
  VERIFY_TOKEN = process.env.VERIFY_TOKEN,
  ACCESS_TOKEN = process.env.ACCESS_TOKEN;



if (!(APP_SECRET && VERIFY_TOKEN && ACCESS_TOKEN)) {
  console.error('Missing config values');
  process.exit(1);
}

/*
 * Check that the verify token used in the Webhook setup is the same token
 * used here.
 *
 */
app.get('/', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === VERIFY_TOKEN) {
    console.log('Validating webhook');
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error('Failed validation. Make sure the validation tokens match.');
    res.sendStatus(403);
  }
});


/*
 * All callbacks for webhooks are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks.
 *
 * On Workplace, webhooks can be sent for 'page', 'group' and
 * 'workplace_security' objects:
 *
 * 'Page' webhooks relate to page messages or mentions, where the page ID is
 * the ID of the bot the user is interacting with.
 *
 * 'Group' webhooks relate to updates in a specific Workplace group, including
 * posts, comments and group membership changes.
 *
 * 'Workplace Security' webhooks relate to security-specific events in
 * Workplace, including login, logout, password changes etc.
 *
 * https://developers.facebook.com/docs/workplace/integrations/custom-integrations/webhooks
 *
 */
app.post('/', function (req, res) {
	
  try{
    var data = req.body;
    // On Workplace, webhooks can be sent for page, group, user and
		// workplace_security objects
    switch (data.object) {
    case 'page':
      processPageEvents(data);
      break;
    case 'group':
      processGroupEvents(data);
      break;
    case 'user':
      processUserEvents(data);
      break;
    case 'workplace_security':
      processWorkplaceSecurityEvents(data);
      break;
    default:
      console.log('Unhandled Webhook Object', data.object);
    }
  } catch (e) {
    // Write out any exceptions for now
    console.error(e);
  } finally {
    // Always respond with a 200 OK for handled webhooks, to avoid retries
		// from Facebook
    res.sendStatus(200);
  }
});

function processPageEvents(data) {
  data.entry.forEach(function(entry){
    let page_id = entry.id;
		// Chat messages sent to the page
    if(entry.messaging) {
      entry.messaging.forEach(function(messaging_event){
        console.log('Process Page Events Messaging AER 1601',page_id,messaging_event);
      });
    }
		// Page related changes, or mentions of the page
    if(entry.changes) {
      entry.changes.forEach(function(change){
        console.log('Process Page Events Changes AER 1601',page_id,change);
      });
    }
  });
}

function processGroupEvents(data) {
  data.entry.forEach(function(entry){
    let group_id = entry.id;
    entry.changes.forEach(function(change){
      console.log('Process Group Events AER 1601',group_id,change);
    });
  });
}

function graphcall1(https,event_id,event_name,start_datetime,end_datetime,event_location,event_description){
	 //start of 1st graph call	
//the code below gets the event name	   
https.get('https://graph.facebook.com/' + event_id + '?fields=name,start_time,end_time,place,description&access_token=DQVJ2WGg4NGlrLXFVR2pWdkp1MWhPYUxoNllaZAXVtSEJqZAFg1ZAURDd1hQNFNneVRTTjA4Ry1EbXI2VXA4OVQ5aUlXbGFYOU9HOXR1djlKUG5FR2pyRzlQc1VwNDU5S1J6Yjdzb1lSU0o1ZA25NOFJUVm1leGVMR0lQVWFJT0tFako3d0ZAHY1hQR2ZAmUkFOTkExbHZAGd210bjNsdW84NjZAVeXBmUW9wbmlxaUx0YVBSMXlua25YaW9RTW52bmVrMlU0eWRhZAGdnc3lieWVyQUVFMQZDZD', (resp) => {
  let dataevent = '';
  resp.on('data',(chunk) => {
	  dataevent += chunk;  
  });
	
 // The whole response has been received. Print out the result.
  resp.on('end', () => {
	  //console.log("this is the end");
         
	//  console.log('after the parse');
	  console.log('dataevent = ' + JSON.stringify(dataevent));
	  event_name = JSON.parse(dataevent).name;
	  console.log('event_name =' + JSON.parse(dataevent).name);
	  start_datetime = JSON.parse(dataevent).start_time;
          end_datetime = JSON.parse(dataevent).end_time;
	  event_location = JSON.parse(dataevent).place.name;
	  console.log('event location = ' + event_location);
	  event_description = JSON.parse(dataevent).description;	
	   console.log('event description = ' + event_description);
	  
 
;

});

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
	return 'ok';
//end of 1st graph call
}
function graphcall2(https,user_id,attendee_name,attendee_email){
//start of 2nd graph call
  //the code below gets the user's name		  
	  
https.get('https://graph.facebook.com/' + user_id + '?fields=id,name,email&access_token=DQVJ2WGg4NGlrLXFVR2pWdkp1MWhPYUxoNllaZAXVtSEJqZAFg1ZAURDd1hQNFNneVRTTjA4Ry1EbXI2VXA4OVQ5aUlXbGFYOU9HOXR1djlKUG5FR2pyRzlQc1VwNDU5S1J6Yjdzb1lSU0o1ZA25NOFJUVm1leGVMR0lQVWFJT0tFako3d0ZAHY1hQR2ZAmUkFOTkExbHZAGd210bjNsdW84NjZAVeXBmUW9wbmlxaUx0YVBSMXlua25YaW9RTW52bmVrMlU0eWRhZAGdnc3lieWVyQUVFMQZDZD', (resp) => {
  let datausername = '';
  resp.on('data',(chunk) => {
	  datausername += chunk;  
  });
	
 // The whole response has been received. Print out the result.
  resp.on('end', () => {
	  //console.log("this is the end");

	  //console.log('after the parse');
	  console.log('datausername = ' + JSON.stringify(datausername));
	  attendee_name = JSON.parse(datausername).name;
	  attendee_email = JSON.parse(datausername).email;
	  attendee_email = attendee_email.replace("\u0040", "@");
	  console.log('attendee_name =' + attendee_name);
	  console.log('attendee_email =' + attendee_email);

;

});

}).on("error", (err) => {
  console.log("Error: " + err.message);
});	
return 'ok';	
//end of 2nd graph call	
}
function appscriptcall(https,event_id,event_name,start_datetime,end_datetime,event_location,event_description,user_id,user_verb,attendee_name,attendee_email){
//start of appscript call	  
	 https.get('https://script.google.com/macros/s/AKfycbx5m7fyjxlQfjoJXGPTT649xugH5iWpfShSuubluVBnjUkArSM/exec?wpEventName=' + event_name  + '&wpID=' + event_id + '&wpName=' + attendee_name + '&wpVerb=' + user_verb + '&wpEmail=' + attendee_email + '&wpStart=' + start_datetime + '&wpEnd=' + end_datetime + '&wpLocation=' + event_location + '&wpDescription=' + event_description , (resp) => {
  let datashrek = '';

  // A chunk of data has been recieved.
  resp.on('datashrek', (chunk) => {
    datashrek += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    console.log(JSON.parse(datashrek).explanation);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
})
//end of appscript call
	return 'ok';
}

function processUserEvents(data) {
	//fb.sendSenderAction('mnraev1@test.sph.com.sg', fb.createSenderActionMarkSeen());
	//fb.sendTextMessage('mnraev1@test.sph.com.sg', "=)");
let event_name = '';	   
   let attendee_name = '';
    let attendee_email = '';
    let start_datetime = '';
    let end_datetime = '';	
    let event_location = '';
    let event_description = '';	
    let event_id = '';	
    let user_id = '';
    let user_verb = '';
    let retvalue = '';	
  data.entry.forEach(function(entry){
    user_id = entry.id;
	  
  
    entry.changes.forEach(function(change){
	   
	console.log('Process User Events AER 1601-2',JSON.stringify(entry));    
	      
      console.log('User Change AER 11012019-2',user_id,change);
      console.log('group_id=' + user_id);	    
      console.log('AER','This is my change = ' + JSON.stringify(change));	
	
	    const https = require('https');
console.log('field = ' + change.field);
	    
console.log('event id = ' + change.value.event_id);
	   event_id = change.value.event_id
console.log('verb = ' + change.value.verb);
	    user_verb = change.value.verb;
console.log('test 1401 outside events');		    
if(change.field == 'events'){
console.log('test 1401 inside events');	
//console.log('passed thru function callgraph1');	
//	graphcall1(https,event_id,event_name,start_datetime,end_datetime,event_location,event_description);
//console.log('passed thru function callgraph2');	
//	graphcall2(https,user_id,attendee_name,attendee_email);
//	console.log('passed thru function appscriptcall');	
//appscriptcall(https,event_id,event_name,start_datetime,end_datetime,event_location,event_description,user_id,user_verb,attendee_name,attendee_email);
//console.log('eventname = ' + event_name);
//console.log('attendeename = ' + attendee_name);	
return function graphcall1(https,event_id,event_name,start_datetime,end_datetime,event_location,event_description)
	.then((retvalue) =>{
	 return function graphcall2(https,user_id,attendee_name,attendee_email)
	.then((retvalue) => {
		 return function appscriptcall(https,event_id,event_name,start_datetime,end_datetime,event_location,event_description,user_id,user_verb,attendee_name,attendee_email);
	 })

})



	
}
else{
console.log('1401-1-before returned value' );  

  https2.get('https://script.google.com/macros/s/AKfycbzcDZGjQHpp8VNA3vyFKGAunBvtM3eu5M8D7oEQIVMnYsR7JFAw/exec',(resp) => {
  let datashrek1101 = '';

  console.log('resp = ' + resp.responseUrl);		
		  
  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    datashrek1101 += chunk;
	console.log('a chunk has been received');
  });
	  // The whole response has been received. Print out the result.
  resp.on('end', () => {
	  console.log('on end = ');
	  
    console.log(datashrek1101);
     
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
console.log('returned value =0 ' );   
	

	
	https.get('https://script.google.com/macros/s/AKfycbx5m7fyjxlQfjoJXGPTT649xugH5iWpfShSuubluVBnjUkArSM/exec?wpEvent=' + change.value + '&wpID=' + change.id + '&wpName=noname' + '&wpVerb=noaction', (resp) => {
  let datashrek = '';

  // A chunk of data has been recieved.
  resp.on('datashrek', (chunk) => {
    datashrek += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    console.log(JSON.parse(datashrek).explanation);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});

}
	
    
	    
	    
	   
	    
		    
		    
    		    
   		    
	    
	    
	    
	    
	    
	    
    });
  });
}

function processWorkplaceSecurityEvents(data) {
  data.entry.forEach(function(entry){
    let group_id = entry.id;
    entry.changes.forEach(function(change){
      console.log('Workplace Security Change AER 1601',group_id,change);
    });
  });
}

/*
 * Verify that the callback came from Facebook. Using the App Secret we
 * can verify the signature that is sent with each callback in the
 * x-hub-signature field, located in the header.
 *
 * More info: https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers['x-hub-signature'];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error('Couldn\'t validate the signature.');
  } else {
    var elements = signature.split('=');
    var signatureHash = elements[1];

    var expectedHash = crypto.createHmac('sha1', APP_SECRET).update(buf).digest('hex');

    if (signatureHash != expectedHash) {
      throw new Error('Couldn\'t validate the request signature.');
    }
  }
}

// Start server
// Webhooks must be available via SSL with a certificate signed by a valid
// certificate authority.
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
