## Architecture & Design Questions

1. System architecture
The SADCOMS solutitons is structured using a Hybrid Architecture. Where the solution as whole is  modular and monolithic, with event driven architecture. The solution is made up of 5 projects. 

The first being the API. It is the entry point to back end services and is responsible for handing server requests gracefully. 

The Domain project holds the entities and business logic for the platform. It is independent of the infrastructure which make the business logic independently testable (no EF Core, no HTTP dependencies)

2. Handling peak writes
There are few options for handling scaling. From a development operations view a Load-Balancer can be run in front of the API instance(s).
We could also decouple writes from order processing. On every order, we could publish to the queue first and have a worker listen to the order queue to save and process the order. The outbox pattern already has the foundation for this idea. 

Lastly, we could use a caching-aside strategy using Redis to reduce DB load. 

3. Message reliability
The messages processed by the API are persisted to the database in same transaction as the order. That new message in the outbox-messages is read by the API's Background Worker Service, which checks for unprocessed messages in the OutBoxMessages. It then publishes the unprocessed messages to the 'order.created' queue which is then consumed by the Worker servive that processes the order. This is referred to as the Outbox pattern. 

If RabbitMQ is down, the message stays in OutboxMessages with `ProcessedAt = null` and is retried on the next Background Worker Service poll cycle — that's the reliability guarantee.



4. API versioning 
The most straight forward versioning strategy is URL versioning. This involves add a version number to api controller calls i.e. `api/v1/orders`. 
When an endpoint is updated for a breaking change, the version number can be increased by 1 to `api/v2/orders`. Not all changes require a new version — adding optional fields or new endpoints is non-breaking and can be released without incrementing the version.

I would then use a package like Asp.Versioning.Mvc to mark the old version of the API (v1) as  deprecated. 

5. Security considerations using Microsoft Entra / JWT
The API controllers are protected by JWT middleware to validate the source of the api call. Each api call's header is checked for a bearer token which gets validated using a DevSecret. If the token is not present the call will not go through.

The decrypted token would contain information about the user and their authorization to access the required api endpoint. 

For the current solution, I created a token controller to return a mocked out version user auth token that would be provided by Microsoft Entra ID. This would be use full for local development without having to login into an actual Entra ID testing account.

For production we would use a real EntraID authentication endpoint which enforces HTTPS. We would also set strict token expiry to limit damage window if a token is ever stolen. I would also leverage the scp (scope) variable to specify specific permission. Each endpoint  would then be decorated with the relevant scope using the `[RequiredScope("orders.write")]` decorator.

6. Testing pyramid
- Unit tests (Base - usually a very large number of them)
Domain entities and validation logic (fast, no dependencies). Tests business logic in isolation, with no infrastructure dependencies. We can write a lot of them as they are usually quick to write and run relative quickly when ran. 

Integration tests (middle - usually fewer than Unit tests)
This layer is to test how components (database, middleware, controllers) of the system work together.

End-to-end tests (top — fewest)
This tests the full system from UI to database. Used sparingly to validate builds. Libraries like `Playwright` can be used to automate E2E testing. 

7. Observability
Structured logs can by achieved using Serilog. It provides structured key value pairs that can be filtered through ie. `{ "event": "OrderCreated", "orderId": "123", "customerId": "456", "amount": 199.97 }`
Every log entry should include the correlation ID so we can filter all logs for a single request across services.

Distributed tracing can be achieved using OpenTelemetry, which is the .NET standard. This allows us to give each request a correlationID to track the request as it flows through different services(API->RabbitMQ->Worker). Cloud providers (AWS, Azure etc.) have insight solution to provide this out of the box. 

Metrics can be derived using System.Diagnostics.Metrics+Grafana+Prometheus in /NET. Examples of metrics we would track are:
- Orders created per minute
- API response time (p95, p99)
- Queue depth (how many unprocessed outbox messages)
- Error rate
etc.

8. Performance considerations
Indexing - I would add indexes for order and customer look up. Database look ups for a given table retireieve the whole database table and traverses through it running it against filters and joins to build up the result set. If we know what fields to filter by, we can create an index table with just the columns for the fields used in the look up. EF Core generates indexes for foreigh key columns i.e. `9CustomerId, OrderId)` For this solution the composite keys would be:
 - Order - (CustomerId, Status, Created)
 - Customer - (Name, Email)

Caching - as mentioned in question 2, we could use a caching-aside strategy using Redis to reduce DB read load. This means that on adds and updates to a database table the current cache on the API is invalidated and will be refreshed with a list of Orders/Customers from the result set of a database retrieval query. The API can then use that cached collection to do look ups for customer and order data.

