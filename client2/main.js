document.addEventListener('DOMContentLoaded', () => {

  const upButton = document.getElementById('vote-up');
  const downButton = document.getElementById('vote-down');
  const resetButton = document.getElementById('reset-button');
  
  const upCount = document.getElementById('count-up');
  const downCount = document.getElementById('count-down');
  
  const totalVotes = document.getElementById('total-votes');
  const rating = document.getElementById('rating');

  let voting = false;

  function updateUI(votes) {
    const total = votes.up + votes.down;
    const percent = total > 0 ? Math.round((votes.up / total) * 100) : 0;

    upCount.textContent = votes.up;
    downCount.textContent = votes.down;
    totalVotes.textContent = total;
    rating.textContent = percent;
  }
  
  async function fetchVotes() {
    const response = await fetch('/api/votes');
    const votes = await response.json();
    updateUI(votes);
  }

  // Sends a vote to the backend
  async function vote(type) {
    if (voting) return;
    voting = true;
    upButton.disabled = true;
    downButton.disabled = true;

    try {
      const response = await fetch(`/api/votes/${type}`, {
        method: "POST",
      });
      const votes = await response.json();
      updateUI(votes);
    } finally {
      voting = false;
      upButton.disabled = false;
      downButton.disabled = false;
    }
  }

  async function reset() {
    await fetch('/api/votes', { method: "DELETE" });
    await fetchVotes();
  }

  upButton.addEventListener('click', () => vote('up'));
  downButton.addEventListener('click', () => vote('down'));
  resetButton.addEventListener('click', reset);

  fetchVotes();
});