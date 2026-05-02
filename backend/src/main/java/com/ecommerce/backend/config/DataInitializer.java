package com.ecommerce.backend.config;

import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(ProductRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.saveAll(List.of(
                        new Product("Premium Wireless Headphones", "Noise-cancelling, over-ear headphones with 30-hour battery life.", new BigDecimal("299.99"), "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"),
                        new Product("Mechanical Keyboard", "Tenkeyless mechanical keyboard with RGB backlighting and tactile switches.", new BigDecimal("129.99"), "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80"),
                        new Product("4K Monitor", "27-inch 4K UHD monitor with HDR support and ultra-thin bezels.", new BigDecimal("399.99"), "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80"),
                        new Product("Ergonomic Mouse", "Wireless ergonomic mouse designed for comfort and precision.", new BigDecimal("79.99"), "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80")
                ));
            }
        };
    }
}
