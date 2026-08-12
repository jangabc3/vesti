import apiClient from "@/api/apiClient";

export async function getCoordinationRecords(startDate, endDate) {
  const response = await apiClient.get("/api/coordination-records", {
    params: {
      startDate,
      endDate,
    },
  });

  return Array.isArray(response.data)
    ? response.data.map(mapCoordinationRecord)
    : [];
}

export async function getTodayCoordinationRecord() {
  const response = await apiClient.get("/api/coordination-records/today");

  return mapCoordinationRecord(response.data);
}

export async function createCoordinationRecord({ date, coordinationId }) {
  const response = await apiClient.post("/api/coordination-records", {
    date,
    coordinationId,
  });

  return mapCoordinationRecord(response.data);
}

export async function updateCoordinationRecord(
  recordId,
  { date, coordinationId },
) {
  const response = await apiClient.put(
    `/api/coordination-records/${recordId}`,
    {
      date,
      coordinationId,
    },
  );

  return mapCoordinationRecord(response.data);
}

export async function deleteCoordinationRecord(recordId) {
  await apiClient.delete(`/api/coordination-records/${recordId}`);
}

export async function getAllCoordinationRecords() {
  return getCoordinationRecords("2000-01-01", "2100-12-31");
}

function mapCoordinationRecord(record) {
  if (!record) {
    return null;
  }

  return {
    id: record.id,

    date: record.date,

    coordinationId: record.coordinationId,

    coordinationName: record.coordinationName ?? "이름 없는 코디",

    createdAt: record.createdAt ?? null,
  };
}
