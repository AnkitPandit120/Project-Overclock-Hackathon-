// 🔹 Load saved data from localStorage or initialize empty if not present
let members = JSON.parse(localStorage.getItem("members")) || [];
let balances = JSON.parse(localStorage.getItem("balances")) || {};
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// 🔹 Save current data to localStorage
function saveData() {
  localStorage.setItem("members", JSON.stringify(members));
  localStorage.setItem("balances", JSON.stringify(balances));
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// 🔹 Add a new member to the group
function addMember() {
  const name = document.getElementById("memberName").value.trim(); // Get entered name
  if (!name || members.includes(name)) return; // Prevent empty or duplicate names

  members.push(name); // Add to members array
  balances[name] = 0; // Initialize their balance
  saveData(); // Persist changes

  updateUI(); // Refresh UI
  document.getElementById("memberName").value = ""; // Clear input
}

// 🔹 Update the UI for members and payer dropdown
function updateUI() {
  const list = document.getElementById("memberList");
  const payer = document.getElementById("payer");

  list.innerHTML = ""; // Clear member list
  payer.innerHTML = ""; // Clear payer dropdown

  // Add each member to the list and dropdown
  members.forEach(member => {
    const li = document.createElement("li");
    li.textContent = member;
    list.appendChild(li);

    const option = document.createElement("option");
    option.value = member;
    option.textContent = member;
    payer.appendChild(option);
  });

  updateBalances(); // Show updated balances
}

// 🔹 Add a new expense and update balances
function addExpense() {
  const payer = document.getElementById("payer").value; // Who paid?
  const amount = parseFloat(document.getElementById("amount").value); // How much?
  if (!payer || !amount || members.length === 0) return; // Validate input

  const split = amount / members.length; // Split amount equally

  // Update each member's balance
  members.forEach(member => {
    if (member === payer) balances[member] += amount - split; // Payer gets credit
    else balances[member] -= split; // Others owe their share
  });

  expenses.push({ payer, amount }); // Record expense
  saveData(); // Persist changes

  document.getElementById("amount").value = ""; // Clear input
  updateBalances(); // Refresh balances
}

// 🔹 Show each member's balance in the UI
function updateBalances() {
  const list = document.getElementById("balances");
  list.innerHTML = "";

  // For each member, show their balance with color coding
  for (let person in balances) {
    const li = document.createElement("li");
    li.textContent = `${person}: ₹${balances[person].toFixed(2)}`;
    li.className = balances[person] >= 0 ? "balance-positive" : "balance-negative";
    list.appendChild(li);
  }
}

// 🔹 Simplify debts: minimize number of transactions to settle up
function simplify() {
  const results = document.getElementById("results");
  results.innerHTML = "";

  let creditors = [], debtors = [];

  // Split members into creditors (positive balance) and debtors (negative balance)
  for (let p in balances) {
    if (balances[p] > 0) creditors.push({ name: p, amount: balances[p] });
    if (balances[p] < 0) debtors.push({ name: p, amount: balances[p] });
  }

  // Sort so largest creditors/debtors are matched first
  creditors.sort((a,b)=>b.amount-a.amount);
  debtors.sort((a,b)=>a.amount-b.amount);

  let i=0,j=0;

  // Greedily match debtors to creditors
  while (i<debtors.length && j<creditors.length) {
    let pay = Math.min(-debtors[i].amount, creditors[j].amount); // Amount to settle

    // Show transaction in UI
    const li = document.createElement("li");
    li.textContent = `${debtors[i].name} pays ₹${pay.toFixed(2)} to ${creditors[j].name}`;
    results.appendChild(li);

    // Update balances
    debtors[i].amount += pay;
    creditors[j].amount -= pay;

    // Move to next debtor/creditor if settled
    if (Math.abs(debtors[i].amount) < 0.01) i++;
    if (Math.abs(creditors[j].amount) < 0.01) j++;
  }
}

// 🔹 Export all data as a JSON file for backup or sharing
function exportData() {
  const data = { members, balances, expenses };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "expense-data.json";
  a.click();
}

// 🔹 Import data from a JSON file and update the app
function importData() {
  const file = document.getElementById("importFile").files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const data = JSON.parse(e.target.result); // Parse imported data
    members = data.members || [];
    balances = data.balances || {};
    expenses = data.expenses || [];
    saveData(); // Save imported data
    updateUI(); // Refresh UI
  };
  reader.readAsText(file);
}

// 🔹 Reset all data and reload the app
function resetAll() {
  if (!confirm("Clear all data?")) return; // Confirm with user
  localStorage.clear(); // Remove all saved data
  location.reload(); // Reload page
}

// 🔹 Restore UI on load (when page is opened or refreshed)
window.onload = updateUI;
