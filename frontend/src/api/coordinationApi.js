import apiClient from "@/api/apiClient";

export async function getCoordinations() {
  const response = await apiClient.get("/api/coordinations");

  return Array.isArray(response.data) ? response.data.map(mapCoordination) : [];
}

export async function getCoordination(coordinationId) {
  const response = await apiClient.get(`/api/coordinations/${coordinationId}`);

  return mapCoordinationDetail(response.data);
}

export async function createCoordination(request) {
  const response = await apiClient.post("/api/coordinations", request);

  return mapCoordination(response.data);
}

export async function updateCoordination(coordinationId, request) {
  const response = await apiClient.put(
    `/api/coordinations/${coordinationId}`,
    request,
  );

  return mapCoordination(response.data);
}

export async function deleteCoordination(coordinationId) {
  await apiClient.delete(`/api/coordinations/${coordinationId}`);
}

export async function addClothingToCoordination(coordinationId, clothingId) {
  const response = await apiClient.post(
    `/api/coordinations/${coordinationId}/clothes/${clothingId}`,
  );

  return mapCoordination(response.data);
}

export async function removeClothingFromCoordination(
  coordinationId,
  clothingId,
) {
  await apiClient.delete(
    `/api/coordinations/${coordinationId}/clothes/${clothingId}`,
  );
}

function mapCoordination(coordination) {
  if (!coordination) {
    return null;
  }

  return {
    id: coordination.id,

    name: coordination.name ?? "이름 없는 코디",

    description: coordination.description ?? "",

    occasion: coordination.occasion ?? "",

    season: coordination.season ?? "",

    createdAt: coordination.createdAt ?? null,

    clothes: [],
  };
}

function mapCoordinationDetail(coordination) {
  if (!coordination) {
    return null;
  }

  return {
    ...mapCoordination(coordination),

    clothes: Array.isArray(coordination.clothes)
      ? coordination.clothes.map(mapClothing)
      : [],
  };
}

function mapClothing(clothing) {
  if (!clothing) {
    return null;
  }

  return {
    id: clothing.id,

    name: clothing.name ?? "이름 없는 옷",

    category: clothing.category ?? "",

    color: clothing.color ?? "",

    season: clothing.season ?? "",

    imageUrl: clothing.imageUrl ?? null,

    image: clothing.imageUrl ?? "",

    createdAt: clothing.createdAt ?? null,

    updatedAt: clothing.updatedAt ?? null,
  };
}
