import apiClient from "@/api/apiClient";

export async function recommendAiStyling(message) {
  const response = await apiClient.post("/api/ai/styling", {
    message,
  });

  return response.data;
}
