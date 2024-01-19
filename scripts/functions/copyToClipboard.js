/**
 * Copies the content of a specified element to the system clipboard when a button is clicked.
 * Provides visual feedback to the user upon success or failure.
 *
 * @param {string} copyButtonSelector - CSS selector for the copy button element.
 * @param {string} sectionSelector - CSS selector for the editor/preview element containing the text to copy.
 * @param {string} successMessage - Optional message to display upon successful copy.
 * @param {string} failureMessage - Optional message to display upon failure of copy.
 * @param {number} [timerDuration=1500] - Optional duration in milliseconds for the success message to display.
 */
export const copyToClipboard = (
	copyButtonSelector,
	sectionSelector,
	successMessage = sectionSelector === "#sme-editor" ? "Markdown Successfully Copied!" : "HTML Successfully Copied!",
	failureMessage = sectionSelector === "#sme-editor"
		? "Failed to copy Markdown from preview!"
		: "Failed to copy HTML from preview!",
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
	if (!isValidCSSSelector(copyButtonSelector) || !isValidCSSSelector(sectionSelector)) {
		console.error("Invalid CSS selectors provided for copy button or preview element.")
		return
	}

	// Get references to HTML elements
	const copyButton = document.querySelector(copyButtonSelector)
	const sectionElement = document.querySelector(sectionSelector)

	// Check for clipboard API compatibility and provide a fallback
	if (!navigator.clipboard) {
		console.error("Clipboard API not supported in this browser.")
		// Implement a fallback mechanism, such as using a text area
		return
	}

	// Attach a click event listener to the button
	copyButton.addEventListener("click", async () => {
		try {
			// Copy the editor Markdown / preview HTML to the system clipboard
			copyButton.id === "copy-markdown"
				? await navigator.clipboard.writeText(sectionElement.value)
				: await navigator.clipboard.writeText(sectionElement.innerHTML)

			// Close the dropdown
			copyButton.closest("sme-dropdown").firstElementChild.checked = false

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
