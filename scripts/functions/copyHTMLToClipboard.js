/**
 * Copies the HTML content of a specified preview element to the system clipboard when a button is clicked.
 * Provides visual feedback to the user upon success or failure.
 *
 * @param {string} copyButtonSelector - CSS selector for the copy button element.
 * @param {string} previewSelector - CSS selector for the preview element containing the HTML to copy.
 * @param {string} [successMessage="HTML Successfully Copied!"] - Optional message to display upon successful copy.
 * @param {string} [failureMessage="Failed to copy HTML from preview!"] - Optional message to display upon failure of copy.
 * @param {number} [timerDuration=1500] - Optional duration in milliseconds for the success message to display.
 */
export const copyHTMLToClipboard = (
	copyButtonSelector,
	previewSelector,
	successMessage = "HTML Successfully Copied!",
	failureMessage = "Failed to copy HTML from preview!",
	timerDuration = 1500
) => {
	/**
	 * Checks if a given string is a valid CSS selector.
	 *
	 * @param {string} selector - The CSS selector to validate.
	 * @returns {boolean} True if the selector is valid, false otherwise.
	 */
	const isValidCSSSelector = (selector) => {
		/**
		 * Attempt to create a querySelector with the given selector.
		 * If no errors occur, assume the selector is valid.
		 */
		try {
			document.querySelector(selector)
			return true
		} catch (error) {
			// If an error occurs, the selector is likely invalid.
			return false
		}
	}

	// Validate input selectors
	if (!isValidCSSSelector(copyButtonSelector) || !isValidCSSSelector(previewSelector)) {
		console.error("Invalid CSS selectors provided for copy button or preview element.")
		return
	}

	// Get references to HTML elements
	const copyButton = document.querySelector(copyButtonSelector)
	const previewElement = document.querySelector(previewSelector)

	// Check for clipboard API compatibility and provide a fallback
	if (!navigator.clipboard) {
		console.error("Clipboard API not supported in this browser.")
		// Implement a fallback mechanism, such as using a text area
		return
	}

	// Attach a click event listener to the button
	copyButton.addEventListener("click", async () => {
		try {
			// Copy the preview HTML to the system clipboard
			await navigator.clipboard.writeText(previewElement.innerHTML)

			// Display a customizable success message with auto close timer to the user
			Swal.fire({
				position: "top-end",
				icon: "success",
				title: successMessage,
				showConfirmButton: false,
				timer: timerDuration,
			})
		} catch (error) {
			console.error(`${failureMessage}: ${error.message}`)
			// Display a customizable error message with auto close timer to the user
			Swal.fire({
				position: "top-end",
				icon: "error",
				title: failureMessage,
				showConfirmButton: false,
				timer: timerDuration,
			})
		}
	})
}
