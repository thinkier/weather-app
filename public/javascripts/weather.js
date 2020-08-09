window.addEventListener("DOMContentLoaded", () => {
	let startAppBtn = document.getElementById("start-app");

	if (startAppBtn !== null) {
		startAppBtn.addEventListener("click", () => startApp()
			.catch(err => console.error("Failed to start app: " + err))
		);
	}
});

class CircularBufferIterator {
	constructor(linearBuffer) {
		this.buffer = linearBuffer;
		this.cursor = 0;
	}

	currentItem() {
		return this.buffer[this.cursor];
	}

	nextItem() {
		if (this.cursor < this.buffer.length - 1) {
			this.cursor++;
		} else {
			this.cursor = 0;
		}

		return this.currentItem();
	}

	lastItem() {
		if (this.cursor > 0) {
			this.cursor--;
		} else {
			this.cursor = this.buffer.length - 1;
		}

		return this.currentItem();
	}
}

class City {
	constructor(name) {
		this.name = name;
	}

	renderInto(template) {
		if (this.weather === undefined) {
			updatePage(template, {
				city: name,
				weatherFaClass: "loading",
				weatherDescription: "spinner"
			});
			// todo promise
		} else {
			updatePage(template, this.weather);
		}
	}
}

async function startApp() {
	// We're rendering using handlebars on the client side
	let src = document.getElementById("weather").innerHTML;
	let template = Handlebars.compile(src);

	// Fetch cities on start, we can use specific endpoints for per-city weather later
	let cities = await fetch("/api/cities")
		.then(r => r.json());

	if (cities.length === 0) {
		console.error("API endpoint returned no cities :(");
		return;
	}

	let state = new CircularBufferIterator(cities.map(function (name) {
		return new City(name);
	}));

	updatePage(template, state.currentItem().renderInto(template));
}

function updatePage(template, ctx) {
	// XSS protection is assured by handlebars
	let html = template(ctx);

	document.getElementById("app").innerHTML = html;
}