Backpressure - when message queue request become bloated and the queue is overwhelmed with messages (the OutboxMessages table growing with unprocessed messages is a signal), we would return an error `429 Too Many Requests` to the user inidicating that the user that the server requests are high er at the moment and they should try again later. 

We could also use ASP.NET Core's rate limiter `builder.Services.AddRateLimiter` to set the permitteed rate of requests. Again, once the limit is hit the service return `429 Too Many Requests`

9. Data retention and compliance considerations
Data retention in South Africa is guided by the POPIA (Protection of Personal Information Act) privacy. This is the SADC equivalent of GDPR. It defines principles for compliance in terms of acquisition, usage and management of user data. In terms of this solution, a few apply.

Purpose limitation limits data collection to only what the platform needs. For our case (Name, Email, CountryCode) are justified. ID numbers etc. would not be required and would not be collected. 

Users are to be notified what data of theirs is collected. They can also request for an export of their data and request its deletion. 

There is also a retention limit to be made known to users. Once that period has passed, user data should be anonymized and the user should be notified. Should a data breach occur involving a customer's data, they are to be notified with a reasonable time. 

User personal information (Customer.Email) should be encrypted at rest using AES-256 and only decrypted by the API for authorised purposes.

Access to the data user data (Customer table) should be least-privileged access and have documented policy, personnel and justification for data retention.

10. GraphQL
GraphQL is a query language for API's. It returns objects in the "shape" a given client requests. No more, no less. 

For SADCOMS, GraphQL makes sense for reporting dashboard that needs different shapes and aggregations of data. It can also be useful for bandwidth sensitive solutions where we want to return just what is needed. 

GraphQl queries present a unqiue problem where queries do not scale well. For our case if 100 orders need customer data, that would be a 100 DBqueries. We can use GraphQL's batching mechanism (DataLoader) to bypass this problem. 

A REST API makes sense for this solution as the response shape is fixed, caching is easy and tooling is mature.
GraphQL would be a valuable addition as a read-only layer for reporting or a mobile application.

## SQL SECTION
### 1. Pagination query
```sql
SELECT
    Id,
    CustomerId,
    Status,
    TotalAmount,
    CreatedAt
FROM Orders
ORDER BY CreatedAt DESC
OFFSET (@page - 1) * @pageSize ROWS
FETCH NEXT @pageSize ROWS ONLY;
```
- `ORDER BY` is required for consistent pagination — without it SQL Server returns rows in unpredictable order. 
- `OFFSET` skips rows from previous pages
- `FETCH NEXT` limits the result set.

### 2. Top spenders
```sql
SELECT
    c.Name,
    SUM(o.TotalAmount) AS TotalSpend
FROM Customers c
INNER JOIN Orders o ON o.CustomerId = c.Id
WHERE o.CreatedAt >= DATEADD(DAY, -90, GETDATE())
GROUP BY c.Id, c.Name
ORDER BY TotalSpend DESC;
```

### 3. Index strategy
```sql
CREATE INDEX IX_Orders_CustomerId ON Orders(CustomerId, Status, CreatedAt);
```

A composite index allows to filter by one or more combinations of columns in the index i.e. `CustomerId` OR `CustomerId, Status` OR `CustomerId, Status, CreatedAt`. This is with the assumption that the cusomterId filter will be the most used.

### 4. Execution plan and removing key look ups
Execution plan - This is a detailed report/visualization of the most efficient way to retrieve data or run a given query.
Removing key look ups:
- a key lookup happens when an index doesn't contain all the columns the query needs, so SQL Server has to go back to the main table to fetch the missing columns. To remove them we can append a covering index of commonly attached columns to the index i.e.
```sql
SELECT TotalAmount, CurrencyCode FROM Orders WHERE CustomerId = '123'; --is expensive at scale

CREATE INDEX IX_Orders_CustomerId 
ON Orders(CustomerId, Status, CreatedAt)
INCLUDE (TotalAmount, CurrencyCode);
```


### 5. Optimistic concurrency using rowversion.
Optimistic concurrency refers to the concept of checking a record's value state when saving to the database rather than locking that record from being read or updated by other resources. The idea is that conflicts when saving are rare.

