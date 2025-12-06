# Order Service Documentation

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

## Sequence Diagrams

### Create Order

```mermaid
sequenceDiagram
    participant Client
    participant OrderService
    participant AuthService
    participant Database

    Client->>OrderService: POST /orders (user_id, items)
    OrderService->>AuthService: Validate User (token)
    AuthService-->>OrderService: Valid/Invalid
    alt Invalid User
        OrderService-->>Client: 401 Unauthorized
    else Valid User
        OrderService->>Database: Insert Order (PENDING)
        OrderService->>Database: Insert Order Items
        OrderService->>Database: Insert Order History
        OrderService-->>Client: 201 Created (orderId)
    end
```

### Update Status (Ship Order)

```mermaid
sequenceDiagram
    participant Client
    participant OrderService
    participant PaymentService
    participant Database

    Client->>OrderService: PATCH /orders/:id/status (SHIPPED)
    OrderService->>Database: Get Order
    alt Order Not Found
        OrderService-->>Client: 404 Not Found
    else Order Found
        OrderService->>PaymentService: Get Payment Status
        PaymentService-->>OrderService: Status (PAID/PENDING)
        alt Payment Not PAID
            OrderService-->>Client: 400 Payment not verified
        else Payment PAID
            OrderService->>Database: Update Status (SHIPPED)
            OrderService->>Database: Insert History
            OrderService-->>Client: 200 OK
        end
    end
```

## API Specifications

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
- **Response**: `200 OK` (Order + Items + History)

### 4. Update Status
- **Endpoint**: `PATCH /orders/:id/status`
- **Body**: `{ "status": "SHIPPED" }`
- **Response**: `200 OK`

### 5. Cancel Order
- **Endpoint**: `DELETE /orders/:id`
- **Response**: `200 OK`
