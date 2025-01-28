package com.example.wimo.cars;

import com.corundumstudio.socketio.AuthorizationResult;
import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class SocketIOConfig {

    private static final String SOCKET_HOST = "212.83.155.143";
    private static final int SOCKET_PORT = 3001;

    private final CarsService carsService;
    private final ObjectMapper objectMapper;
    private SocketIOServer server;

    @Bean
    public SocketIOServer socketIOServer() {
        try {
            Configuration config = new Configuration();
            config.setHostname(SOCKET_HOST);
            config.setPort(SOCKET_PORT);

            config.setAuthorizationListener(data -> {
                String appIdFromRequest = data.getHttpHeaders().get("app-id");
                if (appIdFromRequest != null && appIdFromRequest.equals("59ffc260-b63b-4d00-b14e-f2d1e0f26c94")) {
                    log.info("App-ID validé : {}", appIdFromRequest);
                    return AuthorizationResult.SUCCESSFUL_AUTHORIZATION;
                }
                log.warn("App-ID invalide : {}", appIdFromRequest);
                return AuthorizationResult.FAILED_AUTHORIZATION;
            });

            server = new SocketIOServer(config);

            // Listen for car updates
            server.addEventListener("car_update", String.class, (client, data, ackRequest) -> {
                try {
                    JsonNode carData = objectMapper.readTree(data);
                    String plate = carData.get("plate").asText();
                    BigDecimal lat = BigDecimal.valueOf(carData.get("lat").asDouble());
                    BigDecimal lon = BigDecimal.valueOf(carData.get("lon").asDouble());
                    BigDecimal speed = BigDecimal.valueOf(carData.get("speed").asDouble());

                    Cars updatedCar = carsService.updateCarLocation(plate, lat, lon, speed);
                    if (updatedCar != null) {
                        log.info("Updated car location: {}", plate);
                    } else {
                        log.warn("Car not found: {}", plate);
                    }
                } catch (Exception e) {
                    log.error("Error processing car update: {}", e.getMessage());
                }
            });

            server.start();
            return server;

        } catch (Exception e) {
            log.error("Failed to start SocketIO server: {}", e.getMessage());
            return null;
        }
    }

    @PreDestroy
    public void stopSocketIOServer() {
        if (server != null) {
            try {
                server.stop();
                log.info("SocketIO server stopped");
            } catch (Exception e) {
                log.error("Error stopping SocketIO server: {}", e.getMessage());
            }
        }
    }
}