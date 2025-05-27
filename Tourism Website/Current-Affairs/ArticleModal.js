function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Close modal when clicking outside of content
document.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        if (e.target === modal) {
            const modalId = modal.id;
            closeModal(modalId);
        }
    });
});

// Close modal when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            if (!modal.classList.contains('hidden')) {
                const modalId = modal.id;
                closeModal(modalId);
            }
        });
    }
});
