(() => {
	const STORAGE_KEYS = {
		NOTES: "jot-notes",
		CURRENT_NOTE_ID: "jot-current-note-id",
		SIDEBAR_VISIBLE: "jot-sidebar-visible",
	};
	const AUTO_SAVE_DELAY = 500;
	const TITLE_PREVIEW_LENGTH = 30;

	// State
	let notes = [];
	let currentNoteId = null;
	let quill = null;
	let autoSaveTimer = null;
	let sidebarVisible = true;

	function generateId() {
		return Date.now().toString();
	}

	function debounce(func, delay) {
		return function (...args) {
			clearTimeout(autoSaveTimer);
			autoSaveTimer = setTimeout(() => func.apply(this, args), delay);
		};
	}

	function extractPlainText(delta) {
		if (!delta || !delta.ops) return "";

		let text = "";
		delta.ops.forEach((op) => {
			if (typeof op.insert === "string") {
				text += op.insert;
			}
		});

		return text.trim();
	}

	function getTitlePreview(content) {
		const plainText = extractPlainText(content);
		if (!plainText) return "(Empty)";

		const preview = plainText.substring(0, TITLE_PREVIEW_LENGTH);
		return plainText.length > TITLE_PREVIEW_LENGTH ? preview + "..." : preview;
	}

	function loadFromStorage() {
		try {
			const notesData = localStorage.getItem(STORAGE_KEYS.NOTES);
			const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_NOTE_ID);
			const sidebarState = localStorage.getItem(STORAGE_KEYS.SIDEBAR_VISIBLE);

			notes = notesData ? JSON.parse(notesData) : [];
			currentNoteId = currentId;
			sidebarVisible = sidebarState !== null ? sidebarState === "true" : true;

			return { notes, currentNoteId, sidebarVisible };
		} catch (error) {
			console.error("Error loading from storage:", error);
			return { notes: [], currentNoteId: null, sidebarVisible: true };
		}
	}

	function saveToStorage() {
		try {
			localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
			if (currentNoteId) {
				localStorage.setItem(STORAGE_KEYS.CURRENT_NOTE_ID, currentNoteId);
			}
			localStorage.setItem(STORAGE_KEYS.SIDEBAR_VISIBLE, sidebarVisible.toString());
		} catch (error) {
			console.error("Error saving to storage:", error);
		}
	}

	function createNewNote() {
		const newNote = {
			id: generateId(),
			content: { ops: [] },
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};

		notes.unshift(newNote);
		currentNoteId = newNote.id;

		saveToStorage();
		updateSidebar();
		loadNoteIntoEditor(newNote.id);

		quill.focus();
	}

	function deleteNote(noteId) {
		const noteIndex = notes.findIndex((note) => note.id === noteId);
		if (noteIndex === -1) return;

		const confirmDelete = confirm("Are you sure you want to delete this note?");
		if (!confirmDelete) return;

		notes.splice(noteIndex, 1);

		if (currentNoteId === noteId) {
			if (notes.length > 0) {
				currentNoteId = notes[0].id;
				loadNoteIntoEditor(currentNoteId);
			} else {
				currentNoteId = null;
				createNewNote();
				return;
			}
		}

		saveToStorage();
		updateSidebar();
	}

	function loadNoteIntoEditor(noteId) {
		const note = notes.find((n) => n.id === noteId);
		if (!note) return;

		currentNoteId = noteId;

		quill.setContents(note.content);

		localStorage.setItem(STORAGE_KEYS.CURRENT_NOTE_ID, currentNoteId);

		updateSidebar();

		quill.focus();
	}

	function saveCurrentNote() {
		if (!currentNoteId) return;

		const note = notes.find((n) => n.id === currentNoteId);
		if (!note) return;

		note.content = quill.getContents();
		note.updatedAt = Date.now();

		saveToStorage();
		updateSidebar();
	}

	function updateSidebar() {
		const notesList = document.getElementById("notes-list");

		while (notesList.firstChild) {
			notesList.removeChild(notesList.firstChild);
		}

		if (notes.length === 0) {
			const emptyState = document.createElement("div");
			emptyState.style.padding = "20px";
			emptyState.style.textAlign = "center";
			emptyState.style.color = "#999";
			emptyState.textContent = "No notes yet";
			notesList.appendChild(emptyState);
			return;
		}

		notes.forEach((note) => {
			const noteItem = document.createElement("div");
			noteItem.className = "note-item";
			if (note.id === currentNoteId) {
				noteItem.classList.add("active");
			}

			const titleDiv = document.createElement("div");
			titleDiv.className = "note-title";
			const title = getTitlePreview(note.content);
			titleDiv.textContent = title;
			if (title === "(Empty)") {
				titleDiv.classList.add("empty");
			}

			const deleteBtn = document.createElement("button");
			deleteBtn.className = "delete-btn";
			deleteBtn.textContent = "×";
			deleteBtn.onclick = (e) => {
				e.stopPropagation();
				deleteNote(note.id);
			};

			noteItem.appendChild(titleDiv);
			noteItem.appendChild(deleteBtn);

			noteItem.onclick = () => loadNoteIntoEditor(note.id);

			notesList.appendChild(noteItem);
		});
	}

	function toggleSidebar() {
		sidebarVisible = !sidebarVisible;
		const sidebar = document.querySelector(".sidebar");
		sidebar.classList.toggle("hidden");
		localStorage.setItem(STORAGE_KEYS.SIDEBAR_VISIBLE, sidebarVisible.toString());
	}

	const debouncedSave = debounce(saveCurrentNote, AUTO_SAVE_DELAY);

	function setupEventListeners() {
		document
			.getElementById("new-note-btn")
			.addEventListener("click", createNewNote);

		document
			.getElementById("toggle-sidebar-btn")
			.addEventListener("click", toggleSidebar);

		document.addEventListener("keydown", (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "b") {
				e.preventDefault();
				toggleSidebar();
			}
		});

		quill.on("text-change", () => {
			debouncedSave();
		});
	}

	function init() {
		quill = new Quill("#editor", {
			modules: {
				toolbar: [
					[{ header: [1, 2, false] }],
					["bold", "italic", "underline"],
					["image", "code-block"],
				],
			},
			theme: "snow",
		});

		// Create and add toggle button to Quill toolbar
		const toolbar = document.querySelector(".ql-toolbar");
		const toggleBtn = document.createElement("button");
		toggleBtn.id = "toggle-sidebar-btn";
		toggleBtn.className = "toggle-sidebar-btn";
		toggleBtn.textContent = "☰";
		toggleBtn.type = "button";
		toolbar.prepend(toggleBtn);

		loadFromStorage();

		// Apply initial sidebar visibility state
		const sidebar = document.querySelector(".sidebar");
		if (!sidebarVisible) {
			sidebar.classList.add("hidden");
		}

		if (notes.length === 0) {
			createNewNote();
		} else {
			const noteToLoad =
				currentNoteId && notes.find((n) => n.id === currentNoteId)
					? currentNoteId
					: notes[0].id;
			loadNoteIntoEditor(noteToLoad);
		}

		setupEventListeners();

		updateSidebar();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
