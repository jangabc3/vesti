import { useEffect, useMemo, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { getCoordination, getCoordinations } from "@/api/coordinationApi";

import {
  createCoordinationRecord,
  updateCoordinationRecord,
} from "@/api/coordinationRecordApi";

import "./HistoryCreatePage.css";

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
  );
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
  );
}

function CalendarIcon() {
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
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />

      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  );
}

function getDateValue(offset = 0) {
  const date = new Date();

  date.setDate(date.getDate() + offset);

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getReadableDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date(`${dateValue}T00:00:00`));
}

function OutfitImage({ item }) {
  const [failed, setFailed] = useState(false);

  if (!item?.image || failed) {
    return (
      <div className="history-create-outfit__empty-image">이미지 없음</div>
    );
  }

  return (
    <img
      src={item.image}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function OutfitPreview({ outfit }) {
  const outfitClothes = Array.isArray(outfit?.clothes)
    ? outfit.clothes.filter(Boolean).slice(0, 4)
    : [];

  if (outfitClothes.length === 0) {
    return (
      <div className="history-create-outfit__empty-image">이미지 없음</div>
    );
  }

  return (
    <div
      className={[
        "history-create-outfit__visual",

        `history-create-outfit__visual--${Math.min(outfitClothes.length, 4)}`,
      ].join(" ")}
    >
      {outfitClothes.map((item) => (
        <div key={item.id} className="history-create-outfit__visual-item">
          <OutfitImage item={item} />
        </div>
      ))}
    </div>
  );
}

function HistoryCreatePage() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const recordId = searchParams.get("recordId");

  const initialDate = searchParams.get("date");

  const initialCoordinationId = searchParams.get("coordinationId");

  const isEditing = Boolean(recordId);

  const today = useMemo(() => getDateValue(), []);

  const yesterday = useMemo(() => getDateValue(-1), []);

  const [wearingDate, setWearingDate] = useState(initialDate || today);

  const [selectedOutfitId, setSelectedOutfitId] = useState(
    initialCoordinationId || null,
  );

  const [outfits, setOutfits] = useState([]);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadOutfits() {
      setLoading(true);

      try {
        const basic = await getCoordinations();

        const details = await Promise.allSettled(
          basic.map((outfit) => getCoordination(outfit.id)),
        );

        if (ignore) {
          return;
        }

        const result = basic.map((outfit, index) =>
          details[index]?.status === "fulfilled"
            ? details[index].value
            : outfit,
        );

        setOutfits(result.filter(Boolean));
      } catch (error) {
        console.error("코디 목록을 불러오지 못했습니다.", error);

        if (!ignore) {
          setOutfits([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadOutfits();

    return () => {
      ignore = true;
    };
  }, []);

  const selectedOutfit = outfits.find(
    (outfit) => String(outfit.id) === String(selectedOutfitId),
  );

  const isFormValid = Boolean(wearingDate) && Boolean(selectedOutfitId);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const request = {
        date: wearingDate,

        coordinationId: Number(selectedOutfitId),
      };

      if (isEditing) {
        await updateCoordinationRecord(recordId, request);
      } else {
        await createCoordinationRecord(request);
      }

      navigate("/history", {
        replace: true,

        state: {
          message: isEditing
            ? "착용 기록이 수정되었습니다."
            : "착용 기록이 추가되었습니다.",
        },
      });
    } catch (error) {
      console.error(
        isEditing
          ? "착용 기록 수정에 실패했습니다."
          : "착용 기록 저장에 실패했습니다.",
        error,
      );

      if (error.response?.status === 409) {
        window.alert("선택한 날짜에는 이미 착용 기록이 있어요.");
      } else {
        window.alert(
          isEditing
            ? "착용 기록을 수정하지 못했어요."
            : "착용 기록을 저장하지 못했어요.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="history-create-page">
      <header className="history-create-header">
        <button
          type="button"
          className="history-create-header__back"
          disabled={submitting}
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
        >
          <BackIcon />
        </button>

        <h1>{isEditing ? "착용 기록 수정" : "착용 기록"}</h1>

        <button
          type="submit"
          form="history-create-form"
          className="history-create-header__complete"
          disabled={!isFormValid || submitting}
        >
          {submitting ? "저장 중" : "완료"}
        </button>
      </header>

      <form
        id="history-create-form"
        className="history-create-form"
        onSubmit={handleSubmit}
      >
        <section className="history-create-intro">
          <span>WEARING DIARY</span>

          <h2>{isEditing ? "기록을 수정할까요?" : "오늘 무엇을 입었나요?"}</h2>

          <p>입었던 코디를 기록하면 내 옷장을 더 잘 활용할 수 있어요.</p>
        </section>

        <section className="history-create-section">
          <div className="history-create-section__heading">
            <span>
              착용 날짜
              <em>*</em>
            </span>

            <span className="history-create-section__value">
              {getReadableDate(wearingDate)}
            </span>
          </div>

          <div className="history-create-date-quick">
            <button
              type="button"
              className={[
                "history-create-date-quick__item",

                wearingDate === today
                  ? "history-create-date-quick__item--active"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setWearingDate(today)}
            >
              오늘
            </button>

            <button
              type="button"
              className={[
                "history-create-date-quick__item",

                wearingDate === yesterday
                  ? "history-create-date-quick__item--active"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setWearingDate(yesterday)}
            >
              어제
            </button>
          </div>

          <label className="history-create-date-picker">
            <div>
              <CalendarIcon />

              <span>다른 날짜 선택</span>
            </div>

            <input
              type="date"
              value={wearingDate}
              max={today}
              onChange={(event) => setWearingDate(event.target.value)}
              aria-label="착용 날짜"
            />
          </label>
        </section>

        <section className="history-create-outfits">
          <div className="history-create-outfits__heading">
            <div>
              <span className="history-create-outfits__eyebrow">OUTFITS</span>

              <h2>
                입은 코디
                <em>*</em>
              </h2>
            </div>

            <span>{loading ? "..." : `${outfits.length}개`}</span>
          </div>

          {loading ? (
            <div className="history-create-empty">
              <h3>코디를 불러오고 있어요.</h3>
            </div>
          ) : outfits.length > 0 ? (
            <div className="history-create-outfit-grid">
              {outfits.map((outfit) => {
                const selected = String(selectedOutfitId) === String(outfit.id);

                return (
                  <button
                    key={outfit.id}
                    type="button"
                    disabled={submitting}
                    className={[
                      "history-create-outfit",

                      selected ? "history-create-outfit--selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => setSelectedOutfitId(outfit.id)}
                    aria-pressed={selected}
                  >
                    <div className="history-create-outfit__image">
                      <OutfitPreview outfit={outfit} />

                      <span className="history-create-outfit__check">
                        {selected && <CheckIcon />}
                      </span>
                    </div>

                    <div className="history-create-outfit__info">
                      <strong>{outfit.name}</strong>

                      <span>
                        {[outfit.occasion, outfit.season]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="history-create-empty">
              <h3>저장된 코디가 없어요.</h3>

              <p>먼저 코디를 만든 후 착용 기록을 남겨보세요.</p>

              <button type="button" onClick={() => navigate("/outfits/new")}>
                코디 만들기
              </button>
            </div>
          )}
        </section>

        {selectedOutfit && (
          <section className="history-create-selected">
            <span>선택한 코디</span>

            <strong>{selectedOutfit.name}</strong>

            <p>
              {getReadableDate(wearingDate)}에 입은 코디로
              {isEditing ? " 수정할게요." : " 기록할게요."}
            </p>
          </section>
        )}

        <div className="history-create-action">
          <button
            type="submit"
            className="history-create-action__button"
            disabled={!isFormValid || submitting}
          >
            {submitting
              ? "저장 중..."
              : isEditing
                ? "착용 기록 수정"
                : "착용 기록 저장"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default HistoryCreatePage;
