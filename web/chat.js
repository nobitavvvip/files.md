// Global variables
let currentFile = 'main.txt';
let sidebarFiles = {
    'main.txt': [],
    'journal.txt': [],
    'shop.txt': [],
    'read-list.txt': [],
    'watch-list.txt': [],
    'ideas.txt': [],
    'tasks.txt': [],
    'archive.txt': []
};

let chatContainer;
let messageInput;

function init() {
    chatContainer = document.getElementById('chat');
    messageInput = document.getElementById('chat-input');

    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });

    loadData();
    renderMessages();

    // Notify sidebar about initial state (commented for future implementation)
    // updateSidebar();

    // Listen for sidebar file switching (commented for future implementation)
    // window.addEventListener('fileSwitch', function(e) {
    //     switchFile(e.detail.fileName);
    // });
}

function handleSend() {
    const text = messageInput.value.trim();
    if (!text) return;

    const note = {
        id: Date.now(),
        text: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString()
    };

    sidebarFiles[currentFile].push(note);
    messageInput.value = '';
    saveData();
    renderMessages();
    scrollToBottom();

    // Notify sidebar of changes (commented for future implementation)
    // updateSidebar();
}

function renderMessages() {
    const messages = sidebarFiles[currentFile];

    if (messages.length === 0) {
        chatContainer.innerHTML = `
                    <div class="empty-state">
                        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10,9 9,9 8,9"/>
                        </svg>
                        <div class="empty-title">No notes in ${currentFile}</div>
                        <div class="empty-desc">Start typing to add your first note</div>
                    </div>
                `;
        return;
    }

    chatContainer.innerHTML = messages.map(note => `
                <div class="message" data-note-id="${note.id}">
                    <div class="message-content" 
                         contenteditable="true" 
                         data-note-id="${note.id}"
                         spellcheck="false">${escapeHtml(note.text)}</div>
                    <div class="message-footer">
                        <span class="message-time">${note.timestamp}</span>
                        <div class="message-actions">
                            ${renderMoveButtons(note.id)}
                            <button class="action-btn delete-btn" data-note-id="${note.id}">
                                🗑️
                                <span class="btn-label">Delete</span>
                            </button>
                        </div>
                    </div>
                </div>
            `).reverse().join('');

    attachEventListeners();
}

function renderMoveButtons(noteId) {
    const targetFiles = Object.keys(sidebarFiles).filter(f => f !== currentFile);
    const buttonConfigs = {
        'journal.txt': { label: 'Journal', emoji: '📔' },
        'shop.txt': { label: 'Shop', emoji: '🛒' },
        'read-list.txt': { label: 'Read', emoji: '📚' },
        'watch-list.txt': { label: 'Watch', emoji: '📺' },
        'ideas.txt': { label: 'Ideas', emoji: '💡' },
        'tasks.txt': { label: 'Tasks', emoji: '✅' },
        'archive.txt': { label: 'Archive', emoji: '📦' },
        'main.txt': { label: 'Main', emoji: '📝' }
    };

    return targetFiles.map(fileName => {
        const config = buttonConfigs[fileName];
        return `
                    <button class="action-btn move-btn" data-note-id="${noteId}" data-target-file="${fileName}">
                        ${config.emoji}
                        <span class="btn-label">${config.label}</span>
                    </button>
                `;
    }).join('');
}

function attachEventListeners() {
    // Add event listeners for editing message content
    chatContainer.querySelectorAll('.message-content[contenteditable]').forEach(element => {
        element.addEventListener('blur', function(e) {
            saveEdit(e.target.dataset.noteId, e.target.textContent);
            e.target.classList.remove('editing');
        });

        element.addEventListener('focus', function(e) {
            e.target.classList.add('editing');
        });

        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.target.blur();
            }
            if (e.key === 'Escape') {
                e.target.textContent = sidebarFiles[currentFile].find(n => n.id == e.target.dataset.noteId).text;
                e.target.blur();
            }
        });
    });

    // Add click listeners to move buttons
    chatContainer.querySelectorAll('.move-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            moveNote(btn.dataset.noteId, btn.dataset.targetFile);
        });
    });

    // Add delete button listeners
    chatContainer.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            deleteNote(btn.dataset.noteId);
        });
    });
}

function moveNote(noteId, targetFile) {
    const sourceMessages = sidebarFiles[currentFile];
    const noteIndex = sourceMessages.findIndex(note => note.id == noteId);

    if (noteIndex !== -1) {
        const note = sourceMessages.splice(noteIndex, 1)[0];
        sidebarFiles[targetFile].push(note);

        saveData();
        renderMessages();

        // Notify sidebar of changes (commented for future implementation)
        // updateSidebar();
    }
}

function saveEdit(noteId, newText) {
    const note = sidebarFiles[currentFile].find(n => n.id == noteId);
    if (note && newText.trim() !== '') {
        note.text = newText.trim();
        saveData();
    }
}

function deleteNote(noteId) {
    sidebarFiles[currentFile] = sidebarFiles[currentFile].filter(n => n.id != noteId);
    saveData();
    renderMessages();

    // Notify sidebar of changes (commented for future implementation)
    // updateSidebar();
}

function loadData() {
    // Load data from localStorage or external source
    // Implementation depends on your storage preference
}

function saveData() {
    // Save data to localStorage or external source
    // Implementation depends on your storage preference
}

function scrollToBottom() {
    setTimeout(function() {
        chatContainer.scrollTop = 0;
    }, 100);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Methods for sidebar integration (commented for future implementation)
// function switchFile(fileName) {
//     currentFile = fileName;
//     renderMessages();
// }
//
// function updateSidebar() {
//     window.dispatchEvent(new CustomEvent('filesUpdated', {
//         detail: { files: files, currentFile: currentFile }
//     }));
// }

// Initialize when page loads
document.addEventListener('DOMContentLoaded', init);

const chatInput = document.getElementById('chat-input');
function autoResize() {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 250) + 'px';
}
// Add event listener for input changes
chatInput.addEventListener('input', autoResize);
// Initial resize to set proper height
autoResize();
