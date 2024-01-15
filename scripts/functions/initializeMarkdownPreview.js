import { marked } from "https://cdn.jsdelivr.net/npm/marked@11.1.1/+esm"
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.0.8/+esm"
import UndoManager from "https://cdn.jsdelivr.net/npm/undo-manager@1.1.1/+esm"

// Function to set up the Markdown preview functionality
export const initializeMarkdownPreview = (editor, preview) => {
	// Initialize UndoManager
	const undoManager = new UndoManager()
	undoManager.setLimit(20) // Set a limit of 20 undo steps

	// Get references to HTML elements
	const undoBtn = document.getElementById("undoBtn")
	const redoBtn = document.getElementById("redoBtn")
	const htmlBtn = document.getElementById("html-preview")
	const markdownBtn = document.getElementById("markdown-preview")

	// Function to update the buttons' disabled state based on undo/redo availability
	const updateButtons = () => {
		undoBtn.disabled = !undoManager.hasUndo()
		redoBtn.disabled = !undoManager.hasRedo()
	}

	// Function to update the preview
	const updatePreview = (markdownContent) => {
		try {
			preview.innerHTML = DOMPurify.sanitize(marked.parse(markdownContent))
		} catch (error) {
			console.error("Error parsing Markdown:", error.message)
			// Handle the error (e.g., display a user-friendly message in the UI)
		}
	}

	// Functions to handle preview switching

	// Function to show the raw HTML of the preview
	const showHtmlPreview = () => {
		const parsedHtml = marked.parse(editor.value) // Get the HTML from the Markdown content
		preview.innerText = parsedHtml // Set the preview to display the raw HTML
		htmlBtn.closest("sme-dropdown").firstElementChild.checked = false
		// Optionally, update button states or styling to indicate the current preview mode
	}

	// Function to show the parsed Markdown to HTML
	const showMarkdownPreview = () => {
		preview.innerHTML = DOMPurify.sanitize(marked.parse(editor.value)) // Parse the Markdown again to ensure fresh rendering
		markdownBtn.closest("sme-dropdown").firstElementChild.checked = false
		// Optionally, update button states or styling to indicate the current preview mode
	}

	// Add event listeners to the buttons preview
	htmlBtn.addEventListener("click", showHtmlPreview)
	markdownBtn.addEventListener("click", showMarkdownPreview)

	// Function to handle user input
	const handleInput = () => {
		const markdownContent = editor.value

		undoManager.add({
			value: markdownContent,
			undo: function () {
				editor.value = this.value // Undo changes
				updatePreview(editor.value) // Update the preview
			},
			redo: function () {
				editor.value = this.value // Redo changes
				updatePreview(editor.value) // Update the preview
			},
		})

		updatePreview(markdownContent)

		updateButtons()
	}

	// Function to handle undo button click
	function undo() {
		if (undoManager.hasUndo()) {
			undoManager.undo()
			const commands = undoManager.getCommands()
			if (commands.length > 0) {
				const index = undoManager.getIndex()
				const undoContent = commands[index] ? commands[index].value : ""
				editor.value = undoContent
				updatePreview(undoContent) // Update the preview with the content from the undo command
			} else {
				editor.value = ""
				updatePreview("") // Update the preview since the editor is empty
			}
		}
		updateButtons()
	}

	// Function to handle redo button click
	function redo() {
		if (undoManager.hasRedo()) {
			undoManager.redo()
			const commands = undoManager.getCommands()
			const index = undoManager.getIndex()
			if (commands[index]) {
				editor.value = commands[index].value
			}
		}
		updateButtons()
	}

	// Attach event listeners to buttons
	undoBtn.addEventListener("click", undo)
	redoBtn.addEventListener("click", redo)

	// Event listener for editor changes
	editor.addEventListener("input", handleInput)

	// Event listener for Ctrl+Z and Ctrl+y (undo and redo shortcuts)
	document.addEventListener("keydown", function (event) {
		if (event.ctrlKey) {
			if (event.key === "z") {
				undo()
				event.preventDefault() // Prevent the default browser behavior for Ctrl+Z
			} else if (event.key === "y") {
				redo()
				event.preventDefault() // Prevent the default browser behavior for Ctrl+Y
			}
			//event.preventDefault() // Prevent the default browser behavior for Ctrl+Z and Ctrl+Y
		}
	})

	// Initial preview
	handleInput()

	// Return handleInput
	return handleInput
}
