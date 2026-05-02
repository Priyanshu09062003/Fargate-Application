package com.ecommerce.backend.dto;

import java.util.List;

public class OrderRequest {
    private String customerEmail;
    private List<OrderItemRequest> items;

    // Getters and Setters
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
}
