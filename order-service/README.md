# Order Management Microservice

## Overview
This service handles the full lifecycle of orders, including creation, status updates, cancellation, and history tracking.

## Database Schema

```mermaid
erDiagram
    ORDERS {
        int id PK
        int user_id
        decimal total_amount
        enum status
        timestamp created_at
        timestamp updated_at
    }
    ORDER_ITEMS {
        int id PK
        int order_id FK
        int product_id
        int quantity
        decimal price
    }
    ORDER_HISTORY {
        int id PK
        int order_id FK
        string status
        timestamp changed_at
    }

    ORDERS ||--|{ ORDER_ITEMS : contains
    ORDERS ||--|{ ORDER_HISTORY : tracks
```

## Sequence Diagram: Create Order

```mermaid
sequenceDiagram
    participant Client
    participant OrderService
    participant AuthService
    participant Database

    Client->>OrderService: POST /orders (user_id, items)
    OrderService->>AuthService: Validate User (user_id)
    alt User Invalid
        AuthService-->>OrderService: 401 Unauthorized
        OrderService-->>Client: 401 Unauthorized
    else User Valid
        AuthService-->>OrderService: 200 OK
        OrderService->>Database: Begin Transaction
        OrderService->>Database: Insert Order
        OrderService->>Database: Insert Order Items
        OrderService->>Database: Insert Order History
        OrderService->>Database: Commit Transaction
        OrderService-->>Client: 201 Created (orderId)
    end
```

## API Specification

### 1. Create Order
- **Endpoint**: `POST /orders`
- **Body**:
  ```json
  {
    "user_id": 1,
    "items": [
      { "product_id": 101, "quantity": 2, "price": 50.00 }
    ]
  }
  ```
- **Response**: `201 Created`

### 2. Get User Orders
- **Endpoint**: `GET /orders?user_id=1`
- **Response**: `200 OK` (List of orders)

### 3. Get Order Details
- **Endpoint**: `GET /orders/:id`
- **Response**: `200 OK` (Order details + items + history)

### 4. Update Order Status
- **Endpoint**: `PATCH /orders/:id/status`
- **Body**: `{ "status": "SHIPPED" }`
- **Response**: `200 OK`

### 5. Cancel Order
- **Endpoint**: `DELETE /orders/:id`
- **Response**: `200 OK`
