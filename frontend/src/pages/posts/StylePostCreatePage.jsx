import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  createStylePost,
  getStylePost,
  updateLocalStylePost,
} from '@/mocks/community'

import './StylePostCreatePage.css'


const STYLE_TAGS = [
  '미니멀',
  '캐주얼',
  '스트릿',
  '데일리',
  '시티보이',
  '빈티지',
  '페미닌',
  '뉴트럴',
  '블랙',
]


const TPO_TAGS = [
  '일상',
  '출근',
  '데이트',
  '여행',
  '모임',
  '학교',
  '운동',
]


const CATEGORY_CODE = {
  상의: 'TOP',
  하의: 'BOTTOM',
  신발: 'SHOES',
  아우터: 'OUTER',
  가방: 'BAG',
  액세서리: 'ACCESSORY',
}


const MOCK_WARDROBE = [
  {
    id: 'closet-1',
    category: '상의',
    name: '코튼 반소매 셔츠',
    brand: 'COS',

    image:
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=85',
  },

  {
    id: 'closet-2',
    category: '하의',
    name: '와이드 투턱 슬랙스',
    brand: 'MUJI',

    image:
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=85',
  },

  {
    id: 'closet-3',
    category: '신발',
    name: '블랙 레더 로퍼',
    brand: 'VESTI',

    image:
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=85',
  },

  {
    id: 'closet-4',
    category: '아우터',
    name: '오버핏 블랙 재킷',
    brand: 'VESTI',

    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=85',
  },

  {
    id: 'closet-5',
    category: '상의',
    name: '베이직 화이트 티셔츠',
    brand: 'VESTI',

    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=85',
  },

  {
    id: 'closet-6',
    category: '하의',
    name: '와이드 데님 팬츠',
    brand: 'VESTI',

    image:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=85',
  },
]


function BackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}


function CameraIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 7h3l1.4-2h5.2L16 7h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />

      <circle
        cx="12"
        cy="13"
        r="3.5"
      />
    </svg>
  )
}


function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}


function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  )
}


function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 7" />
    </svg>
  )
}


function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}


function getInitialSelectedPieceIds(
  post,
) {
  if (!post) {
    return []
  }


  const wornPieces =
    Array.isArray(
      post.wornPieces,
    )
      ? post.wornPieces
      : []


  return MOCK_WARDROBE
    .filter(
      (piece) =>
        wornPieces.some(
          (wornPiece) =>
            wornPiece.closetItemId ===
              piece.id ||
            (
              wornPiece.name ===
                piece.name &&
              wornPiece.brand ===
                piece.brand
            ),
        ),
    )
    .map(
      (piece) =>
        piece.id,
    )
}


function getInitialStyleTags(
  post,
) {
  if (!post) {
    return []
  }


  return (
    post.tags ??
    []
  ).filter(
    (tag) =>
      STYLE_TAGS.includes(
        tag,
      ),
  )
}


function getInitialTpoTags(
  post,
) {
  if (!post) {
    return []
  }


  if (
    Array.isArray(
      post.tpoTags,
    )
  ) {
    return post.tpoTags
  }


  return (
    post.tags ??
    []
  ).filter(
    (tag) =>
      TPO_TAGS.includes(
        tag,
      ),
  )
}


function loadImage(
  url,
) {
  return new Promise(
    (
      resolve,
      reject,
    ) => {
      const image =
        new Image()


      image.onload =
        () =>
          resolve(
            image,
          )


      image.onerror =
        reject


      image.src =
        url
    },
  )
}


async function compressImageToDataUrl(
  file,
) {
  const objectUrl =
    URL.createObjectURL(
      file,
    )


  try {
    const image =
      await loadImage(
        objectUrl,
      )


    const maxLongSide =
      1080


    const naturalWidth =
      image.naturalWidth ||
      image.width


    const naturalHeight =
      image.naturalHeight ||
      image.height


    const longestSide =
      Math.max(
        naturalWidth,
        naturalHeight,
      )


    const scale =
      longestSide >
      maxLongSide
        ? maxLongSide /
          longestSide
        : 1


    const width =
      Math.max(
        1,
        Math.round(
          naturalWidth *
            scale,
        ),
      )


    const height =
      Math.max(
        1,
        Math.round(
          naturalHeight *
            scale,
        ),
      )


    const canvas =
      document.createElement(
        'canvas',
      )


    canvas.width =
      width

    canvas.height =
      height


    const context =
      canvas.getContext(
        '2d',
      )


    if (!context) {
      throw new Error(
        'Canvas context를 만들 수 없습니다.',
      )
    }


    context.drawImage(
      image,
      0,
      0,
      width,
      height,
    )


    return canvas.toDataURL(
      'image/jpeg',
      0.78,
    )
  } finally {
    URL.revokeObjectURL(
      objectUrl,
    )
  }
}


