// Creates a non-consuming circular buffer's iterator over a generic array
// The array can grow in size after the iterator's instantiation, but shrinking
// it may cause out-of-bounds reads
class CircularBufferIterator {
	// Construct a circular buffer iterator over an existing array, starting at the first element.
	constructor(linearBuffer) {
		this.buffer = linearBuffer;
		this.cursor = 0;
	}

	// Gets the current item
	currentItem() {
		return this.buffer[this.cursor];
	}

	// Moves the cursor forwards and return the value it points to post-increment
	// Will loop around (as it's a circular buffer)
	nextItem() {
		// The last index is always length - 1
		if (this.cursor < this.buffer.length - 1) {
			this.cursor++;
		} else {
			this.cursor = 0;
		}

		return this.currentItem();
	}

	// Moves the cursor backwards and returns teh value it pots to post-decrement
	// Will loop around (as it's a circular buffer)
	lastItem() {
		if (this.cursor > 0) {
			this.cursor--;
		} else {
			this.cursor = this.buffer.length - 1;
		}

		return this.currentItem();
	}
}

// Aesthetics for returning a nice loading text
function getLoadingText() {
	const prefills = ["Loading", "Seeding clouds", "My forecast? Sunny... -side up."];

	return prefills[Math.floor(prefills.length * Math.random())];
}

// Normalizes a city's name into an api-friendly format
function normalize(str) {
	return str.toLowerCase().replace(" ", "_");
}

// Describes a city, lazy initialized.
class City {
	constructor(name) {
		this.name = name;
	}

	// Receives a template and the parent state to draw the app using handlebars.
	// This will output Stage 2 or Stage 3 depending on current state of the system.
	//
	// State could've been a weak reference that's contained within the City class but I decided that's more of a hassle
	// Than passing state around
	async renderInto(template, state) {
		if (this.weather === undefined) {
			updatePage(template, state, {
				city: this.name,
				weatherFaClass: "spinner",
				weatherDescription: getLoadingText()
			});

			document.getElementById("temperatures").style.visibility = 'hidden';

			try {
				this.weather = await fetch("/api/city/" + normalize(this.name))
					.then(d => d.json());
			} catch (err) {
				updatePage(template, state, {
					city: this.name,
					weatherFaClass: "exclamation-triangle",
					weatherDescription: "Failed to fetch weather data"
				});

				console.error("Error while fetching weather for " + this.name + ": " + err);
				return;
			}
		}

		updatePage(template, state, this.weather);
		document.getElementById("temperatures").style.visibility = 'visible';
	}
}

// Start the app asynchronously. This is activated when the page is loaded.
async function startApp() {
	// We're rendering using handlebars on the client side
	let src = document.getElementById("weather").innerHTML;
	let template = Handlebars.compile(src);

	// Handlebars formatting helper for displaying temperature.
	Handlebars.registerHelper('celsius', function (temp) {
		if (temp !== undefined) {
			// Unicode is degree sign because I can't use &deg;
			return Handlebars.escapeExpression(temp) + " \u00b0C";
		}
		return "";
	});

	// Fetch cities on start, we can use specific endpoints for per-city weather later
	let cities = await fetch("/api/cities")
		.then(r => r.json())
		.catch(err => console.error("Failed to fetch cities: " + err));

	// If fetching the list of cities from the API failed,
	// then the page will be sent into an unusable state
	if (cities.length === 0) {
		console.error("API endpoint returned no cities :(");

		updatePage(template, null, {
			city: "Error!",
			weatherFaClass: "exclamation-triangle",
			weatherDescription: "Failed to fetch the list of cities"
		});

		return;
	}

	let state = new CircularBufferIterator(cities.map(name => new City(name)));

	await state.currentItem().renderInto(template, state);
}

// Registers the carousel navigation buttons
function registerCarouselControl(id, template, state, manipulator) {
	let button = document.getElementById(id);

	button.addEventListener("click", async function () {
		manipulator(state);

		await state.currentItem().renderInto(template, state);
	});
}

// Applies the context to the template and re-register the navigation buttons' event handlers
function updatePage(template, state, ctx) {
	// XSS protection is assured by handlebars
	document.getElementById("app").innerHTML = template(ctx);

	registerCarouselControl("prev-city", template, state, state => state.lastItem());
	registerCarouselControl("next-city", template, state, state => state.nextItem());
}
