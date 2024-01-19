/**
 * Downloads editor/preview content to the user's device.
 *
 * @param {HTMLElement} container - The HTML element containing the content to be downloaded.
 * @param {boolean} isMarkdown - Indicates whether to download as Markdown or HTML.
 * @returns {Promise<void>} - A promise that resolves after the download process is completed.
 */
export const downloadContent = async (container, isMarkdown) => {
	try {
		// Get user-provided filename and generate data URI
		const { filename, dataURI } = await getFilenameAndDataURI(container, isMarkdown)

		if (filename && dataURI) {
			// Proceed with download logic (create link element, trigger download)
			const link = document.createElement("a")
			link.href = dataURI
			link.download = filename
			link.setAttribute("aria-label", "Download content")

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
			text: "Error generating content or downloading.",
			showConfirmButton: false,
			timer: 1500,
		})
		console.error("Error generating content or downloading:", error)
	}
}

/**
 * Handles filename input and data URI generation for the download process.
 *
 * @param {HTMLElement} container - The HTML element containing the content to be downloaded.
 * @param {boolean} isMarkdown - Indicates whether to download as Markdown or HTML.
 * @returns {Promise<{ filename: string, dataURI: string }>} - A promise that resolves with the filename and data URI.
 */
const getFilenameAndDataURI = async (container, isMarkdown) => {
	let dataURI
	const { value: filename } = await Swal.fire({
		title: isMarkdown ? "Enter a filename for the Markdown file" : "Enter a filename for the HTML file",
		input: "text",
		inputValue: isMarkdown ? "markdown-from-SME-editor.md" : "parsed-markdown-to-HTML.html",
		showCancelButton: true,
		confirmButtonText: "Download",
		showLoaderOnConfirm: true, // Show loading indicator while generating data URI
		preConfirm: async () => {
			const encodedContent = isMarkdown
				? encodeURIComponent(container.value) // Use value for Markdown
				: encodeURIComponent(container.innerHTML)
			const dataURILength = encodedContent.length + "data:text/" + (isMarkdown ? "markdown" : "html") + ",".length

			// Validate data URI length. Check against 1MB limit
			if (dataURILength > 1 * 1024 * 1024) {
				Swal.fire({
					title: "Download Size Limit 1MB",
					text: "The content is too large to download directly as a data URI!",
					icon: "warning",
				})
			} else {
				// Proceed with data URI generation
				dataURI = `data:text/${isMarkdown ? "markdown" : "html"},${encodedContent}`
			}
		},
		inputValidator: (value) => {
			if (!validateFilename(value, isMarkdown)) {
				return (
					"Invalid filename. Please use only letters, numbers, underscores, hyphens, and a " +
					(isMarkdown ? ".md" : ".html") +
					" extension."
				)
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
 * @param {boolean} isMarkdown - Indicates whether the filename is for Markdown or HTML.
 * @returns {boolean} - True if the filename is valid, false otherwise.
 */
function validateFilename(filename, isMarkdown) {
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
	const validFilenameRegex = /^[a-zA-Z0-9_-]+\.(md|html)$/
	if (!validFilenameRegex.test(filename)) {
		return false
	}

	// Ensure extension matches the content type
	const extension = filename.split(".").pop()

	if (isMarkdown && validFilenameRegex && extension !== "md") {
		return false
	} else if (!isMarkdown && validFilenameRegex && extension !== "html") {
		return false
	}

	return true // Filename is valid
}
