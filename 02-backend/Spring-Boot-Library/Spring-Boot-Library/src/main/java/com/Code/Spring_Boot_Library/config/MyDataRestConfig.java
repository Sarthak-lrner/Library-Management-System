package com.Code.Spring_Boot_Library.config;

import com.Code.Spring_Boot_Library.entity.Book;
import com.Code.Spring_Boot_Library.entity.Message;
import com.Code.Spring_Boot_Library.entity.Review;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

/**
 * Configuration class for customizing Spring Data REST behavior.
 * It exposes entity IDs in JSON responses, disables certain HTTP methods,
 * and configures CORS for the REST repositories.
 */
@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    // Allowed origin for CORS requests (e.g., React frontend running locally)
    private static final String ALLOWED_ORIGIN = "https://localhost:3000";

    /**
     * Customize the Repository REST configuration.
     * - Expose IDs for Book and Review entities.
     * - Disable unsafe HTTP methods like DELETE, PUT, POST, PATCH.
     * - Configure CORS mappings for API endpoints.
     */
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config,
                                                     CorsRegistry cors) {

        // Define HTTP methods that should be disabled (read-only API)
        HttpMethod[] unsupportedActions = {
                HttpMethod.DELETE, HttpMethod.PUT, HttpMethod.POST, HttpMethod.PATCH
        };

        // Expose entity IDs in JSON response so frontend can access them
        config.exposeIdsFor(Book.class, Review.class, Message.class);

        // Disable HTTP methods for Book and Review entities
        disableHttpMethods(Book.class, config, unsupportedActions);
        disableHttpMethods(Review.class, config, unsupportedActions);
        disableHttpMethods(Message.class,config,unsupportedActions);

        // Configure CORS to allow frontend app to access /api/** endpoints
        cors.addMapping("/api/**")
                .allowedOrigins(ALLOWED_ORIGIN)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allowed HTTP methods
                .allowedHeaders("*")  // Allow all headers
                .allowCredentials(true); // Allow credentials like cookies, auth headers, etc.
    }

    /**
     * Helper method to disable specified HTTP methods for a given domain/entity class.
     *
     * @param domainType          the entity class to disable methods for
     * @param config              RepositoryRestConfiguration instance
     * @param unsupportedActions  array of HTTP methods to disable
     */
    private void disableHttpMethods(Class<?> domainType, RepositoryRestConfiguration config, HttpMethod[] unsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(domainType)
                // Disable unsupported HTTP methods on single item resources
                .withItemExposure((metadata, httpMethods) -> httpMethods.disable(unsupportedActions))
                // Disable unsupported HTTP methods on collection resources
                .withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(unsupportedActions));
    }
}
