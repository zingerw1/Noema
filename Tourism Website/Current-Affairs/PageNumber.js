let currentPage = 1; // Starting on page 1
const totalPages = 2; // We have 2 pages

// Function to check current page and redirect accordingly
function handlePageNavigation(targetPage) {
    const currentPath = window.location.pathname;
    const isOnNewsRegistered = currentPath.includes('newsRegistered.html');
    const isOnNewsPage2 = currentPath.includes('newspage2Registered.html');

    if (isOnNewsRegistered && targetPage === 2) {
        window.location.href = 'newspage2Registered.html';
        return true;
    } else if (isOnNewsPage2 && targetPage === 1) {
        window.location.href = 'newsRegistered.html';
        return true;
    }
    return false;
}

// Function to go to a specific page
function goToPage(pageNumber) {
    if (handlePageNavigation(pageNumber)) {
        return; // Stop if redirect happened
    }
    
    currentPage = pageNumber;
    updatePagination();
}

// Function to handle the next/prev buttons
function changePage(direction) {
    let targetPage = currentPage;
    if (direction === 'next' && currentPage < totalPages) {
        targetPage = currentPage + 1;
    } else if (direction === 'prev' && currentPage > 1) {
        targetPage = currentPage - 1;
    }

    if (handlePageNavigation(targetPage)) {
        return; // Stop if redirect happened
    }

    currentPage = targetPage;
    updatePagination();
}

// Function to update the pagination UI
function updatePagination() {
    // Reset all page buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.getElementById(`page-${i}`);
        if (pageBtn) {
            pageBtn.classList.remove('bg-yellow-400', 'text-black');
            pageBtn.classList.add('bg-gray-200', 'text-black');
        }
    }

    // Highlight the current page
    const currentBtn = document.getElementById(`page-${currentPage}`);
    if (currentBtn) {
        currentBtn.classList.add('bg-yellow-400', 'text-black');
    }

    // Disable/Enable prev/next buttons based on current page
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
}

// Initialize pagination on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial page based on current URL
    if (window.location.pathname.includes('newspage2Registered.html')) {
        currentPage = 2;
    }
    updatePagination();
});
