package com.expense_service.expense_service.config;

public class ShardContextHolder {
    private static final ThreadLocal<ShardType> contextHolder = new ThreadLocal<>();

    public static void setShardKey(ShardType shardKey) {
        contextHolder.set(shardKey);
    }

    public static ShardType getShardKey() {
        return contextHolder.get();
    }

    public static void clearShardKey() {
        contextHolder.remove();
    }
}
