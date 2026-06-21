## Architecture & Design Questions

1. System architecture
The SADCOMS solutitons is structured using a Hybrid Architecture. Where the solution as whole is  modular and monolithic, with event driven architecture. The solution is made up of 5 projects. 

The first being the API. It is the entry point to back end services and is responsible for handing server requests gracefully. 

The Domain project holds the entities and business logic for the platform. It is independent of the infrastructure which make the business logic independently testable (no EF Core, no HTTP dependencies)

2. Handling peak writes
There are few options for handling scaling. From a development operations view a Load-Balancer can be run in front of the API instance(s).
We could also decouple writes from order processing. On every order, we could publish to the queue first and have a worker listen to the order queue to save and process the order. The outbox pattern already has the foundation for this idea. 

Lastly, we could use a caching-aside strategy using Redis to reduce DB load. 

1. Message reliability
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
