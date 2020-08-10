// Starts the weather app on page load
//
// This is pulled out into another file because weather.js
// can be included from the unit testing page.
window.addEventListener("DOMContentLoaded", () => startApp()
	.catch(err => console.error("Failed to start app: " + err)));
