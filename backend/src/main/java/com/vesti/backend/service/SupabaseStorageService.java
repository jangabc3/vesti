package com.vesti.backend.service;

import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import com.vesti.backend.exception.InvalidImageFileException;

@Service
public class SupabaseStorageService {

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp");

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

    public String upload(
            MultipartFile file,
            Long userId) {

        // 이미지 파일 검증
        validateImage(file);

        String originalFilename = file.getOriginalFilename();
        String extension = getExtension(originalFilename);

        String fileName = UUID.randomUUID() + extension;

        String filePath = "user-" + userId + "/" + fileName;

        try {
            restClient.post()
                    .uri(
                            "/storage/v1/object/{bucket}/{filePath}",
                            bucket,
                            filePath)
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

    // 이미지 파일 검증
    private void validateImage(
            MultipartFile file) {

        // 파일이 없거나 비어 있는 경우
        if (file == null || file.isEmpty()) {
            throw new InvalidImageFileException();
        }

        String contentType = file.getContentType();

        // JPG, PNG, WebP가 아닌 경우
        if (contentType == null
                || !ALLOWED_IMAGE_TYPES.contains(contentType)) {

            throw new InvalidImageFileException();
        }
    }

    // 파일 확장자 추출
    private String getExtension(
            String filename) {

        if (filename == null
                || !filename.contains(".")) {

            return "";
        }

        return filename.substring(
                filename.lastIndexOf("."));
    }
}