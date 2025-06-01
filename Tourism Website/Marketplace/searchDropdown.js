(function() {
  // Expanded dataset including hotels, restaurants, game drives, and marketplace items
  const dataset = [
    // Marketplace items
    { title: "Handmade Beaded Necklace", url: "MarketplaceRegistered.html#handmade-beaded-necklace" },
    { title: "Decorated Ostrich Egg", url: "MarketplaceRegistered.html#ostrich-egg" },
    { title: "Recycled Bottle Ornament", url: "MarketplaceRegistered.html#recycled-ornament" },
    { title: "Woven Basket", url: "MarketplaceRegistered.html#woven-basket" },
    { title: "Painted Tribal Drum", url: "MarketplaceRegistered.html#painted-drum" },
    { title: "Woven Tribal Wallet", url: "MarketplaceRegistered.html#woven-wallet" },
    { title: "Traditional Clay Pot", url: "MarketplaceRegistered.html#clay-pot" },
    { title: "African Wooden Mask", url: "MarketplaceRegistered.html#wooden-mask" },
    { title: "Tswana Pottery", url: "MarketplaceRegistered.html#tswana-pottery" },

    // Hotels
    { title: "Belmond Savute Elephant Lodge", url: "../Book/HotelCatalogueRegistered.html#Belmond-Savute-Elephant-Lodge" },
    { title: "Xigera Safari Lodge", url: "../Book/HotelCatalogueRegistered.html#Xigera-Safari-Lodge" },
    { title: "Qorokwe Camp", url: "../Book/HotelCatalogueRegistered.html#Qorokwe-Camp" },
    { title: "Sanctuary Chief’s Camp", url: "../Book/HotelCatalogueRegistered.html#Sanctuary-Chiefs-Camp" },
    { title: "Leroo La Tau", url: "../Book/HotelCatalogueRegistered.html#Leroo-La-Tau" },
    { title: "Kanana Camp", url: "../Book/HotelCatalogueRegistered.html#Kanana-Camp" },

    // Restaurants
    { title: "Sanitas Tea Garden", url: "../Book/RestaurantCatalogueRegistered.html#Sanitas-Tea-Garden" },
    { title: "Bull & Bush Pub", url: "../Book/RestaurantCatalogueRegistered.html#Bull-Bush-Pub" },
    { title: "Moremi Dining Room", url: "../Book/RestaurantCatalogueRegistered.html#Moremi-Dining-Room" },
    { title: "The Savanna Grill", url: "../Book/RestaurantCatalogueRegistered.html#The-Savanna-Grill" },
    { title: "Kalahari Bistro", url: "../Book/RestaurantCatalogueRegistered.html#Kalahari-Bistro" },
    { title: "Okavango Seafood House", url: "../Book/RestaurantCatalogueRegistered.html#Okavango-Seafood-House" },

    // Game Drives
    { title: "Okavango Delta Safari", url: "../Book/GameDriveCatalogueRegistered.html#Okavango-Delta-Safari" },
    { title: "Chobe National Park Adventure", url: "../Book/GameDriveCatalogueRegistered.html#Chobe-National-Park-Adventure" },
    { title: "Makgadikgadi Pans Exploration", url: "../Book/GameDriveCatalogueRegistered.html#Makgadikgadi-Pans-Exploration" },
    { title: "Moremi Game Reserve Encounter", url: "../Book/GameDriveCatalogueRegistered.html#Moremi-Game-Reserve-Encounter" },
    { title: "Nxai Pan Safari Trail", url: "../Book/GameDriveCatalogueRegistered.html#Nxai-Pan-Safari-Trail" },

    // News Articles from newsRegistered.html
    { title: "Air Botswana Announces New Direct Flights to Victoria Falls", url: "../Current-Affairs/newsRegistered.html#article1" },
    { title: "New Eco-Luxury Lodge Opens in the Kalahari", url: "../Current-Affairs/newsRegistered.html#article2" },
    { title: "Maun Cultural Festival Returns With Expanded Program", url: "../Current-Affairs/newsRegistered.html#article3" },
    { title: "New App Simplifies Safari Bookings Across Southern Africa", url: "../Current-Affairs/newsRegistered.html#article4" },
    { title: "Record Rhino Births Reported in Moremi Game Reserve", url: "../Current-Affairs/newsRegistered.html#article5" },
    { title: "Survey Reveals Growing Demand for Authentic Cultural Experiences", url: "../Current-Affairs/newsRegistered.html#article6" },

    // News Articles from newspage2Registered.html
    { title: "Luxury Glamping Resort Opens in Makgadikgadi Pans", url: "../Current-Affairs/newspage2Registered.html#article1" },
    { title: "Gaborone Food Festival Celebrates Local Cuisine", url: "../Current-Affairs/newspage2Registered.html#article2" },
    { title: "New Safari Guide Training Program Launches", url: "../Current-Affairs/newspage2Registered.html#article3" },
    { title: "New Adventure Tourism Routes Launched in Northern Botswana", url: "../Current-Affairs/newspage2Registered.html#article4" },
    { title: "Botswana Launches Digital Nomad Visa Program", url: "../Current-Affairs/newspage2Registered.html#article5" },
    { title: "Okavango Delta Lodges Pioneer Zero-Waste Tourism", url: "../Current-Affairs/newspage2Registered.html#article6" },

    // Events from EventsRegistered.html
    { title: "Kuru Dance Festival", url: "../Events/EventsRegistered.html#event1" },
    { title: "Toyota Desert Race", url: "../Events/EventsRegistered.html#event2" },
    { title: "Dithubaruba Cultural Festival", url: "../Events/EventsRegistered.html#event3" },
    { title: "Okavango Delta Safari", url: "../Events/EventsRegistered.html#event4" },
    { title: "Chobe River Boat Cruise", url: "../Events/EventsRegistered.html#event5" },
    { title: "Makgadikgadi Pans Stargazing Night", url: "../Events/EventsRegistered.html#event6" },

    // Other existing items
    { title: "Book a Tour", url: "../Book/BookRegistered.html" }
  ];

  const input = document.getElementById('navSearchInput');
  const dropdown = document.getElementById('searchDropdown');

  function clearDropdown() {
    dropdown.innerHTML = '';
    dropdown.classList.add('hidden');
  }

  function showDropdown(results) {
    dropdown.innerHTML = '';
    if (results.length === 0) {
      clearDropdown();
      return;
    }
    dropdown.classList.add('text-black'); // Add text-black class to dropdown div for better specificity
    results.forEach(item => {
      const div = document.createElement('div');
      // Added text color for visibility
      div.className = 'px-4 py-2 cursor-pointer hover:bg-gray-200 text-black';
      div.textContent = item.title;
      div.addEventListener('click', () => {
        window.location.href = item.url;
      });
      dropdown.appendChild(div);
    });
    dropdown.classList.remove('hidden');
  }

  function search(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    return dataset.filter(item => item.title.toLowerCase().includes(lowerKeyword));
  }

  input.addEventListener('input', () => {
    const query = input.value.trim();
    if (query.length === 0) {
      clearDropdown();
      return;
    }
    const results = search(query);
    showDropdown(results);
  });

  // Hide dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!document.getElementById('search-container').contains(e.target)) {
      clearDropdown();
    }
  });

  // Optional: handle search button click to redirect to first result or do nothing
  document.getElementById('navSearchButton').addEventListener('click', () => {
    const query = input.value.trim();
    if (query.length === 0) return;
    const results = search(query);
    if (results.length > 0) {
      window.location.href = results[0].url;
    }
  });
})();
