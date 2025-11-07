package com.expense_service.expense_service.config;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Aspect
@Component
@Slf4j
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
public class ShardAspect {
    @Before("execution(public * com.expense_service.expense_service.service.ExpenseCommandService.*(.., java.util.UUID)) && args(.., userId)")
    public void setShardKeyOnServiceMethod(UUID userId) {
        if (userId == null) {
            log.warn("ID użytkownika jest null. Shard nie zostanie ustawiony.");
            return;
        }
        Shard baseShard = ShardSelectionStrategy.getShard(userId);

        ShardType targetShard = (baseShard == Shard.SHARD_A) ? ShardType.SHARD_A_PRIMARY : ShardType.SHARD_B_PRIMARY;

        ShardContextHolder.setShardKey(targetShard);
    }

    @Before("execution(public * com.expense_service.expense_service.service.ExpenseQueryService.*(.., java.util.UUID)) && args(.., userId)")
    public void setReadShardKey(UUID userId) {
        if (userId == null) {
            log.warn("ID użytkownika jest null dla QueryService. Shard nie zostanie ustawiony.");
            return;
        }

        Shard baseShard = ShardSelectionStrategy.getShard(userId);

        ShardType targetShard = (baseShard == Shard.SHARD_A) ? ShardType.SHARD_A_REPLICA : ShardType.SHARD_B_REPLICA;

        ShardContextHolder.setShardKey(targetShard);
    }

    @After("execution(public * com.expense_service.expense_service.service.ExpenseCommandService.*(.., java.util.UUID)) || " +
            "execution(public * com.expense_service.expense_service.service.ExpenseQueryService.*(.., java.util.UUID))")
    public void clearShardKeyAfterServiceMethod() {
        ShardContextHolder.clearShardKey();
    }
}