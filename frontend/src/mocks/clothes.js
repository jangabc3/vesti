const categoryColors = {
  상의: ['#ddd2c5', '#f6f1eb'],
  하의: ['#c8ced0', '#eef0f0'],
  아우터: ['#b9afa4', '#ebe6e0'],
  신발: ['#d8c8bb', '#f3ede8'],
  가방: ['#bda995', '#eee6dd'],
  액세서리: ['#c8bdb3', '#f1ece7'],
}

const createImage = (category, accentIndex = 0) => {
  const [accent, background] = categoryColors[category]
  const offset = accentIndex % 3
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 400">
      <rect width="320" height="400" fill="${background}"/>
      <circle cx="${160 + offset * 8}" cy="188" r="92" fill="${accent}" opacity=".45"/>
      <path d="M116 128 84 158l24 43 24-13v102h56V188l24 13 24-43-32-30-28-12c-7 15-25 15-32 0l-28 12Z" fill="${accent}" stroke="#766c63" stroke-width="3" stroke-linejoin="round"/>
      <text x="160" y="340" text-anchor="middle" fill="#6f6a65" font-family="sans-serif" font-size="18">${category}</text>
    </svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const clothesData = [
  ['화이트 코튼 셔츠', 'COS', '아이보리', '상의'],
  ['베이직 크루넥 티셔츠', 'MUJI', '블랙', '상의'],
  ['스트라이프 니트', 'Mardi Mercredi', '네이비', '상의'],
  ['린넨 반소매 셔츠', 'Uniqlo', '베이지', '상의'],
  ['와이드 데님 팬츠', 'LEVI’S', '인디고', '하의'],
  ['테이퍼드 슬랙스', 'Musinsa Standard', '차콜', '하의'],
  ['코튼 쇼츠', 'Uniqlo', '카키', '하의'],
  ['플리츠 미디 스커트', 'ARKET', '브라운', '하의'],
  ['싱글 트렌치코트', 'Mango', '샌드', '아우터'],
  ['울 블렌드 재킷', 'COS', '다크 그레이', '아우터'],
  ['라이트 다운 재킷', 'Uniqlo', '크림', '아우터'],
  ['데님 재킷', 'LEVI’S', '라이트 블루', '아우터'],
  ['레더 로퍼', 'Dr. Martens', '블랙', '신발'],
  ['캔버스 스니커즈', 'Converse', '오프화이트', '신발'],
  ['러닝 스니커즈', 'New Balance', '그레이', '신발'],
  ['스웨이드 숄더백', 'Stand Oil', '탄 브라운', '가방'],
  ['미니 크로스백', 'OSOI', '블랙', '가방'],
  ['나일론 토트백', 'Baggu', '올리브', '가방'],
  ['실버 체인 목걸이', 'Monday Edition', '실버', '액세서리'],
  ['울 베레모', 'Kangol', '차콜', '액세서리'],
]

export const clothes = clothesData.map(
  ([name, brand, color, category], index) => ({
    id: index + 1,
    name,
    brand,
    color,
    category,
    image: createImage(category, index),
    isFavorite: [1, 5, 10, 16].includes(index + 1),
  }),
)
