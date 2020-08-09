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

function getLoadingText() {
	const prefills = ["Loading", "Seeding clouds", "My forecast? Sunny... -side up."];

	return prefills[Math.floor(prefills.length * Math.random())];
}

function normalize(str) {
	return str.toLowerCase().replace(" ", "_");
}

class City {
	constructor(name) {
		this.name = name;
	}

	// I can also use a weak reference but yeah I'd rather not
	async renderInto(template, state) {
		if (this.weather === undefined) {
			updatePage(template, state, {
				city: this.name,
				weatherFaClass: "spinner",
				weatherDescription: getLoadingText()
			});

			this.weather = await fetch("/api/city/" + normalize(this.name))
				.then(d => d.json())
				.catch(err => console.error("Error while fetching weather for " + this.name + ": " + err));
		}

		updatePage(template, state, this.weather);
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

	let state = new CircularBufferIterator(cities.map(name => new City(name)));

	await state.currentItem().renderInto(template, state);
}

function registerCarouselControl(id, template, state, manipulator) {
	let button = document.getElementById(id);

	button.addEventListener("click", async function () {
		manipulator(state);

		await state.currentItem().renderInto(template, state);
	});
}

function updatePage(template, state, ctx) {
	// XSS protection is assured by handlebars
	document.getElementById("app").innerHTML = template(ctx);

	registerCarouselControl("prev-city", template, state, state => state.lastItem());
	registerCarouselControl("next-city", template, state, state => state.nextItem());
}
