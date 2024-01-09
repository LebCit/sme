import { initializeMarkdownPreview } from "./functions/initializeMarkdownPreview.js"
import { handleDropdownToggle } from "./functions/handleDropdownToggle.js"
import { setupButtonListeners } from "./functions/buttonListeners.js"
import { keyBoardShortcuts } from "./functions/keyBoardShortcuts.js"
import { handleLists } from "./functions/handleLists.js"

document.addEventListener("DOMContentLoaded", () => {
	const editor = document.getElementById("sme-editor")
	const preview = document.getElementById("sme-preview")
	const buttons = document.querySelectorAll(".sme-md-btn")

	handleDropdownToggle(document, "sme-dropdown input")

	const returnedHandleInput = initializeMarkdownPreview(editor, preview)

	// Attach event listeners to buttons
	setupButtonListeners(buttons, editor, returnedHandleInput)

	// Listen for keydown events on the document
	const keyboardShortcutsListener = keyBoardShortcuts(editor, returnedHandleInput)
	document.addEventListener("keydown", keyboardShortcutsListener)

	// Handle lists
	handleLists(editor, returnedHandleInput)

	returnedHandleInput()
})
