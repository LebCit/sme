import { initializeMarkdownPreview } from "./functions/initializeMarkdownPreview.js"
import { handleDropdownToggle } from "./functions/handleDropdownToggle.js"
import { setupButtonListeners } from "./functions/buttonListeners.js"
import { keyBoardShortcuts } from "./functions/keyBoardShortcuts.js"
import { copyToClipboard } from "./functions/copyToClipboard.js"
import { downloadContent } from "./functions/downloadContent.js"
import { handleLists } from "./functions/handleLists.js"

document.addEventListener("DOMContentLoaded", () => {
	const editor = document.getElementById("sme-editor")
	const preview = document.getElementById("sme-preview")
	const buttons = document.querySelectorAll(".sme-md-btn")
	const downloadButtons = document.querySelectorAll(".download-btn")

	// Handle dropdown toggle
	handleDropdownToggle(document, "sme-dropdown input")

	// Handle Markdown Preview
	const returnedHandleInput = initializeMarkdownPreview(editor, preview)

	// Attach event listeners to buttons
	setupButtonListeners(buttons, editor, returnedHandleInput)

	// Handle lists
	handleLists(editor, returnedHandleInput)

	// Listen for keydown events on the document
	const keyboardShortcutsListener = keyBoardShortcuts(editor, returnedHandleInput)
	document.addEventListener("keydown", keyboardShortcutsListener)

	// Copy editor Markdown / preview HTML to the system clipboard
	copyToClipboard("#copy-markdown", "#sme-editor")
	copyToClipboard("#copy-html", "#sme-preview")

	// Download HTML/Markdown
	downloadButtons.forEach((btn) => {
		btn.addEventListener("click", async () => {
			btn.title === "Download HTML" ? await downloadContent(preview, false) : await downloadContent(editor, true)

			// Remove focus
			btn.blur()
		})
	})

	returnedHandleInput()
})
