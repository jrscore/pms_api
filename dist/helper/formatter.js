"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormattedDate = void 0;
// yy-mm0dd-hh:mm
function getFormattedDate() {
    const now = new Date();
    const yy = now.getFullYear().toString().slice(-2); // 년도의 마지막 두 자리
    const mm = (now.getMonth() + 1).toString().padStart(2, '0'); // 월
    const dd = now.getDate().toString().padStart(2, '0'); // 일
    const hh = now.getHours().toString().padStart(2, '0'); // 시간
    const min = now.getMinutes().toString().padStart(2, '0'); // 분
    return `mnt_data_saved:${yy}.${mm}.${dd}-${hh}:${min}`;
}
exports.getFormattedDate = getFormattedDate;
//# sourceMappingURL=formatter.js.map