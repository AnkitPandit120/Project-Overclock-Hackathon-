

// Stores all member names
let members = [];

// Stores each member's balance
// Example: { "Vansh": 200, "Aman": -200 }
let balances = {};

// Stores expense history (optional future use)
let expenses = [];



// Add Member Function

function addMember() {

  // Get name from input field
  const name = document.getElementById("memberName").value.trim();

  // Prevent empty or duplicate names
  if (!name || members.includes(name)) return;

  // Add member and initialize balance
  members.push(name);
  balances[name] = 0;

  // Refresh UI
  updateUI();

  // Clear input field
  document.getElementById("memberName").value = "";
}


// ===============================
// Update UI (Members + Dropdown)
// ===============================
function updateUI() {
  const list = document.getElementById("memberList");
  const payer = document.getElementById("payer");

  // Clear old UI
  list.innerHTML = "";
  payer.innerHTML = "";

  // Rebuild member list & dropdown
  members.forEach(member => {

    // Show member name
    const li = document.createElement("li");
    li.textContent = member;
    list.appendChild(li);

    // Add member to payer dropdown
    const option = document.createElement("option");
    option.value = member;
    option.textContent = member;
    payer.appendChild(option);
  });

  // Update balances display
  updateBalances();
}


// ===============================
// Add Expense
// ===============================
function addExpense() {

  // Who paid?
  const payer = document.getElementById("payer").value;

  // Expense amount
  const amount = parseFloat(document.getElementById("amount").value);

  // Validation
  if (!payer || !amount || members.length === 0) return;

  // Split amount equally
  const split = amount / members.length;

  // Update balances
  members.forEach(member => {
    if (member === payer) {
      // Payer gets credit
      balances[member] += amount - split;
    } else {
      // Others owe money
      balances[member] -= split;
    }
  });

  // Clear input
  document.getElementById("amount").value = "";

  // Refresh balances
  updateBalances();
}


// ===============================
// Display Balances
// ===============================
function updateBalances() {
  const list = document.getElementById("balances");
  list.innerHTML = "";

  // Show each person's balance
  for (let person in balances) {
    const li = document.createElement("li");

    li.textContent = `${person}: ₹${balances[person].toFixed(2)}`;

    // Color coding
    li.className =
      balances[person] >= 0 ? "balance-positive" : "balance-negative";

    list.appendChild(li);
  }
}


// ===============================
// Debt Simplification Algorithm
// ===============================
function simplify() {

  const results = document.getElementById("results");
  results.innerHTML = "";

  let creditors = []; // People who should receive money
  let debtors = [];   // People who owe money

  // Separate creditors and debtors
  for (let p in balances) {
    if (balances[p] > 0) creditors.push({ name: p, amount: balances[p] });
    if (balances[p] < 0) debtors.push({ name: p, amount: balances[p] });
  }

  // Sort to match highest debts first
  creditors.sort((a,b)=>b.amount-a.amount);
  debtors.sort((a,b)=>a.amount-b.amount);

  let i = 0, j = 0;

  // Greedy algorithm to minimize transactions
  while (i < debtors.length && j < creditors.length) {

    let debt = Math.abs(debtors[i].amount);
    let credit = creditors[j].amount;

    // Minimum amount to settle
    let pay = Math.min(debt, credit);

    // Display settlement
    const li = document.createElement("li");
    li.textContent = `${debtors[i].name} pays ₹${pay.toFixed(2)} to ${creditors[j].name}`;
    results.appendChild(li);

    // Update remaining balances
    debtors[i].amount += pay;
    creditors[j].amount -= pay;

    // Move to next if settled
    if (Math.abs(debtors[i].amount) < 0.01) i++;
    if (Math.abs(creditors[j].amount) < 0.01) j++;
  }
}