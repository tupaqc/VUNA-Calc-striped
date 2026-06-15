// ===============================
// 🏇 BETTING ODDS CALCULATOR
// ===============================

let currentOddsFormat = "fractional";

function setOddsFormat(format) {
  currentOddsFormat = format;

  document.querySelectorAll(".odds-format-btn").forEach(function (btn) {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  document.getElementById("fractional-inputs").style.display =
    format === "fractional" ? "block" : "none";
  document.getElementById("decimal-inputs").style.display =
    format === "decimal" ? "block" : "none";
  document.getElementById("moneyline-inputs").style.display =
    format === "moneyline" ? "block" : "none";

  calculateOdds();
}

function gcd(a, b) {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    var t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function decimalToFractional(decimal) {
  if (decimal <= 1) return { num: 0, den: 1 };

  var profit = decimal - 1;
  var bestNum = 1;
  var bestDen = 1;
  var bestError = Math.abs(profit - bestNum / bestDen);

  for (var den = 1; den <= 100; den++) {
    var num = Math.round(profit * den);
    var error = Math.abs(profit - num / den);
    if (error < bestError) {
      bestError = error;
      bestNum = num;
      bestDen = den;
    }
  }

  var g = gcd(bestNum, bestDen);
  return { num: bestNum / g, den: bestDen / g };
}

function decimalToMoneyline(decimal) {
  if (decimal >= 2) {
    return "+" + Math.round((decimal - 1) * 100);
  } else {
    return "-" + Math.round(100 / (decimal - 1));
  }
}

function fractionalToDecimal(num, den) {
  if (den === 0) return 1;
  return num / den + 1;
}

function moneylineToDecimal(ml) {
  ml = parseFloat(ml);
  if (isNaN(ml)) return 0;
  if (ml > 0) {
    return ml / 100 + 1;
  } else {
    return 100 / Math.abs(ml) + 1;
  }
}

function calculateOdds() {
  var decimal = 0;

  if (currentOddsFormat === "fractional") {
    var num = parseFloat(document.getElementById("frac-num").value) || 0;
    var den = parseFloat(document.getElementById("frac-den").value) || 1;
    decimal = fractionalToDecimal(num, den);
  } else if (currentOddsFormat === "decimal") {
    decimal = parseFloat(document.getElementById("dec-val").value) || 0;
  } else if (currentOddsFormat === "moneyline") {
    decimal = moneylineToDecimal(document.getElementById("ml-val").value);
  }

  if (decimal <= 1) {
    document.getElementById("res-fractional").textContent = "—";
    document.getElementById("res-decimal").textContent = "—";
    document.getElementById("res-moneyline").textContent = "—";
    document.getElementById("res-probability").textContent = "—";
    document.getElementById("res-return").textContent = "—";
    document.getElementById("res-profit").textContent = "—";
    return;
  }

  var frac = decimalToFractional(decimal);
  var ml = decimalToMoneyline(decimal);
  var probability = (1 / decimal) * 100;

  document.getElementById("res-fractional").textContent =
    frac.num + "/" + frac.den;
  document.getElementById("res-decimal").textContent = decimal.toFixed(2);
  document.getElementById("res-moneyline").textContent = ml;
  document.getElementById("res-probability").textContent =
    probability.toFixed(1) + "%";

  var stake = parseFloat(document.getElementById("stake-val").value) || 0;
  if (stake > 0) {
    var totalReturn = stake * decimal;
    var profit = totalReturn - stake;
    document.getElementById("res-return").textContent =
      "$" + totalReturn.toFixed(2);
    document.getElementById("res-profit").textContent =
      "$" + profit.toFixed(2);
  } else {
    document.getElementById("res-return").textContent = "—";
    document.getElementById("res-profit").textContent = "—";
  }
}
