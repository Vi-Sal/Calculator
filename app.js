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

	//*# -------------------------------------

	//*# FUNCTIONALITIES

	// Handle for calculation
	function calculate(btnValue) {
		result = $(".display").val();

		// REPLACE ALL COMMAS ' , ' WITH ''
		result = result.replaceAll(",", "");

		let length = result.length;

		if (["+", "-", "×", "÷", "AC"].includes(btnValue)) haveDot = false;

		if (prevValue === "=" && !["+", "-", "×", "÷", "N&P"].includes(btnValue))
			result = "";

		if (result === "0" && !operators.includes(btnValue)) result = "";

		if (
			(btnValue === "=" && operators.includes(prevValue)) ||
			(prevValue === "." && btnValue === ".") ||
			(btnValue === "." && haveDot) ||
			(result === "0" && btnValue === "0") ||
			(["-", "+"].includes(prevValue) && btnValue === "0") ||
			(btnValue === "=" && result === "") ||
			(operators.includes(result.slice(-1)) && btnValue === "N&P")
		) {
			return;
		} else {
			// USING SWITCH CASE
			switch (btnValue) {
				case "=": {
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
					// IF WE DELETED A DOT ( . ) THEN SET haveDot TO FALSE
					if (result.slice(-1) === ".") haveDot = false;

					result = result.slice(0, -1);

					if (result === "") result = "0";
					break;
				}
				case "N&P": {
					if (result !== "") result = eval(`-(${result})`);
					if (result === "") result = "-0";
					break;
				}
				default: {
					if (btnValue === ".") haveDot = true;

					if (
						(btnValue === "." && result === "") ||
						(btnValue === "." && operators.includes(prevValue))
					)
						btnValue = "0.";

					if (
						["+", "-", "×", "÷", "."].includes(
							result.toString().slice(-1)
						) &&
						operators.includes(btnValue)
					) {
						result = result.toString().slice(0, -1);
					}

					result += btnValue;
					break;
				}
			}

			// CHECK FOR LIMIT TEXT
			length = result.toString().length;
			limitText(length);

			// FORMAT OUR RESULT WITH COMMAS
			result = result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

			$(".display").val(result);

			prevValue = btnValue;
		}
	}

	// FUNCTION HANDLE FOR CHECK LIMIT TEXT
	function limitText(length) {
		if (length < 14) {
			$(".display").css({ "font-size": "3rem" });
		} else if (length < 16) {
			$(".display").css({ "font-size": "2.5rem" });
		} else if (length < 20) {
			$(".display").css({ "font-size": "2rem" });
		}

		if (length >= 20) {
			$(".message").val("OUT OF LENGTH");
			$(".message").css({ color: "red" });
			result = result.toString().slice(0, 20);
		} else {
			$(".message").css({ color: "#c581cd" });
			$(".message").val(`LIMIT (20) : ${length}`);
		}
	}

	// FUNCTION THAT HANDLE WITH KEYPRESS
	function handleKeyPress(e) {
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

	// CHANGE MODE LIGHT / DARK
	function changeMode() {
		if (dark) {
			$(".btn-switch-mode > img").attr("src", "img/dark-mode.png");
			dark = false;
		} else {
			$(".btn-switch-mode > img").attr("src", "img/light-mode.png");
			dark = true;
		}

		$("body").toggleClass("day-mode");
		$(".calc-container").toggleClass("calc-d-mode");
		$(".btn").toggleClass("btn-d-mode");
	}

	//*# -------------------------------------

	//*# EVENT HANDLERS

	// CALCULATOR CONTAINER
	$(".calc-container").on("click", (e) => {
		if ($(e.target).hasClass("btn")) {
			calculate($(e.target).val());
		}
	});

	// HANDLE WITH KEY PRESS
	$(window).on("keydown", handleKeyPress);

	// BUTTON SWITCH MODE
	$(".btn-switch-mode").on("click", changeMode);
});
