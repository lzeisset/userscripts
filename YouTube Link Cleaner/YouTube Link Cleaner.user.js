// ==UserScript==
// @name           YouTube Link Cleaner
// @name:de        YouTube Link Cleaner
// @namespace      tfr
// @description    Removes unneeded parameters and redirection pages from YouTube links.
// @description:de Entfernt unnötige Parameter und Weiterleitungsseiten aus YouTube-Links.
// @author         tfr (https://github.com/t-fr/)
// @license        CC0; https://creativecommons.org/publicdomain/zero/1.0/
// @license        MIT license; https://pastebin.com/raw.php?i=4TMeeUXC
// @compatible     firefox Works with Firefox and Greasemonkey
// @compatible     chrome Works with Chrome and Tampermonkey
// @compatible     opera Works with Opera and Tampermonkey Beta or Violent monkey
// @oujs:author    tfr
// @include        http://youtube.com/*
// @include        http://www.youtube.com/*
// @include        https://youtube.com/*
// @include        https://www.youtube.com/*
// @version        8
// @grant          none
// ==/UserScript==

/* This script is dual-licensed under CC0 and the MIT license.
 * You can choose which one you want to use.
 * CC0 license: http://creativecommons.org/publicdomain/zero/1.0/deed.en
 * MIT license: https://pastebin.com/raw.php?i=4TMeeUXC
 *
 * Dieses Skript steht sowohl unter CC0 als auch unter der MIT-Lizenz.
 * Sie können sich aussuchen, welche Lizenz Sie nutzen.
 * CC0-Lizenz: http://creativecommons.org/publicdomain/zero/1.0/deed.de
 * MIT-Lizenz: https://pastebin.com/raw.php?i=4TMeeUXC
 */
 
/* Version 8: Accidentally removed the disabling of redirect pages, restore it
 * Version 7: Found another way to disable SPF
 * Version 6: Update license data
 * Version 5: update metadata, German description
 * Version 4: change URL parameters without reloading
 */
 
/* If on a redirect page, redirect */
if(window.location.pathname == "/redirect") {
  window.location.href.match(/(&|\?)q=(.*?)(&|$)/);
  window.location.replace(window.decodeURIComponent(RegExp.$2));
}
/* If a unneeded parameter exists, remove it */
var replaceurl = '';

if(window.location.href.match(/(&(feature|src_vid|annotation_id|gl|hl)=[a-zA-Z0-9_\-\.]*|\?(feature|src_vid|annotation_id|gl|hl)=[a-zA-Z0-9_\-\.]*$)/)) {
  replaceurl = window.location.href.replace(/(&(feature|src_vid|annotation_id|gl|hl)=[a-zA-Z0-9_\-\.]*|\?(feature|src_vid|annotation_id|gl|hl)=[a-zA-Z0-9_\-\.]*$)/g, '');
}

if (replaceurl !== '') {
  window.history.replaceState({}, window.document.title, replaceurl);
}
var playlist = window.location.href.match(/(\/playlist(&|\?)list)=([a-zA-Z0-9_\-\.]*)/)[3];
var listregex = new RegExp("(&|\\?)(list="+playlist+")(&|$)","");

for (var i = 0; i < window.document.links.length; i++) {
  /* Remove unneeded parameters */
  window.document.links[i].href = window.document.links[i].href.replace(/(&(feature|src_vid|annotation_id|gl|hl)=[a-zA-Z0-9_\-\.]*|\?(feature|src_vid|annotation_id|gl|hl)=[a-zA-Z0-9_\-\.]*$)/g, '');

  /* Drop list parameter in playlists */
  // is link in current playlist?
  if(playlist !== '' && window.document.links[i].href.match(listregex)) {
    window.document.links[i].href = window.document.links[i].href.replace(/(&(list|index)=[a-zA-Z0-9_\-\.]*|\?(list|index)=[a-zA-Z0-9_\-\.]*$)/g, '');
  }

  /* Do not use redirect pages */
  window.document.links[i].className = window.document.links[i].className.replace(/(yt-uix-redirect-link)/g, "");
}
// Disable SPF, inspired by https://openuserjs.org/scripts/JoeSimmons/YouTube_-_Disable_Red_Bar_aka_SPF/source
if(window && window._spf_state && window._spf_state.config) {
  window._spf_state.config["navigate-limit"] = 0;
}
