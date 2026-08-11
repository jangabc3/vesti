const CATEGORY_LABELS = {
  TOP: '상의',
  BOTTOM: '하의',
  SHOES: '신발',
  OUTER: '아우터',
  BAG: '가방',
  ACCESSORY: '액세서리',
}


const similarCatalog = {
  minimal: [
    {
      id: 'minimal-top-1',
      category: '상의',

      brand: 'VESTI SELECT',
      name: '소프트 니트 카라 탑',

      price: 69000,

      image:
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=85',
    },

    {
      id: 'minimal-bottom-1',
      category: '하의',

      brand: 'VESTI SELECT',
      name: '와이드 플리츠 트라우저',

      price: 59000,

      image:
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=85',
    },

    {
      id: 'minimal-shoes-1',
      category: '신발',

      brand: 'VESTI SELECT',
      name: '클래식 레더 로퍼',

      price: 89000,

      image:
        'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=85',
    },
  ],


  casual: [
    {
      id: 'casual-top-1',
      category: '상의',

      brand: 'VESTI SELECT',
      name: '릴랙스드 코튼 티셔츠',

      price: 39000,

      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=85',
    },

    {
      id: 'casual-bottom-1',
      category: '하의',

      brand: 'VESTI SELECT',
      name: '루즈 스트레이트 데님',

      price: 69000,

      image:
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=85',
    },

    {
      id: 'casual-shoes-1',
      category: '신발',

      brand: 'VESTI SELECT',
      name: '레트로 로우 스니커즈',

      price: 79000,

      image:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=85',
    },
  ],


  street: [
    {
      id: 'street-top-1',
      category: '상의',

      brand: 'VESTI SELECT',
      name: '그래픽 크롭 티셔츠',

      price: 45000,

      image:
        'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=600&q=85',
    },

    {
      id: 'street-bottom-1',
      category: '하의',

      brand: 'VESTI SELECT',
      name: '와이드 카고 팬츠',

      price: 74000,

      image:
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=85',
    },

    {
      id: 'street-shoes-1',
      category: '신발',

      brand: 'VESTI SELECT',
      name: '볼드 러너 스니커즈',

      price: 99000,

      image:
        'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=85',
    },
  ],
}


const postProductConfig = {
  1: {
    'piece-1': {
      source: 'tagged',
      price: 89000,
    },

    'piece-2': {
      source: 'tagged',
      price: 59000,
    },

    /*
      신발은 작성자가 정확한 상품을 태그하지 않았다는
      상황을 가정한다.

      따라서 비슷한 상품을 추천한다.
    */
    'piece-3': {
      source: 'similar',

      recommendations: [
        {
          id: 'loafer-similar-1',

          brand: 'VESTI SELECT',
          name: '클래식 블랙 레더 로퍼',

          price: 89000,

          image:
            'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=85',
        },

        {
          id: 'loafer-similar-2',

          brand: 'VESTI SELECT',
          name: '스퀘어 토 페니 로퍼',

          price: 79000,

          image:
            'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=85',
        },

        {
          id: 'loafer-similar-3',

          brand: 'VESTI SELECT',
          name: '미니멀 레더 더비',

          price: 99000,

          image:
            'https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=600&q=85',
        },
      ],
    },
  },
}


function selectCatalogKey(
  post,
) {
  const tags =
    post.tags ?? []


  if (
    tags.includes(
      '스트릿',
    ) ||
    tags.includes(
      '블랙',
    )
  ) {
    return 'street'
  }


  if (
    tags.includes(
      '캐주얼',
    ) ||
    tags.includes(
      '데일리',
    )
  ) {
    return 'casual'
  }


  return 'minimal'
}


function buildFromTaggedPieces(
  post,
) {
  const config =
    postProductConfig[
      post.id
    ] ?? {}


  return post.wornPieces.map(
    (
      piece,
      index,
    ) => {
      const pieceConfig =
        config[
          piece.id
        ]


      const category =
        CATEGORY_LABELS[
          piece.category
        ] ??
        piece.category


      /*
        작성자가 정확한 상품을 태그한 경우
      */
      if (
        !pieceConfig ||
        pieceConfig.source ===
          'tagged'
      ) {
        const product = {
          id:
            `tagged-${post.id}-${piece.id}`,

          brand:
            piece.brand,

          name:
            piece.name,

          price:
            pieceConfig?.price ??
            null,

          image:
            piece.referenceImage,
        }


        return {
          id:
            `commerce-${post.id}-${index}`,

          category,

          source:
            'tagged',

          product,

          recommendations: [
            product,
          ],
        }
      }


      /*
        상품 정보가 없는 경우
        비슷한 상품 추천
      */
      const recommendations =
        pieceConfig.recommendations ??
        []


      return {
        id:
          `commerce-${post.id}-${index}`,

        category,

        source:
          'similar',

        product:
          recommendations[0],

        recommendations,
      }
    },
  )
}


function buildFromImage(
  post,
) {
  const key =
    selectCatalogKey(
      post,
    )


  return similarCatalog[
    key
  ].map(
    (
      product,
      index,
    ) => ({
      id:
        `detected-${post.id}-${index}`,

      category:
        product.category,

      source:
        'similar',

      product,

      recommendations: [
        product,
      ],
    }),
  )
}


export function getStyleCommerceItems(
  post,
) {
  if (!post) {
    return []
  }


  if (
    Array.isArray(
      post.wornPieces,
    ) &&
    post.wornPieces.length >
      0
  ) {
    return buildFromTaggedPieces(
      post,
    )
  }


  /*
    작성자가 착용 아이템 자체를 입력하지 않은 게시물.

    실제 서비스에서는 여기서
    이미지 분석 / 임베딩 검색 결과를 사용하게 된다.

    현재는 UI 개발용 Mock 추천.
  */
  return buildFromImage(
    post,
  )
}


export function getCommerceProductRows(
  items,
) {
  return items.flatMap(
    (item) => {
      const products =
        item.source ===
        'tagged'
          ? [
              item.product,
            ]
          : item.recommendations


      return products
        .filter(Boolean)
        .map(
          (
            product,
            index,
          ) => ({
            ...product,

            rowId:
              `${item.id}-${product.id}-${index}`,

            category:
              item.category,

            source:
              item.source,

            sourceLabel:
              item.source ===
              'tagged'
                ? '태그한 상품'
                : '비슷한 상품',
          }),
        )
    },
  )
}