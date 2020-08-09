window.addEventListener("DOMContentLoaded", () => {
	let startButton = document.getElementById("start-app");

	if (startButton != null) {
		startButton.addEventListener("click", () => {
			window.location = "./cities.html";
		});
	}
});
