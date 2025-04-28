let currentPage = 1; // Starting on page 1
    const totalPages = 3; // Set your total pages

    // Function to go to a specific page
    function goToPage(pageNumber) {
        currentPage = pageNumber;
        updatePagination();
        loadPageContent(currentPage); // Load new content based on page number
    }

    // Function to handle the next/prev buttons
    function changePage(direction) {
        if (direction === 'next' && currentPage < totalPages) {
            currentPage++;
        } else if (direction === 'prev' && currentPage > 1) {
            currentPage--;
        }
        updatePagination();
        loadPageContent(currentPage);
    }

    // Function to update the pagination UI
    function updatePagination() {
        // Reset all page buttons
        for (let i = 1; i <= totalPages; i++) {
            document.getElementById(`page-${i}`).classList.remove('bg-yellow-400', 'text-black');
            document.getElementById(`page-${i}`).classList.add('bg-gray-200', 'text-black');
        }

        // Highlight the current page
        document.getElementById(`page-${currentPage}`).classList.add('bg-yellow-400', 'text-black');

        // Disable/Enable prev/next buttons based on current page
        document.getElementById('prev-btn').disabled = currentPage === 1;
        document.getElementById('next-btn').disabled = currentPage === totalPages;
    }

    // Function to simulate loading page content
    function loadPageContent(page) {
        console.log(`Loading content for page ${page}`);
        // You can replace this with logic to fetch and display actual content
    }

    // Initialize pagination on page load
    updatePagination();