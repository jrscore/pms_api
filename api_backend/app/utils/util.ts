export function generateTimeBasedOnNow(): number {
	const now = new Date()

	// 분과 초를 문자열로 변환하여 앞에서 2자리로 만듭니다.
	const minuteStr = String(now.getMinutes()).padStart(2, '0')
	const secondStr = String(now.getSeconds()).padStart(2, '0')

	// 0에서 99999 사이의 랜덤한 숫자를 생성합니다.
	const randomFiveDigits = Math.floor(Math.random() * 100000)

	// 최종 time 값을 생성합니다.
	const time = parseInt(minuteStr + secondStr + String(randomFiveDigits), 10)

	return time
}


export const hdRunstate = (status:string) => status.toLowerCase() === 'running'