// A thing that could've been implemented by encapsulating the button inside
// an <a> tag but I digress
// Redirects to the cities viewer, which resides on a separate page.
window.addEventListener("DOMContentLoaded", () => {
	let startButton = document.getElementById("start-app");

	if (startButton != null) {
		startButton.addEventListener("click", () => {
			window.location = "./cities.html";
		});
	}
});
