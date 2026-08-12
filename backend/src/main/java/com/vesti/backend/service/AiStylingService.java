package com.vesti.backend.service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vesti.backend.client.OpenAiClient;
import com.vesti.backend.client.OpenAiClient.AiModelResult;
import com.vesti.backend.client.OpenAiClient.CoordinationItem;
import com.vesti.backend.client.OpenAiClient.WardrobeItem;
import com.vesti.backend.config.CurrentUserProvider;
import com.vesti.backend.dto.request.AiStylingRequest;
import com.vesti.backend.dto.response.AiStylingResponse;
import com.vesti.backend.dto.response.AiStylingResponse.RecommendedLookResponse;
import com.vesti.backend.dto.response.AiStylingResponse.UsedClothingResponse;
import com.vesti.backend.entity.Clothing;
import com.vesti.backend.entity.Coordination;
import com.vesti.backend.entity.User;
import com.vesti.backend.repository.ClothingRepository;
import com.vesti.backend.repository.CoordinationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AiStylingService {

    private final ClothingRepository clothingRepository;
    private final CoordinationRepository coordinationRepository;
    private final CurrentUserProvider currentUserProvider;
    private final OpenAiClient openAiClient;

    public AiStylingResponse recommend(
            AiStylingRequest request) {

        User user = currentUserProvider.getCurrentUser();

        List<Clothing> clothes = clothingRepository.findByUser(user);

        List<Coordination> coordinations = coordinationRepository.findByUser(user);

        List<WardrobeItem> wardrobeContext = clothes.stream()
                .map(clothing -> new WardrobeItem(
                        clothing.getId(),
                        clothing.getName(),
                        clothing.getCategory(),
                        clothing.getColor(),
                        clothing.getSeason()))
                .toList();

        List<CoordinationItem> coordinationContext = coordinations.stream()
                .map(coordination -> new CoordinationItem(
                        coordination.getId(),
                        coordination.getName(),
                        coordination.getDescription()))
                .toList();

        AiModelResult modelResult = openAiClient.createStylingRecommendation(
                request.getMessage(),
                wardrobeContext,
                coordinationContext);

        Map<Long, Clothing> clothingMap = clothes.stream()
                .collect(Collectors.toMap(
                        Clothing::getId,
                        Function.identity()));

        Map<Long, Coordination> coordinationMap = coordinations.stream()
                .collect(Collectors.toMap(
                        Coordination::getId,
                        Function.identity()));

        List<RecommendedLookResponse> recommendedLooks = modelResult.getRecommendedLooks() == null
                ? List.of()
                : modelResult.getRecommendedLooks()
                        .stream()
                        .filter(result -> result.getCoordinationId() != null)
                        .filter(result -> coordinationMap.containsKey(
                                result.getCoordinationId()))
                        .limit(3)
                        .map(result -> {

                            Coordination coordination = coordinationMap.get(
                                    result.getCoordinationId());

                            return RecommendedLookResponse.builder()
                                    .coordinationId(
                                            coordination.getId())
                                    .name(
                                            coordination.getName())
                                    .reason(
                                            result.getReason())
                                    .build();
                        })
                        .toList();

        List<UsedClothingResponse> usedClothes = modelResult.getUsedClothes() == null
                ? List.of()
                : modelResult.getUsedClothes()
                        .stream()
                        .filter(result -> result.getClothingId() != null)
                        .filter(result -> clothingMap.containsKey(
                                result.getClothingId()))
                        .map(result -> {

                            Clothing clothing = clothingMap.get(
                                    result.getClothingId());

                            return UsedClothingResponse.builder()
                                    .clothingId(
                                            clothing.getId())
                                    .name(
                                            clothing.getName())
                                    .category(
                                            clothing.getCategory())
                                    .color(
                                            clothing.getColor())
                                    .season(
                                            clothing.getSeason())
                                    .imageUrl(
                                            clothing.getImageUrl())
                                    .build();
                        })
                        .toList();

        List<String> missingItems = modelResult.getMissingItems() == null
                ? List.of()
                : modelResult.getMissingItems()
                        .stream()
                        .filter(item -> item != null && !item.isBlank())
                        .distinct()
                        .limit(5)
                        .toList();

        return AiStylingResponse.builder()
                .message(request.getMessage())
                .title(modelResult.getTitle())
                .reason(modelResult.getReason())
                .recommendedLooks(recommendedLooks)
                .usedClothes(usedClothes)
                .missingItems(missingItems)
                .build();
    }
}