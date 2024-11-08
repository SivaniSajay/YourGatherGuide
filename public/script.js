let selectedItems = [];
let totalAmount = 0;
let userBudget = 1500000; // Default budget; will be updated from the server
const budgetItemsContainer = document.getElementById("budgetItems");
const budgetWarning = document.getElementById("budgetWarning");
const expenseBreakdownContainer = document.getElementById("expenseBreakdown");
const budgetManagement = document.getElementById("budgetManagement");
const userGreeting = document.getElementById("userGreeting");

let expenseChart; // Declare the chart variable

// Function to fetch data from the server
function fetchBudgetData() {
  fetch('/getBudgetData')
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        userGreeting.textContent = 'Error fetching data.';
        console.error(data.error);
        return;
      }

      selectedItems = data.selectedItems.filter(item => item.item && !isNaN(item.price));
      userBudget = data.userBudget;
      userGreeting.textContent = `Welcome, ${data.username}!`;
      updateBudgetDisplay();
    })
    .catch(error => {
      console.error('Error fetching budget data:', error);
      userGreeting.textContent = 'An error occurred while fetching data.';
    });
}

function updateBudgetDisplay() {
  budgetItemsContainer.innerHTML = "";  // Clear existing items
  totalAmount = selectedItems.reduce((sum, item) => sum + item.price, 0);

  selectedItems.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${item.category}</h3>
      <p><i class="fas fa-tag"></i> Item: ${item.item}</p>
      <p><i class="fas fa-rupee-sign"></i> Price: ₹${item.price}</p>
      <p><i class="fas fa-percentage"></i> Percentage of Total: ${(item.price / totalAmount * 100).toFixed(2)}%</p>
    `;
    budgetItemsContainer.appendChild(card);
  });

  document.getElementById("totalAmount").textContent = `₹${totalAmount}`;

  // Check if total exceeds user budget
  if (totalAmount > userBudget) {
    budgetWarning.style.display = "block";
  } else {
    budgetWarning.style.display = "none";
  }
}

function showExpenseBreakdown() {
  budgetManagement.style.display = "none";
  expenseBreakdownContainer.style.display = "block";

  const labels = selectedItems.map(item => item.category);
  const data = selectedItems.map(item => item.price);

  // Destroy previous chart instance if it exists
  if (expenseChart && typeof expenseChart.destroy === 'function') {
    expenseChart.destroy();
  }

  const ctx = document.getElementById('expenseChart').getContext('2d');

  expenseChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Expense Breakdown',
        data: data,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#C9CBCF', '#FFCD56', '#4D5360', '#46BFBD'
        ],
      }],
    },
    options: {
      responsive: true,
      legend: {
        position: 'top',
        labels: { fontColor: 'white', fontSize: 14 },
      },
      title: {
        display: true,
        text: 'Expense Breakdown by Category',
        fontColor: 'white',
        fontSize: 20,
      }
    }
  });
}

document.getElementById("showBreakdown").addEventListener("click", function(e) {
  e.preventDefault();
  showExpenseBreakdown();
});

document.getElementById("backToBudget").addEventListener("click", function(e) {
  e.preventDefault();
  budgetManagement.style.display = "block";
  expenseBreakdownContainer.style.display = "none";
});

document.getElementById("proceedButton").addEventListener("click", function() {
  alert("Proceeding with your current selections.");
});

document.getElementById("chooseAlternativeButton").addEventListener("click", function() {
  window.location.href = "alternative-options.html";
});

// Fetch data from the server when the page loads
fetchBudgetData();
