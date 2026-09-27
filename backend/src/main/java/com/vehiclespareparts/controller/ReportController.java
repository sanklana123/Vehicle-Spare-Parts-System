package com.vehiclespareparts.controller;

import com.vehiclespareparts.model.Customer;
import com.vehiclespareparts.model.Order;
import com.vehiclespareparts.model.SparePart;
import com.vehiclespareparts.repository.CustomerRepository;
import com.vehiclespareparts.repository.OrderRepository;
import com.vehiclespareparts.repository.SparePartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReportController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private SparePartRepository sparePartRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        Map<String, Object> summary = new HashMap<>();

        List<Order> allOrders = orderRepository.findAll();
        List<SparePart> allParts = sparePartRepository.findAll();
        List<Customer> allCustomers = customerRepository.findAll();

        // Total Revenue
        BigDecimal totalRevenue = allOrders.stream()
                .filter(o -> !"CANCELLED".equals(o.getStatus()))
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        summary.put("totalRevenue", totalRevenue);

        // Total Orders
        summary.put("totalOrders", allOrders.size());

        // Total Customers
        summary.put("totalCustomers", allCustomers.size());

        // Low Stock Items
        long lowStockCount = allParts.stream()
                .filter(p -> p.getQuantity() != null && p.getMinimumStockLevel() != null && p.getQuantity() <= p.getMinimumStockLevel())
                .count();
        summary.put("lowStockCount", lowStockCount);

        // Simple mock of monthly data for demo
        Map<String, Integer> salesData = new HashMap<>();
        salesData.put("Jan", 4000);
        salesData.put("Feb", 3000);
        salesData.put("Mar", 2000);
        salesData.put("Apr", 2780);
        salesData.put("May", 1890);
        salesData.put("Jun", 2390);
        salesData.put("Jul", totalRevenue.intValue() > 0 ? totalRevenue.intValue() : 3490);
        summary.put("salesData", salesData);

        return ResponseEntity.ok(summary);
    }
}
