import apiClient from "@/api/apiClient";

const CATEGORY_LABELS = {
  TOP: "상의",
  BOTTOM: "하의",
  OUTER: "아우터",
  SHOES: "신발",
  BAG: "가방",
  ACCESSORY: "액세서리",
  DRESS: "원피스",

  상의: "상의",
  하의: "하의",
  아우터: "아우터",
  신발: "신발",
  가방: "가방",
  액세서리: "액세서리",
  원피스: "원피스",
};

export async function getClothes({
  page = 0,
  size = 100,
  sort = "createdAt,desc",
  category,
  season,
  color,
} = {}) {
  const response = await apiClient.get("/api/clothes", {
    params: {
      page,
      size,
      sort,
      ...(category ? { category } : {}),
      ...(season ? { season } : {}),
      ...(color ? { color } : {}),
    },
  });

  return {
    ...response.data,

    content: Array.isArray(response.data?.content)
      ? response.data.content.map(mapClothing).filter(Boolean)
      : [],
  };
}

export async function getClothing(clothingId) {
  const response = await apiClient.get(`/api/clothes/${clothingId}`);

  return mapClothing(response.data);
}

export async function createClothing(request) {
  const response = await apiClient.post("/api/clothes", request);

  return mapClothing(response.data);
}

export async function updateClothing(clothingId, request) {
  const response = await apiClient.put(`/api/clothes/${clothingId}`, request);

  return mapClothing(response.data);
}

export async function uploadClothingImage(clothingId, file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await apiClient.post(
    `/api/clothes/${clothingId}/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return mapClothing(response.data);
}

export async function deleteClothing(clothingId) {
  await apiClient.delete(`/api/clothes/${clothingId}`);
}

export function getClothingCategoryLabel(category) {
  if (!category) {
    return "기타";
  }

  return CATEGORY_LABELS[category] ?? category;
}

function mapClothing(clothing) {
  if (!clothing) {
    return null;
  }

  return {
    id: clothing.id,

    name: clothing.name ?? "이름 없는 옷",

    category: clothing.category ?? "",

    categoryLabel: getClothingCategoryLabel(clothing.category),

    color: clothing.color ?? "",

    season: clothing.season ?? "",

    imageUrl: clothing.imageUrl ?? null,

    image: clothing.imageUrl ?? "",

    createdAt: clothing.createdAt ?? null,

    updatedAt: clothing.updatedAt ?? null,
  };
}
