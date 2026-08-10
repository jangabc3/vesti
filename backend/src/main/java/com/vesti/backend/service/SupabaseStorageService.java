package com.vesti.backend.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

@Service
public class SupabaseStorageService {

    private final RestClient restClient;

    private final String supabaseUrl;
    private final String secretKey;
    private final String bucket;

    public SupabaseStorageService(
            @Value("${supabase.url}") String supabaseUrl,
            @Value("${supabase.secret-key}") String secretKey,
            @Value("${supabase.storage.bucket}") String bucket) {

        this.supabaseUrl = supabaseUrl;
        this.secretKey = secretKey;
        this.bucket = bucket;

        this.restClient = RestClient.builder()
                .baseUrl(supabaseUrl)
                .build();
    }

    public String upload(MultipartFile file, Long userId) {

        String originalFilename = file.getOriginalFilename();
        String extension = getExtension(originalFilename);

        String fileName = UUID.randomUUID() + extension;

        String filePath = "user-" + userId + "/" + fileName;

        try {
            restClient.post()
                    .uri("/storage/v1/object/{bucket}/{filePath}",
                            bucket,
                            filePath)
                    .header("Authorization", "Bearer " + secretKey)
                    .header("apikey", secretKey)
                    .contentType(
                            MediaType.parseMediaType(
                                    file.getContentType()))
                    .body(file.getBytes())
                    .retrieve()
                    .toBodilessEntity();

        } catch (Exception exception) {
            throw new RuntimeException(
                    "이미지 업로드에 실패했습니다.",
                    exception);
        }

        return supabaseUrl
                + "/storage/v1/object/public/"
                + bucket
                + "/"
                + filePath;
    }

    private String getExtension(String filename) {

        if (filename == null || !filename.contains(".")) {
            return "";
        }

        return filename.substring(
                filename.lastIndexOf("."));
    }
}