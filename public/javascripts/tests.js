// "Unit testing framework"

// I have to manually define the test functions here instead of using macros and whatnot
const tests = [
	{
		name: "Should Error",
		test: shouldError
	}, {
		name: "CircBufIter Init",
		test: cbInit
	}, {
		name: "CircBufIter Moving Forwards",
		test: cbMoveForwards
	}, {
		name: "CircBufIter Moving Backwards",
		test: cbMoveBackwards
	}, {
		name: "CircBufIter Overflow",
		test: cbOverflow
	}, {
		name: "CircBufIter Underflow",
		test: cbUnderflow
	},
];

// The runner is pretty basic as well
window.addEventListener("load", () => {
	tests.forEach(test => {
		try {
			test.test();
			console.info(test.name + ": ok");
		} catch (e) {
			console.error(test.name + ": " + e);
		}
	})
})

// Self explanatory
function assertEq(expected, actual) {
	if (expected !== actual) {
		throw new Error("Expected Value: " + expected + "\nActual Value: " + actual);
	}
}

// Using the unit testing framework to test the unit testing framework
function shouldError() {
	assertEq("a", "b");
}

// The rest are tests, they're described in the list on top

function cbInit() {
	let cb = new CircularBufferIterator(["A", "B", "C"]);

	assertEq("A", cb.currentItem());
}

function cbMoveForwards() {
	let cb = new CircularBufferIterator(["A", "B", "C"]);

	assertEq("B", cb.nextItem());
}

function cbMoveBackwards() {
	let cb = new CircularBufferIterator(["A", "B", "C"]);

	cb.nextItem();
	cb.lastItem();

	assertEq("A", cb.currentItem());
}

function cbOverflow() {
	let cb = new CircularBufferIterator(["A", "B", "C"]);

	cb.nextItem();
	cb.nextItem();
	cb.nextItem();

	assertEq("A", cb.currentItem());
}

function cbUnderflow() {
	let cb = new CircularBufferIterator(["A", "B", "C"]);

	cb.lastItem();

	assertEq("C", cb.currentItem());
}
