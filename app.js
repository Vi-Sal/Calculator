$(document).ready(function () {
	//*# DECLARATIONS

	let prevValue = "";
	let result = "";
	const operators = ["+", "-", "×", "÷"];
	const calcKey = [
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		".",
		"=",
		"+",
		"-",
		"*",
		"/",
		"Enter",
		"Escape",
		"Control",
		"Backspace",
	];

	let haveDot = false;
	let dark = true;
	let tempDot = false;

	//*# -------------------------------------

	//*# FUNCTIONALITIES

	// Handle for calculation
	function calculate(curValue) {
		result = $(".display").val();
		const lastElement = result.slice(-1);

		// REPLACE ALL COMMAS ' , ' WITH ''
		result = result.replaceAll(",", "");

		let length = result.length;

		if ([...operators, "AC"].includes(curValue)) {
			tempDot = haveDot;
			haveDot = false;
		}

		if (prevValue === "=" && ![...operators, "N&P"].includes(curValue))
			result = "";

		if (result === "0" && !operators.includes(curValue)) result = "";

		// MAIN FILTER
		if (
			(curValue === "0" && result === "0") ||
			(curValue === "." && lastElement === ".") ||
			(curValue === "." && haveDot) ||
			(curValue === "=" && result === "") ||
			(curValue === "=" && operators.includes(lastElement)) ||
			(curValue === "N&P" && operators.includes(lastElement))
		)
			return;

		// PROCESSING
		switch (curValue) {
			case "=": {
				// REPLACE SYMBOLS WITH OPERATORS
				result = result.replaceAll("÷", "/").replaceAll("×", "*");
				try {
					result = eval(result);
					if (result === Infinity || result === -Infinity) {
						throw new Error("Can't Divide by 0");
					}
				} catch (error) {
					length = error.message.length;

					// HANDLE WITH TEXT LIMIT
					limitText(length);

					$(".display").val(error.message);

					return;
				}
				// IF RESULT CONTAINS DOT ( . ) THEN SET HAVDOT TO TRUE
				if (result.toString().includes(".")) haveDot = true;
				break;
			}
			case "AC": {
				result = "0";
				break;
			}
			case "DEL": {
				// IF WE DELETED OPERATOR THAN SET haveDot to True
				if (operators.includes(lastElement) && tempDot) haveDot = true;

				// IF WE DELETED A DOT ( . ) THEN SET haveDot TO FALSE
				if (lastElement === ".") haveDot = false;

				result = result.slice(0, -1);

				if (result === "") result = "0";
				break;
			}
			case "N&P": {
				if (result === "") {
					result = "-0";
				} else if (result[0] === "-") {
					result = result
						.replace("-", "")
						.replace("(", "")
						.replace(")", "");
				} else {
					result = `-(${result})`;
				}

				break;
			}
			default: {
				if (curValue === ".") haveDot = true;

				if (
					(curValue === "." && result === "") ||
					(curValue === "." && operators.includes(lastElement))
				)
					curValue = "0.";

				if (
					[...operators, "."].includes(lastElement) &&
					operators.includes(curValue)
				) {
					tempDot = haveDot;
					result = result.toString().slice(0, -1);
				}

				// SLICE WHEN 0 FRONT OF OPERATORS
				if (
					operators.includes(result.slice(result.length - 2)[0]) &&
					result.slice(result.length - 2)[1] === "0" &&
					!operators.includes(curValue) &&
					curValue !== "."
				)
					result = result.toString().slice(0, -1);

				// ACCUMULATED RESULT WAIT FOR CALCULATE
				result += curValue;

				break;
			}
		}

		// CHECK FOR LIMIT TEXT
		length = result.toString().length;
		limitText(length);

		// FORMAT OUR RESULT WITH COMMAS
		result = result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		$(".display").val(result);

		prevValue = curValue;
	}

	// FUNCTION THAT HANDLE WITH KEYPRESS
	function handleKeyPress(e) {
		// PREVENT ENTER KEY
		e.preventDefault();
		let key = e.key;
		if (calcKey.includes(key)) {
			switch (key) {
				case "*":
					key = "×";
					break;
				case "/":
					key = "÷";
					break;
				case "Backspace":
					key = "DEL";
					break;
				case "Enter":
					key = "=";
					break;
				case "Escape":
					key = "AC";
				case "Control":
					key = "N&P";
				default:
					break;
			}
			calculate(key);
		}
	}

	// FUNCTION HANDLE FOR CHECK LIMIT TEXT
	function limitText(length) {
		if (length < 14) $(".display").css({ "font-size": "3rem" });
		else if (length < 16) $(".display").css({ "font-size": "2.4rem" });
		else if (length < 20) $(".display").css({ "font-size": "1.8rem" });

		if (length >= 20) {
			$(".message").val("OUT OF LENGTH");
			$(".message").css({ color: "red" });
			result = result.toString().slice(0, 20);
		} else {
			$(".message").css({ color: "#c581cd" });
			$(".message").val(`LIMIT (20) : ${length}`);
		}
	}

	// CHANGE MODE LIGHT / DARK
	function toLightMode() {
		$("body").addClass("light-mode");
		$(".calc-container").addClass("calc-light-mode");
		$(".btn").addClass("btn-light-mode");
		$(".mode").addClass("switch-mode");
		$(".mode-ctn").addClass("mode-ctn-light");
	}
	function toDarkMode() {
		$("body").removeClass("light-mode");
		$(".calc-container").removeClass("calc-light-mode");
		$(".btn").removeClass("btn-light-mode");
		$(".mode").removeClass("switch-mode");
		$(".mode-ctn").removeClass("mode-ctn-light");
	}

	//*# -------------------------------------

	//*# EVENT HANDLERS

	// CALCULATOR CONTAINER
	$(".calc-container").on("click", (e) => {
		if ($(e.target).hasClass("btn")) {
			calculate($(e.target).val());
		}
	});

	// BUTTONS SWITCH MODE
	$(".btn-switch-dark").on("click", toDarkMode);
	$(".btn-switch-light").on("click", toLightMode);

	// HANDLE WITH KEY PRESS
	$(window).on("keydown", handleKeyPress);
});
