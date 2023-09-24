"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intParser = exports.wait = exports.generateTimeBasedOnNow = exports.devLog = void 0;
function devLog(...args) {
    if (process.env.NODE_ENV !== 'production') {
        console.log(...args);
    }
}
exports.devLog = devLog;
function generateTimeBasedOnNow() {
    const now = new Date();
    // 분과 초를 문자열로 변환하여 앞에서 2자리로 만듭니다.
    const minuteStr = String(now.getMinutes()).padStart(2, '0');
    const secondStr = String(now.getSeconds()).padStart(2, '0');
    // 0에서 99999 사이의 랜덤한 숫자를 생성합니다.
    const randomFiveDigits = Math.floor(Math.random() * 100000);
    // 최종 time 값을 생성합니다.
    const time = parseInt(minuteStr + secondStr + String(randomFiveDigits), 10);
    return time;
}
exports.generateTimeBasedOnNow = generateTimeBasedOnNow;
function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.wait = wait;
function intParser(value) {
    // 만약 value가 string이라면 숫자로 파싱한 후 정수로 변환합니다.
    if (typeof value === 'string') {
        value = parseFloat(value);
    }
    // 남은 코드는 기존과 동일합니다.
    return Math.floor(value);
}
exports.intParser = intParser;
//  function leftPad(str: string, length: number, char: string = '0'): string {
// 	while (str.length < length) {
// 	  str = char + str;
// 	}
// 	return str;
//  }
//# sourceMappingURL=helper.js.map