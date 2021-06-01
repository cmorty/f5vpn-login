// ==UserScript==
// @name        F5 VPN Link creator
// @namespace   Violentmonkey Scripts
// @match       https://*/vdesk/webtop.eui?*
// @version     1.0
// @author      morty
// @description See https://github.com/cmorty/f5vpn-login
// @run-at document-idle
// ==/UserScript==


console.warn("This script is running with document.readyState: " + document.readyState);

function makef5Link () {
  
  var boxes = document.getElementsByClassName("favorite");
  var boxarr = Array.from(boxes);
  var vpnarr = boxarr.filter(b => b.innerText.includes("VPN"));
  if(vpnarr.length != 1) {
    console.warn(`No or too many elements found (${vpnarr.length}).`);
    // Try again later
    if(vpnarr.length == 0) {
      setTimeout(function() { makef5Link(sessionId); }, 1000);
    }
    return;
  }
  
  var vbox = vpnarr[0];
  var newbox = vbox.cloneNode(true);
  // I didn't get this to work with js so I just wrapped everything into an a-tag.
  var link = document.createElement("a");
  link.href="f5vpn://" + location.hostname + "/" + sessionId;
  link.appendChild(newbox);
  vbox.replaceWith(link);

} 

var matches = document.cookie.match('(?<=MRHSession=)[a-z0-9]*(?=;)');

if (matches === null) {
  console.warn('Unable to find session ID.');
} else {
  var sessionId = matches[0];
  console.log(`Found session ID "${sessionId}".`);
  //Wait for website to load
  setTimeout(function() { makef5Link(sessionId); }, 1000);
}

