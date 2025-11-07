package com.expense_service.expense_service.config;

import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "spring.datasource.shard-b2")
public class ShardBReplicaDataSourceProperties extends DataSourceProperties {
}
