/**
 * Downloads HTML content to the user's device.
 *
 * @param {HTMLElement} preview - The HTML element containing the content to be downloaded.
 * @returns {Promise<void>} - A promise that resolves after the download process is completed.
 */
export const downloadHTML = async (preview) => {
	try {
		// Get user-provided filename and generate data URI
		const { filename, dataURI } = await getFilenameAndDataURI(preview)

		if (filename && dataURI) {
			// Proceed with download logic (create link element, trigger download)
			const link = document.createElement("a")
			link.href = dataURI
			link.download = filename
			link.setAttribute("aria-label", "Download HTML content")

			// Trigger download and handle errors
			link.click()
			link.addEventListener("error", () => {
				Swal.fire({
					position: "top-end",
					icon: "error",
					title: "Download failed!",
					text: "Please try again or save the content manually.",
					showConfirmButton: false,
					timer: 1500,
				})
				console.error("Download failed:", link.href)
			})
		} else {
			// Handle cancellation or invalid input
			console.log("Download canceled or invalid input.")
		}
	} catch (error) {
		Swal.fire({
			position: "top-end",
			icon: "error",
			title: "ERROR!",
			text: "Error generating HTML or downloading.",
			showConfirmButton: false,
			timer: 1500,
		})
		console.error("Error generating HTML or downloading:", error)
	}
}

/**
 * Handles filename input and data URI generation for the download process.
 *
 * @param {HTMLElement} preview - The HTML element containing the content to be downloaded.
 * @returns {Promise<{ filename: string, dataURI: string }>} - A promise that resolves with the filename and data URI.
 */
const getFilenameAndDataURI = async (preview) => {
	let dataURI
	const { value: filename } = await Swal.fire({
		title: "Enter a filename for the HTML file",
		input: "text",
		inputValue: "parsedMarkdownToHTML.html",
		showCancelButton: true,
		confirmButtonText: "Download",
		showLoaderOnConfirm: true, // Show loading indicator while generating data URI
		preConfirm: async () => {
			const encodedHTML = encodeURIComponent(preview.innerHTML)
			const dataURILength = encodedHTML.length + "data:text/html,".length

			// Validate data URI length. Check against 2MB limit
			if (dataURILength > 1 * 1024 * 1024) {
				Swal.fire({
					title: "Download Size Limit 1MB",
					text: "The HTML content is too large to download directly as a data URI!",
					icon: "warning",
				})
			} else {
				// Proceed with data URI generation
				dataURI = "data:text/html," + encodedHTML
			}
		},
		inputValidator: (value) => {
			if (!validateFilename(value)) {
				return "Invalid filename. Please use only letters, numbers, underscores, hyphens, and a .html extension."
			}
		},
	})

	if (filename) {
		// Return both values
		return { filename, dataURI }
	} else {
		// Return empty values for cancellation
		return { filename: "", dataURI: "" }
	}
}

/**
 * Validates the given filename for the download process.
 *
 * @param {string} filename - The filename to be validated.
 * @returns {boolean} - True if the filename is valid, false otherwise.
 */
function validateFilename(filename) {
	// Check for forbidden characters
	const invalidChars = /[<>:"/\\|?*]/
	if (invalidChars.test(filename)) {
		return false
	}

	// Enforce maximum length
	const maxLength = 255
	if (filename.length > maxLength) {
		return false
	}

	// Use a regular expression for more robust validation
	const validFilenameRegex = /^[a-zA-Z0-9_-]+\.html$/
	if (!validFilenameRegex.test(filename)) {
		return false
	}

	return true // Filename is valid
}
