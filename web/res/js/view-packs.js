window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const packIndex = parseInt(params.get('pack')) - 1; // Adjust for 0-based index

    if (!packs || isNaN(packIndex) || packIndex < 0 || packIndex >= packs.length) {
      alert("Invalid pack selected.");
      return;
    }

    const pack = packs[packIndex];

    // Replace title and description
    document.querySelector('main h2').textContent = pack.title;
    document.querySelector('main p').textContent = pack.description;

    // Replace cards
    const cardsList = document.getElementById('cardsList');
    cardsList.innerHTML = ''; // Clear static cards

    // Card View Sub Button
    document.querySelector('#view-all').textContent = `View All Cards (₦${(pack.price).toLocaleString("en", {minimumFractionDigits: 2, maximumFractionDigits: 2})})`;

    const previewSize = 3
    // After cards are rendered
    const hiddenCount = pack.totalCards - previewSize;
    if (hiddenCount > 0) {
        document.getElementById('hiddenCount').textContent = `${hiddenCount} card${hiddenCount > 1 ? 's' : ''} hidden`;
    }

    pack.cards.slice(0, previewSize).forEach((card, i) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'bg-white p-4 border rounded shadow';

      cardEl.innerHTML = `
        <h3 class="font-semibold text-lg mb-1">Step ${i + 1}: ${card.title}</h3>
        <p class="text-gray-700">${card.content}</p>
      `;

      cardsList.appendChild(cardEl);
    });

    document.querySelector('#view-all').addEventListener("click", () => {
      Swal.fire({
        icon: "error",
        title: "Insufficient Balance.",
        text: "Your balance is too low to go through all the cards in this pack.",
      })
    })
});