To achieve it in our solution, the Order Entity has a RowVersion field. This is a type that is auto-incremented by a SQL SERVER when an Order record is update. i.e.
- You read an order to update it — `RowVersion = 0x0000000000000001`
- Someone else updates the order — `RowVersion becomes 0x0000000000000002`
- You try to save — EF sends the original RowVersion in the WHERE clause:
```sql
UPDATE Orders
SET Status = 2
WHERE Id = '123' 
AND RowVersion = 0x0000000000000001  -- no longer matches
```
- zero rows affected - concurrency exception thrown and we tell the user that the record was updated and asked them to try again 

### 6. Deadlock scenario and mitigation.
A deadlock occurs when 2 SQL transactions are waiting for another to release a lock on a resource and neither one of them can move proceed with their transaction. 

i.e. 2 transations, waiting for the other to finish
Transaction 1:                    Transaction 2:
1. Lock Customer row (Id=1)       1. Lock Order row (Id=99)
2. Try to lock Order row (Id=99)  2. Try to lock Customer row (Id=1)
   → WAITING for 2                   → WAITING for 1

- SQL picks one as the deadlock victim and rolls it back with an error. 

To avoid this we can keep transactions short and be aware of the order in which resources are locked. This explicitly avoids the scenario stated above. Also, when an error mentioned above is thrown, we can retry the transaction `options.EnableRetryOnFailure(maxRetryCount: 3);` Db context definition

### 7. Window function example
```sql
SELECT
    CustomerId,
    TotalAmount,
    CreatedAt,
    SUM(TotalAmount) OVER (
        PARTITION BY CustomerId
        ORDER BY CreatedAt
    ) AS RunningTotal
FROM Orders
ORDER BY CustomerId, CreatedAt;
```

The `ORDER BY` inside `OVER()` controls the accumulation window — each row's RunningTotal is the sum of all previous rows for that customer up to and including the current CreatedAt. 

### 8. Partitioning strategy for large datasets
Table partitioning splits a large table into smaller physical chunks based on a column value, while keeping it looking like a single table to the application.

For SADCOMS, `CreatedAt` is the right partition key because orders are almost always queried by date range. SQL Server can then skip entire partitions that fall outside the filter — if you query for orders from 2026, it only scans the 2026 partition, not the whole table.

It also makes archiving clean — old partitions (2023, 2024) can be migrated out to an archive table instantly, without running a slow row-by-row delete.

The pattern fits naturally because new orders land in the current year's partition (high activity), while old ones sit in older partitions that rarely change

### 9. Outbox pattern database design.
The outbox pattern is outlined in `3. Message reliability` above. Below is a breakdown of the table at the core of this:


```sql
CREATE TABLE OutboxMessages (
    Id          UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWID(),
    EventType   NVARCHAR(MAX)       NOT NULL,
    Payload     NVARCHAR(MAX)       NOT NULL,
    CreatedAt   DATETIMEOFFSET      NOT NULL,
    ProcessedAt DATETIMEOFFSET      NULL,

    CONSTRAINT PK_OutboxMessages PRIMARY KEY (Id)
);
```
- `ProcessedAt` is the key column — NULL means unprocessed, a timestamp means it's been published. 
- The `OutboxPublisher` background service polls for rows where `ProcessedAt IS NULL`, publishes them to the `order.created` queue, 
- Then stamps `ProcessedAt = now`
- `Payload` is the JSON-serialised event body 
- `EventType` tells the consumer what to deserialise it into (i.e. order.created).

The reliability comes from writing the outbox row in the same transaction as the order. Either both land or neither does — you can never have an order without a corresponding outbox entry. That's the guarantee the pattern is built on.

### 10. SP Example for a transaction report
```sql
CREATE PROCEDURE GetTransactionReport
    @StartDate DATETIMEOFFSET,
    @EndDate   DATETIMEOFFSET
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        o.Id                        AS OrderId,
        c.Name                      AS CustomerName,
        o.Status,
        o.TotalAmount,
        o.CurrencyCode,
        o.CreatedAt,
        COUNT(li.Id)                AS LineItemCount
    FROM Orders o
    INNER JOIN Customers c  ON c.Id = o.CustomerId
    LEFT JOIN  OrderLineItems li ON li.OrderId = o.Id
    WHERE o.CreatedAt >= @StartDate
      AND o.CreatedAt <= @EndDate
    GROUP BY
        o.Id,
        c.Name,
        o.Status,
        o.TotalAmount,
        o.CurrencyCode,
        o.CreatedAt
    ORDER BY o.CreatedAt DESC;
END;
```

Exmaple call: 

```sql
EXEC GetTransactionReport @StartDate = '2026-01-01', @EndDate = '2026-06-21';
```