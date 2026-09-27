package com.vehiclespareparts.config;

import com.vehiclespareparts.model.Customer;
import com.vehiclespareparts.model.Order;
import com.vehiclespareparts.model.SparePart;
import com.vehiclespareparts.model.Supplier;
import com.vehiclespareparts.model.User;
import com.vehiclespareparts.repository.CustomerRepository;
import com.vehiclespareparts.repository.OrderRepository;
import com.vehiclespareparts.repository.SparePartRepository;
import com.vehiclespareparts.repository.SupplierRepository;
import com.vehiclespareparts.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private SparePartRepository partRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SupplierRepository supplierRepository;
    
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (partRepository.count() == 0) {
            SparePart part1 = SparePart.builder()
                    .partNumber("BRK-001")
                    .name("Ceramic Brake Pads")
                    .description("High performance ceramic brake pads for luxury sedans.")
                    .categoryId("Brakes")
                    .brand("Brembo")
                    .vehicleBrand("Mercedes-Benz")
                    .vehicleModel("C-Class")
                    .manufactureYear(2022)
                    .quantity(45)
                    .minimumStockLevel(10)
                    .buyingPrice(new BigDecimal("120.00"))
                    .sellingPrice(new BigDecimal("185.50"))
                    .supplierId("SUP-001")
                    .location("Aisle 4, Bin B")
                    .status("ACTIVE")
                    .partImageUrl("https://images.unsplash.com/photo-1600705646182-36cce7d57367?auto=format&fit=crop&q=80&w=600")
                    .carImageUrl("https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600")
                    .partSpecifications("Material: Ceramic\\nThickness: 18mm\\nPosition: Front")
                    .carSpecifications("Engine: 2.0L Turbo\\nBody: Sedan\\nDrive: RWD")
                    .build();

            SparePart part2 = SparePart.builder()
                    .partNumber("FLT-002")
                    .name("Premium Oil Filter")
                    .description("Extended life oil filter for maximum engine protection.")
                    .categoryId("Filters")
                    .brand("Bosch")
                    .vehicleBrand("BMW")
                    .vehicleModel("3 Series")
                    .manufactureYear(2021)
                    .quantity(8)
                    .minimumStockLevel(20)
                    .buyingPrice(new BigDecimal("12.50"))
                    .sellingPrice(new BigDecimal("24.99"))
                    .supplierId("SUP-002")
                    .location("Aisle 1, Bin A")
                    .status("ACTIVE")
                    .partImageUrl("https://images.unsplash.com/photo-1635768297745-f018d45cc4e8?auto=format&fit=crop&q=80&w=600")
                    .carImageUrl("https://images.unsplash.com/photo-1556189250-93ba23f528b8?auto=format&fit=crop&q=80&w=600")
                    .partSpecifications("Type: Spin-on\\nMedia: Synthetic\\nMicron Rating: 20")
                    .carSpecifications("Engine: 2.0L TwinPower Turbo\\nBody: Sedan")
                    .build();

            partRepository.saveAll(Arrays.asList(part1, part2));
            System.out.println("Spare parts seeded successfully.");
        }

        List<User> initialUsers = Arrays.asList(
            User.builder()
                .name("Admin User")
                .email("admin@autoparts.com")
                .password(passwordEncoder.encode("password"))
                .role("ADMIN")
                .status("ACTIVE")
                .department("Management")
                .build(),
            User.builder()
                .name("Store Manager")
                .email("manager@autoparts.com")
                .password(passwordEncoder.encode("password"))
                .role("MANAGER")
                .status("ACTIVE")
                .department("Sales")
                .build(),
            User.builder()
                .name("Biyan Wilakethaka")
                .email("biyan@autoparts.com")
                .password(passwordEncoder.encode("password123"))
                .role("ADMIN")
                .status("ACTIVE")
                .department("Executive & IT")
                .build(),
            User.builder()
                .name("Kasun Perera")
                .email("kasun@autoparts.com")
                .password(passwordEncoder.encode("password123"))
                .role("MANAGER")
                .status("ACTIVE")
                .department("Inventory Control")
                .build(),
            User.builder()
                .name("Nimali Fernando")
                .email("nimali@autoparts.com")
                .password(passwordEncoder.encode("password123"))
                .role("STAFF")
                .status("ACTIVE")
                .department("Customer Relations")
                .build(),
            User.builder()
                .name("Saman Silva")
                .email("saman@autoparts.com")
                .password(passwordEncoder.encode("password123"))
                .role("STAFF")
                .status("ACTIVE")
                .department("Warehouse & Logistics")
                .build()
        );

        for (User u : initialUsers) {
            if (!userRepository.existsByEmail(u.getEmail())) {
                userRepository.save(u);
                System.out.println("Seeded user: " + u.getEmail());
            }
        }


        if (supplierRepository.count() == 0) {
            Supplier bosch = Supplier.builder()
                    .name("Bosch Auto Parts")
                    .contactPerson("Michael Scott")
                    .email("sales@bosch-auto.com")
                    .phone("+1-555-0192")
                    .address("123 Auto Lane, Detroit, MI")
                    .specializedBrands("BMW, Mercedes-Benz, Audi")
                    .rating(4.8)
                    .build();
            
            Supplier denso = Supplier.builder()
                    .name("Denso Manufacturing")
                    .contactPerson("Jim Halpert")
                    .email("wholesale@denso.com")
                    .phone("+1-555-0183")
                    .address("456 Industrial Pkwy, Kyoto, JP")
                    .specializedBrands("Toyota, Honda, Nissan")
                    .rating(4.6)
                    .build();
                    
            supplierRepository.saveAll(Arrays.asList(bosch, denso));
            System.out.println("Suppliers seeded successfully.");
        }

        if (customerRepository.count() == 0) {
            Customer john = Customer.builder()
                    .name("John Doe Automotive")
                    .email("johndoe@gmail.com")
                    .phone("+1-555-8888")
                    .address("789 Garage St, NY")
                    .vehicleModels("Mercedes-Benz C-Class, BMW 3 Series")
                    .loyaltyPoints(1450)
                    .status("ACTIVE")
                    .build();
                    
            Customer jane = Customer.builder()
                    .name("Jane Smith Mechanics")
                    .email("jane.smith@mechanics.org")
                    .phone("+1-555-9999")
                    .address("321 FixIt Blvd, CA")
                    .vehicleModels("Toyota Camry, Honda Civic")
                    .loyaltyPoints(320)
                    .status("ACTIVE")
                    .build();
                    
            customerRepository.saveAll(Arrays.asList(john, jane));
            System.out.println("Customers seeded successfully.");
        }

        if (orderRepository.count() == 0) {
            List<Customer> customers = customerRepository.findAll();
            List<SparePart> parts = partRepository.findAll();
            
            if (!customers.isEmpty() && !parts.isEmpty()) {
                Order order1 = Order.builder()
                        .orderNumber("ORD-1001")
                        .customerId(customers.get(0).getId())
                        .customerName(customers.get(0).getName())
                        .sparePartId(parts.get(0).getId())
                        .sparePartName(parts.get(0).getName())
                        .quantity(2)
                        .unitPrice(parts.get(0).getSellingPrice())
                        .totalAmount(parts.get(0).getSellingPrice().multiply(new BigDecimal("2")))
                        .status("COMPLETED")
                        .shippingAddress(customers.get(0).getAddress())
                        .orderDate(LocalDateTime.now().minusDays(5))
                        .build();
                
                Order order2 = Order.builder()
                        .orderNumber("ORD-1002")
                        .customerId(customers.get(1).getId())
                        .customerName(customers.get(1).getName())
                        .sparePartId(parts.get(1).getId())
                        .sparePartName(parts.get(1).getName())
                        .quantity(5)
                        .unitPrice(parts.get(1).getSellingPrice())
                        .totalAmount(parts.get(1).getSellingPrice().multiply(new BigDecimal("5")))
                        .status("PENDING")
                        .shippingAddress(customers.get(1).getAddress())
                        .orderDate(LocalDateTime.now().minusDays(1))
                        .build();
                
                orderRepository.saveAll(Arrays.asList(order1, order2));
                System.out.println("Orders seeded successfully.");
            }
        }
    }
}
