import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  deleteCoordinationRecord,
  getCoordinationRecords,
} from "@/api/coordinationRecordApi";

import { getCoordination } from "@/api/coordinationApi";

import "./HistoryPage.css";

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ChevronLeftIcon() {
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
      <path d="m9 18 6-6-6-6" />
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

function formatDateKey(date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMonthRange(date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return {
    startDate: formatDateKey(firstDay),

    endDate: formatDateKey(lastDay),
  };
}

function getMonthLabel(date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
  }).format(date);
}

function getDayNumber(dateString) {
  return new Date(`${dateString}T00:00:00`).getDate();
}

function getWeekday(dateString) {
  return new Intl.DateTimeFormat("ko-KR", {
    weekday: "short",
  }).format(new Date(`${dateString}T00:00:00`));
}

function isToday(dateString) {
  return dateString === formatDateKey(new Date());
}

function OutfitImage({ item }) {
  const [failed, setFailed] = useState(false);

  if (!item?.image || failed) {
    return (
      <div className="history-record__visual-empty">
        <span>이미지 없음</span>
      </div>
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
      <div className="history-record__visual-empty">
        <span>이미지 없음</span>
      </div>
    );
  }

  return (
    <div
      className={[
        "history-record__visual",

        `history-record__visual--${Math.min(outfitClothes.length, 4)}`,
      ].join(" ")}
    >
      {outfitClothes.map((item) => (
        <div key={item.id} className="history-record__visual-item">
          <OutfitImage item={item} />
        </div>
      ))}
    </div>
  );
}

function HistoryPage() {
  const navigate = useNavigate();

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();

    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  async function loadRecords() {
    setLoading(true);

    setLoadError(false);

    const { startDate, endDate } = getMonthRange(selectedMonth);

    try {
      const recordData = await getCoordinationRecords(startDate, endDate);

      /*
       * CoordinationRecordResponse에는
       * 코디 이름과 ID만 있으므로
       * 사진/상황/계절을 보여주기 위해
       * 코디 상세를 추가 조회한다.
       */
      const details = await Promise.allSettled(
        recordData.map((record) => getCoordination(record.coordinationId)),
      );

      const merged = recordData.map((record, index) => ({
        ...record,

        outfit:
          details[index]?.status === "fulfilled" ? details[index].value : null,
      }));

      merged.sort((a, b) => b.date.localeCompare(a.date));

      setRecords(merged);
    } catch (error) {
      console.error("착용 기록을 불러오지 못했습니다.", error);

      setRecords([]);

      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, [selectedMonth]);

  const changeMonth = (amount) => {
    setSelectedMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + amount, 1),
    );
  };

  const goToCurrentMonth = () => {
    const today = new Date();

    setSelectedMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const handleEdit = (record) => {
    navigate(
      `/history/new?recordId=${record.id}&date=${record.date}&coordinationId=${record.coordinationId}`,
    );
  };

  const handleDelete = async (record) => {
    if (deletingId !== null) {
      return;
    }

    const confirmed = window.confirm(
      `${record.date} 착용 기록을 삭제하시겠습니까?`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(record.id);

    try {
      await deleteCoordinationRecord(record.id);

      setRecords((current) =>
        current.filter((item) => String(item.id) !== String(record.id)),
      );
    } catch (error) {
      console.error("착용 기록 삭제에 실패했습니다.", error);

      window.alert("착용 기록을 삭제하지 못했어요.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="history-page">
      <header className="history-header">
        <div>
          <span className="history-header__eyebrow">HISTORY</span>

          <h1>기록</h1>

          <p>내가 입었던 코디를 다시 돌아보세요.</p>
        </div>

        <button
          type="button"
          className="history-header__add"
          onClick={() => navigate("/history/new")}
          aria-label="착용 기록 추가"
        >
          <PlusIcon />
        </button>
      </header>

      <section className="history-month">
        <button
          type="button"
          className="history-month__arrow"
          onClick={() => changeMonth(-1)}
          aria-label="이전 달"
        >
          <ChevronLeftIcon />
        </button>

        <button
          type="button"
          className="history-month__current"
          onClick={goToCurrentMonth}
        >
          <CalendarIcon />

          <span>{getMonthLabel(selectedMonth)}</span>
        </button>

        <button
          type="button"
          className="history-month__arrow"
          onClick={() => changeMonth(1)}
          aria-label="다음 달"
        >
          <ChevronRightIcon />
        </button>
      </section>

      <section className="history-summary">
        <div>
          <strong>{records.length}</strong>

          <span>번</span>
        </div>

        <p>이번 달에 기록한 착용 코디</p>
      </section>

      <section
        className="history-records"
        aria-labelledby="history-record-title"
      >
        <div className="history-section-heading">
          <div>
            <span className="history-section-heading__eyebrow">
              WEARING DIARY
            </span>

            <h2 id="history-record-title">착용 기록</h2>
          </div>

          <span className="history-section-heading__count">
            {records.length}
          </span>
        </div>

        {loading ? (
          <div className="history-empty">
            <div className="history-empty__icon">
              <CalendarIcon />
            </div>

            <h2>착용 기록을 불러오고 있어요.</h2>

            <p>잠시만 기다려주세요.</p>
          </div>
        ) : loadError ? (
          <div className="history-empty">
            <div className="history-empty__icon">
              <CalendarIcon />
            </div>

            <h2>착용 기록을 불러오지 못했어요.</h2>

            <p>서버와 로그인 상태를 확인해주세요.</p>

            <button type="button" onClick={loadRecords}>
              다시 불러오기
            </button>
          </div>
        ) : records.length > 0 ? (
          <div className="history-record-list">
            {records.map((record) => {
              const outfit = record.outfit;

              return (
                <article key={record.id} className="history-record">
                  <div className="history-record__date">
                    <strong>{getDayNumber(record.date)}</strong>

                    <span>{getWeekday(record.date)}</span>

                    {isToday(record.date) && <em>TODAY</em>}
                  </div>

                  <button
                    type="button"
                    className="history-record__content"
                    onClick={() =>
                      navigate(`/outfits/${record.coordinationId}`)
                    }
                  >
                    <div className="history-record__image">
                      <OutfitPreview outfit={outfit} />
                    </div>

                    <div className="history-record__info">
                      <span className="history-record__label">
                        {isToday(record.date)
                          ? "오늘 입은 코디"
                          : "입었던 코디"}
                      </span>

                      <h3>{record.coordinationName}</h3>

                      {outfit && (
                        <p>
                          {[outfit.occasion, outfit.season]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}

                      <span className="history-record__detail-link">
                        코디 보기
                        <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </button>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "12px",
                      padding: "0 0 14px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleEdit(record)}
                      style={{
                        fontSize: "10px",
                        color: "#777",
                      }}
                    >
                      수정
                    </button>

                    <button
                      type="button"
                      disabled={deletingId === record.id}
                      onClick={() => handleDelete(record)}
                      style={{
                        fontSize: "10px",
                        color: "#d34d55",
                      }}
                    >
                      {deletingId === record.id ? "삭제 중" : "삭제"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="history-empty">
            <div className="history-empty__icon">
              <CalendarIcon />
            </div>

            <h2>아직 착용 기록이 없어요.</h2>

            <p>이 달에 입었던 코디를 기록해보세요.</p>

            <button type="button" onClick={() => navigate("/history/new")}>
              첫 기록 남기기
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default HistoryPage;
