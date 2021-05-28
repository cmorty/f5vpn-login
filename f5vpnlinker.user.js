// ==UserScript==
// @name        F5 VPN Link creator
// @namespace   Violentmonkey Scripts
// @match       https://*/vdesk/webtop.eui?*
// @version     1.0
// @author      morty
// @description See https://github.com/cmorty/f5vpn-login
// ==/UserScript==


do {
  matches = document.cookie.match('(?<=MRHSession=)[a-z0-9]*(?=;)');
  if (matches === null) {
    console.warn('Unable to find session ID.');
    break;
  }

  sessionId = matches[0];
  console.log(`Found session ID "${sessionId}".`);

  var boxes = document.getElementsByClassName("favorite");
  var boxarr = Array.from(boxes);
  var vpnarr = boxarr.filter(b => b.innerText.includes("VPN"));
  if(vpnarr.length != 1) {
    console.warn(`No or too many elements found: ${vpnarr.length}`);
    break;
  }
  var vbox = vpnarr[0];
  var newbox = vbox.cloneNode(true);
  // I didn't get this to work with js so I just wrapped everything into an a-tag.
  var link = document.createElement("a");
  link.href="f5vpn://" + location.hostname + "/" + sessionId;
  link.appendChild(newbox);
  vbox.replaceWith(link);

} while(0);

