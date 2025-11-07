package com.expense_service.expense_service.config;

import lombok.extern.slf4j.Slf4j;
import java.util.UUID;

@Slf4j
public class ShardSelectionStrategy {

    public static Shard getShard(UUID userId) {
        if (userId == null) {
            throw new IllegalArgumentException("UserId nie może być null");
        }

        long valueForSharding = userId.getLeastSignificantBits();

        int moduloResult = (int) (Math.abs(valueForSharding) % 2);

        System.out.println("Wartość do sharding: " + valueForSharding + ", moduloResult: " + ((moduloResult == 0) ? Shard.SHARD_A : Shard.SHARD_B));

        return (moduloResult == 0) ? Shard.SHARD_A : Shard.SHARD_B;
    }
}