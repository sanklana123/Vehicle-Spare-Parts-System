package com.vehiclespareparts.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

/**
 * Configuration class for MongoDB.
 * Enables auditing to automatically populate @CreatedDate and @LastModifiedDate fields.
 */
@Configuration
@EnableMongoAuditing
public class MongoConfig {
}
