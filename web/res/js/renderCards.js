function formatReviews(num) {
    if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + "M";
    }
    if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + "k";
    }
    return num.toString();
}

function createStarIcons(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
        stars += `<svg class="w-5 h-5 fill-current text-yellow-400" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.562-.955L10 0l2.948 5.955 6.562.955-4.755 4.635 1.123 6.545z"/></svg>`;
    } else {
        stars += `<svg class="w-5 h-5 fill-current text-gray-300" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.562-.955L10 0l2.948 5.955 6.562.955-4.755 4.635 1.123 6.545z"/></svg>`;
    }
    }
    return stars;
}

function filterPacks() {
    const searchText = document.getElementById("searchInput").value.toLowerCase();
    const category = document.getElementById("categoryFilter").value;
    const filtered = packs.filter(pack => {
    const matchesCategory = category === "" || pack.category === category;
    const matchesSearch = pack.title.toLowerCase().includes(searchText) || pack.description.toLowerCase().includes(searchText);
    return matchesCategory && matchesSearch;
    });
    renderPacks(filtered);
}

function renderPacks(filteredPacks) {
    const container = document.getElementById("packsGrid");
    container.innerHTML = "";
    if (filteredPacks.length === 0) {
    container.innerHTML = '<p class="col-span-full text-center text-gray-500">No packs found.</p>';
    return;
    }
    filteredPacks.forEach((pack, index) => {
    const card = document.createElement("div");
    card.className = "bg-white shadow rounded-lg p-6 border border-gray-200 flex flex-col justify-between cursor-pointers hover:shadow-lg transition relative";
    
    // Clicking card except download triggers view-pack redirect
    /*
    card.addEventListener("click", (e) => {
        if (!e.target.closest("button")) {
        // Redirect with URL encoded title param
        window.location.href = `view-pack.html?title=${encodeURIComponent(pack.title)}`;
        }
    });*/

    card.innerHTML = `
    <div>
        <h3 class="text-lg font-semibold text-indigo-600 mb-1">${pack.title}</h3>
        <p class="text-gray-700 mb-3">${pack.description}</p>
    </div>
    <div class="mt-auto flex items-center justify-between">
        <div class="text-indigo-600 font-semibold text-lg">₦${(pack.price).toLocaleString("en", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
        <div class="flex items-center space-x-2 text-yellow-400">
        <div class="flex" style="display:none">${createStarIcons(pack.rating)}</div>
        <div class="text-gray-600 text-sm" style="display:none">(${formatReviews(pack.reviews)})</div>
        <div class="text-gray-600 text-sm">(${formatReviews(pack.totalCards)} cards)</div>
        </div>
        <div class="mt-auto flex flex-col items-start justify-start space-y-2">
        <!-- Preview Button -->
        <a href="/view-pack?pack=${index + 1}">
            <button
            class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm flex items-center space-x-1"
            aria-label="Preview pack"
            title="Preview pack"
            >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" />
            </svg>
            <span>View Cards</span>
            </button>
        </a>

        <!-- Download Button -->
        <button style="display:none"
            class="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm flex items-center space-x-1"
            aria-label="Download pack"
            title="Download pack"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
            </svg>
            <span>Download</span>
        </button>
        </div>
    </div>
    `;

    // Handle download button click separately
    const downloadBtn = card.querySelector("button");
    /*
    downloadBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        showDownloadModal(pack);
    });*/

    container.appendChild(card);
    });
}
