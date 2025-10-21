function temperatureConverter() {
  const input = prompt('請輸入溫度與單位（例如 30C 或 86F）：');
  let resultText = '';

  if (!input) {
    resultText = '已取消輸入。';
  } else {
    const match = input.match(/^([-+]?[0-9]*\.?[0-9]+)([cCfF])$/);
    if (!match) {
      resultText = '格式錯誤，請輸入數字加上 C 或 F，例如 30C 或 86F';
    } else {
      const value = parseFloat(match[1]);
      const unit = match[2].toUpperCase();
      let result = '';

      if (unit === 'C') {
        const f = value * 9 / 5 + 32;
        result = `${value}°C = ${f.toFixed(2)}°F`;
      } else {
        const c = (value - 32) * 5 / 9;
        result = `${value}°F = ${c.toFixed(2)}°C`;
      }

      resultText = `轉換結果：\n${result}`;
    }
  }

  console.log(resultText);
  document.getElementById('result').textContent = resultText;
}

function guessNumberGame() {
  const answer = Math.floor(Math.random() * 100) + 1;
  let count = 0;
  let message = '';
  let guess;

  while (true) {
    guess = prompt('請猜 1 到 100 之間的數字：');
    if (guess === null) {
      message = '遊戲取消。';
      break;
    }

    guess = parseInt(guess);
    count++;

    if (isNaN(guess) || guess < 1 || guess > 100) {
      alert('請輸入有效的數字（1 到 100）');
      continue;
    }

    if (guess < answer) {
      alert('再大一點');
    } else if (guess > answer) {
      alert('再小一點');
    } else {
      message = `恭喜你答對了！答案是 ${answer}\n你總共猜了 ${count} 次。`;
      break;
    }
  }

  console.log(message);
  document.getElementById('result').textContent = message;
}
// 🔽 延伸功能選單
function showExtendedMenu() {
  let choice = prompt("延伸功能選單：\n1. 矩陣加法\n0. 返回");

  if (choice === null || choice === "0") {
    return; // 回主畫面
  }

  switch (choice) {
    case "1":
      matrixAddition();
      break;
    default:
      alert("請輸入有效選項");
      showExtendedMenu(); // 重新叫出子選單
  }
}

// 🔽 矩陣加法功能（巢狀迴圈 + 模組化）
function matrixAddition() {
  let rows = parseInt(prompt("請輸入矩陣列數（如 2）："));
  let cols = parseInt(prompt("請輸入矩陣行數（如 2）："));
  if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
    alert("請輸入正整數");
    return;
  }

  const matrixA = inputMatrix(rows, cols, "A");
  const matrixB = inputMatrix(rows, cols, "B");
  const result = addMatrices(matrixA, matrixB);

  const resultText = formatMatrix(matrixA, "矩陣 A") +
                     '\n' + formatMatrix(matrixB, "矩陣 B") +
                     '\n' + formatMatrix(result, "A + B");

  displayResult(resultText);
}

function inputMatrix(rows, cols, name) {
  const matrix = [];
  for (let i = 0; i < rows; i++) {
    matrix[i] = [];
    for (let j = 0; j < cols; j++) {
      let val = parseFloat(prompt(`請輸入 ${name}[${i + 1},${j + 1}]的數字：`));
      matrix[i][j] = isNaN(val) ? 0 : val;
    }
  }
  return matrix;
}

function addMatrices(m1, m2) {
  const result = [];
  for (let i = 0; i < m1.length; i++) {
    result[i] = [];
    for (let j = 0; j < m1[0].length; j++) {
      result[i][j] = m1[i][j] + m2[i][j];
    }
  }
  return result;
}

function formatMatrix(matrix, title) {
  let text = `${title}：\n`;
  for (let row of matrix) {
    text += row.map(n => n.toFixed(2).padStart(6)).join(" ") + "\n";
  }
  return text;
}

function displayResult(text) {
  console.log(text);
  document.getElementById("result").textContent = text;
}
