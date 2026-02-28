


let members = [];



let balances = {};

let expenses = [];





function addMember() {


  const name = document.getElementById("memberName").value.trim();


  if (!name || members.includes(name)) return;


  members.push(name);
  balances[name] = 0;

  updateUI();

  document.getElementById("memberName").value = "";
}


function updateUI() {
  const list = document.getElementById("memberList");
  const payer = document.getElementById("payer");


  list.innerHTML = "";
  payer.innerHTML = "";

  members.forEach(member => {


    const li = document.createElement("li");
    li.textContent = member;
    list.appendChild(li);

    
    const option = document.createElement("option");
    option.value = member;
    option.textContent = member;
    payer.appendChild(option);
  });

  updateBalances();
}


function addExpense() {

  const payer = document.getElementById("payer").value;

  const amount = parseFloat(document.getElementById("amount").value);

  if (!payer || !amount || members.length === 0) return;


  const split = amount / members.length;

  members.forEach(member => {
    if (member === payer) {
      balances[member] += amount - split;
    } else {
      balances[member] -= split;
    }
  });

  document.getElementById("amount").value = "";

  updateBalances();
}


function updateBalances() {
  const list = document.getElementById("balances");
  list.innerHTML = "";

  for (let person in balances) {
    const li = document.createElement("li");

    li.textContent = `${person}: ₹${balances[person].toFixed(2)}`;

    li.className =
      balances[person] >= 0 ? "balance-positive" : "balance-negative";

    list.appendChild(li);
  }
}


function simplify() {

  const results = document.getElementById("results");
  results.innerHTML = "";

  let creditors = []; 
  let debtors = [];   
  for (let p in balances) {
    if (balances[p] > 0) creditors.push({ name: p, amount: balances[p] });
    if (balances[p] < 0) debtors.push({ name: p, amount: balances[p] });
  }

  
  creditors.sort((a,b)=>b.amount-a.amount);
  debtors.sort((a,b)=>a.amount-b.amount);

  let i = 0, j = 0;


  while (i < debtors.length && j < creditors.length) {

    let debt = Math.abs(debtors[i].amount);
    let credit = creditors[j].amount;

  
    let pay = Math.min(debt, credit);

    const li = document.createElement("li");
    li.textContent = `${debtors[i].name} pays ₹${pay.toFixed(2)} to ${creditors[j].name}`;
    results.appendChild(li);

  
    debtors[i].amount += pay;
    creditors[j].amount -= pay;

  
    if (Math.abs(debtors[i].amount) < 0.01) i++;
    if (Math.abs(creditors[j].amount) < 0.01) j++;
  }
}
