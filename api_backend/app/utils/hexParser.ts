import { GridData, Inverter } from "../model/grid"


export function hexXmlParser(xmlString: string): GridData[] {
  // XML 문자열에서 필요한 데이터를 추출합니다.
  const valueMatch = xmlString.match(/value="([^"]*)"/)

  if (!valueMatch) {
    console.error('No value attribute found in XML')
    return []
  }

  // HTML 엔티티를 디코딩합니다.
  const valstr = decodeHtmlEntities(valueMatch[1])

  try {
    const json = JSON.parse(valstr)

    // 그리드 리스트를 우선 생성합니다.
    const grids: GridData[] = json.filter((item: any) => item.invid === 0).map((item: any) => ({
      alias: item.title,
      pwr: parseFloat(item.currentpower),
      day: parseFloat(item.daily),
      invs: []
    }))

    // 각 그리드에 해당하는 인버터를 추가합니다.
    json.forEach((item: any) => {
      if (item.invid !== 0) {
        const grid = grids.find(g => g.alias === json.find((gridItem: any) => gridItem.cusno === item.cusno && gridItem.invid === 0).title)
        if (grid) {
          const inverter: Inverter = {
            no: item.invid,
            pwr: parseFloat(item.currentpower),
            day: parseFloat(item.daily),
            yld: 0,
            run: item.staus === "Success"
          }
          grid.invs.push(inverter)
        }
      }
    })

    // 그리드 리스트의 pwr와 day 값 계산
    grids.forEach(grid => {
      grid.pwr = grid.invs.reduce((sum, inv) => sum + inv.pwr, 0)
      grid.day = grid.invs.reduce((sum, inv) => sum + inv.day, 0)
    })

    return grids
  } catch (e) {
    console.error('Error parsing JSON:', e)
    return []
  }
}



function decodeHtmlEntities(str: string): string {
  return str.replace(/&#x([0-9A-F]{1,4});/gi, function (match, num) {
    return String.fromCharCode(parseInt(num, 16));
  }).replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}
