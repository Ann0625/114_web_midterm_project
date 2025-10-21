// lab_score_calculator.js
// 以 prompt 取得五科成績，計算平均、等第，並判斷是否有不及格

function toNumber(str) {
  var n = parseFloat(str);
  return isNaN(n) ? null : n;
}

function gradeFrom(avg) {
  if (avg >= 90) {
    return 'A';
  } else if (avg >= 80) {
    return 'B';
  } else if (avg >= 70) {
    return 'C';
  } else if (avg >= 60) {
    return 'D';
  } else {
    return 'F';
  }
}

var name = prompt('請輸入姓名：');
if (!name) {
  name = '同學';
}

// 讀入五科成績
var s1 = toNumber(prompt('請輸入 國文 成績：'));
var s2 = toNumber(prompt('請輸入 英文 成績：'));
var s3 = toNumber(prompt('請輸入 數學 成績：'));
var s4 = toNumber(prompt('請輸入 自然 成績：'));
var s5 = toNumber(prompt('請輸入 社會 成績：'));

// 檢查輸入是否有效
var scores = [s1, s2, s3, s4, s5];
var subjects = ['國文', '英文', '數學', '自然', '社會'];

var text = '';
var hasInvalid = scores.some(score => score === null);

if (hasInvalid) {
  text = 'Wrong';
} else {
  // 計算平均
  var sum = 0;
  var hasFail = false;

  for (var i = 0; i < scores.length; i++) {
    sum += scores[i];
    if (scores[i] < 60) {
      hasFail = true;
    }
  }

  var avg = sum / scores.length;
  var grade = gradeFrom(avg);

  // 輸出結果
  text = '姓名：' + name + '\n';
  for (var i = 0; i < subjects.length; i++) {
    text += subjects[i] + '：' + scores[i] + '\n';
  }
  text += '平均：' + avg.toFixed(2) + '\n';
  text += '等第：' + grade;

  if (hasFail) {
    text += '\n 有不及格的項目';
  }
}

console.log(text);
document.getElementById('result').textContent = text;