function revokePreview(
  preview,
) {
  if (
    preview?.startsWith(
      'blob:',
    )
  ) {
    URL.revokeObjectURL(
      preview,
    )
  }
}


function StylePostCreatePage() {
  const navigate =
    useNavigate()


  const {
    styleId,
  } =
    useParams()


  const isEditMode =
    Boolean(
      styleId,
    )


  const editingPost =
    isEditMode
      ? getStylePost(
          styleId,
        )
      : null


  const fileInputRef =
    useRef(null)


  const [
    selectedFile,
    setSelectedFile,
  ] =
    useState(null)


  const [
    imagePreview,
    setImagePreview,
  ] =
    useState(
      editingPost?.image ??
      null,
    )


  const [
    caption,
    setCaption,
  ] =
    useState(
      editingPost?.caption ??
      '',
    )


  const [
    location,
    setLocation,
  ] =
    useState(
      editingPost?.location ===
        '위치 미등록'
        ? ''
        : (
            editingPost?.location ??
            ''
          ),
    )


  const [
    selectedStyles,
    setSelectedStyles,
  ] =
    useState(
      () =>
        getInitialStyleTags(
          editingPost,
        ),
    )


  const [
    selectedTpo,
    setSelectedTpo,
  ] =
    useState(
      () =>
        getInitialTpoTags(
          editingPost,
        ),
    )


  const [
    selectedPieces,
    setSelectedPieces,
  ] =
    useState(
      () =>
        getInitialSelectedPieceIds(
          editingPost,
        ),
    )


  const [
    wardrobeOpen,
    setWardrobeOpen,
  ] =
    useState(false)


  const [
    submitting,
    setSubmitting,
  ] =
    useState(false)


  const selectedPieceObjects =
    useMemo(
      () =>
        MOCK_WARDROBE.filter(
          (piece) =>
            selectedPieces.includes(
              piece.id,
            ),
        ),
      [
        selectedPieces,
      ],
    )


  const canPublish =
    Boolean(
      imagePreview,
    )


  useEffect(
    () => {
      if (
        isEditMode &&
        (
          !editingPost ||
          editingPost.isMine !==
            true
        )
      ) {
        navigate(
          '/discover',
          {
            replace: true,
          },
        )
      }
    },
    [
      isEditMode,
      editingPost,
      navigate,
    ],
  )


  useEffect(
    () => {
      return () => {
        revokePreview(
          imagePreview,
        )
      }
    },
    [
      imagePreview,
    ],
  )


  useEffect(
    () => {
      if (
        !wardrobeOpen
      ) {
        return undefined
      }


      const previousOverflow =
        document.body.style
          .overflow


      document.body.style.overflow =
        'hidden'


      return () => {
        document.body.style.overflow =
          previousOverflow
      }
    },
    [
      wardrobeOpen,
    ],
  )


  const handlePhotoSelect = (
    event,
  ) => {
    const file =
      event.target.files?.[0]


    if (!file) {
      return
    }


    if (
      !file.type.startsWith(
        'image/',
      )
    ) {
      window.alert(
        '이미지 파일을 선택해주세요.',
      )

      return
    }


    if (
      file.size >
      5 * 1024 * 1024
    ) {
      window.alert(
        '사진은 5MB 이하로 선택해주세요.',
      )

      return
    }


    revokePreview(
      imagePreview,
    )


    const previewUrl =
      URL.createObjectURL(
        file,
      )


    setSelectedFile(
      file,
    )


    setImagePreview(
      previewUrl,
    )
  }


  const handleRemovePhoto =
    () => {
      revokePreview(
        imagePreview,
      )


      setImagePreview(
        null,
      )


      setSelectedFile(
        null,
      )


      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          ''
      }
    }


  const toggleStyleTag = (
    tag,
  ) => {
    setSelectedStyles(
      (current) =>
        current.includes(
          tag,
        )
          ? current.filter(
              (item) =>
                item !== tag,
            )
          : [
              ...current,
              tag,
            ],
    )
  }


  const toggleTpoTag = (
    tag,
  ) => {
    setSelectedTpo(
      (current) =>
        current.includes(
          tag,
        )
          ? current.filter(
              (item) =>
                item !== tag,
            )
          : [
              ...current,
              tag,
            ],
    )
  }


  const togglePiece = (
    pieceId,
  ) => {
    setSelectedPieces(
      (current) =>
        current.includes(
          pieceId,
        )
          ? current.filter(
              (id) =>
                id !== pieceId,
            )
          : [
              ...current,
              pieceId,
            ],
    )
  }


  const removePiece = (
    pieceId,
  ) => {
    setSelectedPieces(
      (current) =>
        current.filter(
          (id) =>
            id !== pieceId,
        ),
    )
  }


  const handlePublish =
    async () => {
      if (
        !canPublish ||
        submitting
      ) {
        return
      }


      setSubmitting(
        true,
      )


      try {
        let persistentImage =
          imagePreview


        /*
          새 사진을 선택한 경우에만
          Data URL로 다시 변환한다.

          수정하면서 기존 사진을 유지했다면
          기존 image 값을 그대로 사용한다.
        */
        if (
          selectedFile
        ) {
          persistentImage =
            await compressImageToDataUrl(
              selectedFile,
            )
        }


        if (
          !persistentImage
        ) {
          throw new Error(
            '게시물 이미지가 없습니다.',
          )
        }


        const cleanCaption =
          caption.trim()


        const cleanLocation =
          location.trim()


        const mainStyle =
          selectedStyles[0] ??
          '데일리'


        const title =
          cleanCaption
            ? cleanCaption.length >
              34
              ? `${cleanCaption.slice(
                  0,
                  34,
                )}…`
              : cleanCaption
            : `${
                cleanLocation ||
                '오늘'
              }에서 입은 ${mainStyle} 룩`


        const wornPieces =
          selectedPieceObjects.map(
            (
              piece,
              index,
            ) => ({
              id:
                `local-piece-${Date.now()}-${index}`,

              closetItemId:
                piece.id,

              category:
                CATEGORY_CODE[
                  piece.category
                ] ??
                'TOP',

              name:
                piece.name,

              brand:
                piece.brand,

              color: '',

              referenceImage:
                piece.image,

              matched: {
                name:
                  piece.name,

                brand:
                  piece.brand,

                color: '',

                image:
                  piece.image,
              },
            }),
          )


        const payload = {
          image:
            persistentImage,

          title,

          caption:
            cleanCaption,

          location:
            cleanLocation,

          styleTags:
            selectedStyles,

          tpoTags:
            selectedTpo,

          wornPieces,
        }


        if (
          isEditMode
        ) {
          const updatedPost =
            updateLocalStylePost(
              styleId,
              payload,
            )


          if (
            !updatedPost
          ) {
            throw new Error(
              '게시물을 수정할 수 없습니다.',
            )
          }


          navigate(
            `/styles/${updatedPost.id}`,
            {
              replace: true,
            },
          )


          return
        }


        const newPost =
          createStylePost({
            ...payload,

            caption:
              cleanCaption ||
              '오늘의 스타일을 공유했어요.',

            location:
              cleanLocation ||
              '위치 미등록',
          })


        navigate(
          `/styles/${newPost.id}`,
          {
            replace: true,
          },
        )
      } catch (
        error
      ) {
        console.error(
          isEditMode
            ? '스타일 수정 실패'
            : '스타일 게시 실패',
          error,
        )


        window.alert(
          isEditMode
            ? '스타일을 수정하는 중 문제가 발생했어요.'
            : '스타일을 저장하는 중 문제가 발생했어요.',
        )


        setSubmitting(
          false,
        )
      }
    }


  if (
    isEditMode &&
    (
      !editingPost ||
      editingPost.isMine !==
        true
    )
  ) {
    return null
  }


  return (
    <div className="style-create-page">

      {/* Header */}

      <header className="style-create-header">

        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          aria-label="뒤로 가기"
        >
          <BackIcon />
        </button>


        <strong>
          {
            isEditMode
              ? '스타일 수정'
              : '스타일 공유'
          }
        </strong>


        <button
          type="button"
          className="style-create-header__publish"
          disabled={
            !canPublish ||
            submitting
          }
          onClick={
            handlePublish
          }
        >
          {
            submitting
              ? '저장 중'
              : (
                  isEditMode
                    ? '완료'
                    : '게시'
                )
          }
        </button>

      </header>


      {/* Photo */}

      <section className="style-create-photo">

        <input
          ref={
            fileInputRef
          }
          type="file"
          accept="image/*"
          onChange={
            handlePhotoSelect
          }
          hidden
        />


        {imagePreview ? (
          <div className="style-create-photo__preview">

            <img
              src={
                imagePreview
              }
              alt="스타일"
            />


            <div className="style-create-photo__preview-actions">

              <button
                type="button"
                onClick={() =>
                  fileInputRef
                    .current
                    ?.click()
                }
              >
                사진 변경
              </button>


              <button
                type="button"
                onClick={
                  handleRemovePhoto
                }
              >
                삭제
              </button>

            </div>

          </div>
        ) : (
          <button
            type="button"
            className="style-create-photo__empty"
            onClick={() =>
              fileInputRef
                .current
                ?.click()
            }
          >

            <span className="style-create-photo__icon">
              <CameraIcon />
            </span>


            <strong>
              오늘의 스타일을
              보여주세요.
            </strong>


            <p>
              전신 또는 코디가 잘 보이는
              사진을 선택하면 좋아요.
            </p>


            <span className="style-create-photo__add">
              사진 추가
            </span>

          </button>
        )}

      </section>


      {/* Caption */}

      <section className="style-create-section">

        <div className="style-create-section__heading">

          <h2>
            한마디
          </h2>


          <span>
            선택
          </span>

        </div>


        <textarea
          value={
            caption
          }
          onChange={(
            event,
          ) =>
            setCaption(
              event.target.value,
            )
          }
          maxLength={300}
          placeholder="오늘 입은 스타일에 대해 이야기해보세요."
        />


        <div className="style-create-character-count">
          {
            caption.length
          }
          /300
        </div>

      </section>


      {/* Worn Pieces */}

      <section className="style-create-section">

        <div className="style-create-section__heading">

          <div>

            <h2>
              착용한 옷
            </h2>


            <p>
              사진 속에서 입은 옷을
              내 옷장과 연결해보세요.
            </p>

          </div>


          <span>
            선택
          </span>

        </div>


        {selectedPieceObjects.length >
        0 ? (
          <div className="style-create-selected-pieces">

            {selectedPieceObjects.map(
              (piece) => (
                <article
                  key={
                    piece.id
                  }
                  className="style-create-selected-piece"
                >

                  <img
                    src={
                      piece.image
                    }
                    alt={
                      piece.name
                    }
                  />


                  <div>

                    <span>
                      {
                        piece.category
                      }
                    </span>


                    <strong>
                      {
                        piece.name
                      }
                    </strong>


                    <p>
                      {
                        piece.brand
                      }
                    </p>

                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      removePiece(
                        piece.id,
                      )
                    }
                    aria-label={`${piece.name} 제거`}
                  >
                    <CloseIcon />
                  </button>

                </article>
              ),
            )}

          </div>
        ) : (
          <div className="style-create-piece-empty">

            <strong>
              옷을 연결하지 않아도
              괜찮아요.
            </strong>


            <p>
              상품 정보를 입력하지 않으면
              게시물 상세에서 비슷한 상품을
              추천하는 방식으로 이어질 수 있어요.
            </p>

          </div>
        )}


        <button
          type="button"
          className="style-create-add-piece"
          onClick={() =>
            setWardrobeOpen(
              true,
            )
          }
        >

          <PlusIcon />

          <span>
            내 옷장에서 선택
          </span>

          <ChevronRightIcon />

        </button>

      </section>


      {/* Style */}

      <section className="style-create-section">

        <div className="style-create-section__heading">

          <div>

            <h2>
              스타일
            </h2>

            <p>
              코디의 분위기를
              선택해주세요.
            </p>

          </div>


          <span>
            선택
          </span>

        </div>


        <div className="style-create-tags">

          {STYLE_TAGS.map(
            (tag) => (
              <button
                key={
                  tag
                }
                type="button"
                className={
                  selectedStyles.includes(
                    tag,
                  )
                    ? 'style-create-tag style-create-tag--active'
                    : 'style-create-tag'
                }
                onClick={() =>
                  toggleStyleTag(
                    tag,
                  )
                }
              >
                #{tag}
              </button>
            ),
          )}

        </div>

      </section>


      {/* TPO */}

      <section className="style-create-section">

        <div className="style-create-section__heading">

          <div>

            <h2>
              언제 입었나요?
            </h2>

            <p>
              비슷한 상황의 스타일을
              찾는 데 활용할 수 있어요.
            </p>

          </div>


          <span>
            선택
          </span>

        </div>


        <div className="style-create-tags">

          {TPO_TAGS.map(
            (tag) => (
              <button
                key={
                  tag
                }
                type="button"
                className={
                  selectedTpo.includes(
                    tag,
                  )
                    ? 'style-create-tag style-create-tag--active'
                    : 'style-create-tag'
                }
                onClick={() =>
                  toggleTpoTag(
                    tag,
                  )
                }
              >
                {tag}
              </button>
            ),
          )}

        </div>

      </section>


      {/* Location */}

      <section className="style-create-section">

        <div className="style-create-section__heading">

          <h2>
            장소
          </h2>


          <span>
            선택
          </span>

        </div>


        <input
          className="style-create-location"
          type="text"
          value={
            location
          }
          onChange={(
            event,
          ) =>
            setLocation(
              event.target.value,
            )
          }
          maxLength={30}
          placeholder="예: 성수, 한남, 연남"
        />

      </section>


      {/* Guide */}

      <section className="style-create-guide">

        <strong>
          {
            isEditMode
              ? '원하는 부분만 수정하면 돼요.'
              : '사진만 있어도 공유할 수 있어요.'
          }
        </strong>


        <p>
          {
            isEditMode
              ? '사진, 설명, 착용 아이템, 스타일과 장소를 자유롭게 변경할 수 있어요.'
              : '스타일 설명이나 착용 아이템은 선택 사항이에요. 부담 없이 먼저 사진부터 공유할 수 있어요.'
          }
        </p>

      </section>


      {/* Bottom CTA */}

      <div className="style-create-bottom">

        <button
          type="button"
          disabled={
            !canPublish ||
            submitting
          }
          onClick={
            handlePublish
          }
        >
          {
            submitting
              ? '저장 중...'
              : (
                  isEditMode
                    ? '수정 완료'
                    : '스타일 공유하기'
                )
          }
        </button>

      </div>


      {/* Wardrobe Bottom Sheet */}

      {wardrobeOpen && (
        <div
          className="style-create-sheet-backdrop"
          onMouseDown={(
            event,
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setWardrobeOpen(
                false,
              )
            }
          }}
        >

          <section className="style-create-wardrobe-sheet">

            <header>

              <div>

                <h2>
                  내 옷장
                </h2>


                <span>
                  {
                    selectedPieces.length
                  }
                  개 선택
                </span>

              </div>


              <button
                type="button"
                onClick={() =>
                  setWardrobeOpen(
                    false,
                  )
                }
                aria-label="닫기"
              >
                <CloseIcon />
              </button>

            </header>


            <div className="style-create-wardrobe-sheet__description">

              <strong>
                사진에서 입은 옷을 골라주세요.
              </strong>

              <p>
                여러 개를 선택할 수 있어요.
              </p>

            </div>


            <div className="style-create-wardrobe-grid">

              {MOCK_WARDROBE.map(
                (piece) => {
                  const selected =
                    selectedPieces.includes(
                      piece.id,
                    )


                  return (
                    <button
                      key={
                        piece.id
                      }
                      type="button"
                      className={
                        selected
                          ? 'style-create-wardrobe-item style-create-wardrobe-item--selected'
                          : 'style-create-wardrobe-item'
                      }
                      onClick={() =>
                        togglePiece(
                          piece.id,
                        )
                      }
                    >

                      <div className="style-create-wardrobe-item__photo">

                        <img
                          src={
                            piece.image
                          }
                          alt={
                            piece.name
                          }
                        />


                        {selected && (
                          <span className="style-create-wardrobe-item__check">

                            <CheckIcon />

                          </span>
                        )}

                      </div>


                      <span>
                        {
                          piece.category
                        }
                      </span>


                      <strong>
                        {
                          piece.name
                        }
                      </strong>


                      <p>
                        {
                          piece.brand
                        }
                      </p>

                    </button>
                  )
                },
              )}

            </div>


            <footer>

              <button
                type="button"
                onClick={() =>
                  setWardrobeOpen(
                    false,
                  )
                }
              >
                {
                  selectedPieces.length >
                  0
                    ? `${selectedPieces.length}개 옷 연결하기`
                    : '옷 선택 없이 돌아가기'
                }
              </button>

            </footer>

          </section>

        </div>
      )}

    </div>
  )
}


export default StylePostCreatePage