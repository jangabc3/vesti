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

    // 업로드 허용 이미지 타입
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

    // 이미지 업로드
    public String upload(
            MultipartFile file,
            Long userId) {

        // 1. 이미지 파일 검증
        validateImage(file);

        // 2. 원본 파일명에서 확장자 추출
        String originalFilename = file.getOriginalFilename();
        String extension = getExtension(originalFilename);

        // 3. 중복되지 않는 파일명 생성
        String fileName = UUID.randomUUID() + extension;

        // 4. 사용자별 폴더 경로 생성
        String filePath = "user-" + userId + "/" + fileName;

        try {
            // 5. Supabase Storage에 이미지 업로드
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

        // 6. 업로드된 이미지의 Public URL 반환
        return supabaseUrl
                + "/storage/v1/object/public/"
                + bucket
                + "/"
                + filePath;
    }

    // 기존 이미지 삭제
    public void delete(String imageUrl) {

        // 삭제할 이미지가 없으면 아무것도 하지 않음
        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }

        // 우리가 생성한 Public URL의 앞부분
        String publicUrlPrefix = supabaseUrl
                + "/storage/v1/object/public/"
                + bucket
                + "/";

        // VESTI Storage URL이 아니라면 삭제하지 않음
        if (!imageUrl.startsWith(publicUrlPrefix)) {
            return;
        }

        // 전체 URL에서 Storage 내부 파일 경로만 추출
        String filePath = imageUrl.substring(publicUrlPrefix.length());

        try {
            restClient.delete()
                    .uri(
                            "/storage/v1/object/{bucket}/{filePath}",
                            bucket,
                            filePath)
                    .header("apikey", secretKey)
                    .retrieve()
                    .toBodilessEntity();

        } catch (Exception exception) {
            throw new RuntimeException(
                    "이미지 삭제에 실패했습니다.",
                    exception);
        }
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