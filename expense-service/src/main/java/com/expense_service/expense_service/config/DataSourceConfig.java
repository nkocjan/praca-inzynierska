package com.expense_service.expense_service.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableConfigurationProperties({ShardADataSourceProperties.class, ShardBDataSourceProperties.class, ShardAReplicaDataSourceProperties.class,
        ShardBReplicaDataSourceProperties.class})
public class DataSourceConfig {

    @Bean
    public DataSource shardADataSource(ShardADataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }

    @Bean
    public DataSource shardBDataSource(ShardBDataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }

    @Bean
    public DataSource shardAReplicaDataSource(ShardAReplicaDataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }

    @Bean
    public DataSource shardBReplicaDataSource(ShardBReplicaDataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }

    @Bean
    @Primary
    public DataSource dataSource(
            DataSource shardADataSource,
            DataSource shardBDataSource,
            DataSource shardAReplicaDataSource,
            DataSource shardBReplicaDataSource
    ) {
        ShardRoutingDataSource routingDataSource = new ShardRoutingDataSource();

        Map<Object, Object> targetDataSources = new HashMap<>();

        targetDataSources.put(ShardType.SHARD_A_PRIMARY, shardADataSource);
        targetDataSources.put(ShardType.SHARD_B_PRIMARY, shardBDataSource);
        targetDataSources.put(ShardType.SHARD_A_REPLICA, shardAReplicaDataSource);
        targetDataSources.put(ShardType.SHARD_B_REPLICA, shardBReplicaDataSource);

        routingDataSource.setTargetDataSources(targetDataSources);

        routingDataSource.setDefaultTargetDataSource(shardADataSource);

        return routingDataSource;
    }
}