package com.expense_service.expense_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class ExpenseServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(ExpenseServiceApplication.class, args);
	}
}