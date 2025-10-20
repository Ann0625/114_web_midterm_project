// example5_script.js
// 以巢狀 for 產生 1~9 的乘法表

// 輸入起始與結束值
var start = parseInt(prompt('請輸入起始數字（2~5）：'), 10);
var end = parseInt(prompt('請輸入結束數字（2~5）：'), 10);

var output = '【乘法表：' + start + ' 到 ' + end + '】\n\n';

if (isNaN(start) || isNaN(end) || start < 1 || end > 9 || start > end) {
  output = '輸入錯誤，請輸入 1～9 的整數範圍，且起始值不能大於結束值！';
} else {
  // 巢狀 for 產生指定範圍的乘法表
  for (var i = start; i <= end; i++) {
    for (var j = 1; j <= 9; j++) {
      output += i + 'x' + j + '=' + (i * j) + '\t';
    }
    output += '\n';
  }
}

document.getElementById('result').textContent = output;
