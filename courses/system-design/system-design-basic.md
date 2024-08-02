# System Design Basics

## The Monolith
A single tiered software app in which user interface and data access code are combined into a **single program** from a **single platform**

Pros:
- at first:
    - simple
    - no over engineering
-single code base
- resource effecient at small scale

Cons:
- modularity is hard to enfore as app grows
- scaling is a challenge
- all or nothing deployment
- long release cycles
- slow to react to customer demand

## Can you use API with monolith? Absolutely
Monolith can be fronted by API gateway or load balancer

When different url or paths hit API, they can forward to monolith which checks and invoke functions based on that

![alt text](image.png)

Lets say monolith is running on virtual machine and you need a sizable EC2 instance

![alt text](image-1.png)

If get request traffic increases and you have auto scaling group set and threshold is exceeded:
- instead of scaling just the cpu for store/get component, you have to scale the entire monolith and add another Amazon EC2 instance
- end up paying a lot more

![alt text](image-2.png)

## APIs in Microservice
All 3 components have different code bases

In backend you can se they are running of different machines
- depending on type of API you can control memory and cpu of EC2

![alt text](image-3.png)

- ideally you would want each cpu to have its own database but sometimes this is not possible
- If only a single database, must make sure that if virtual machine scales, keep in mind database should be able to handle increase as well (could you caching to make it able to handle)
- However, since they are all separated you can scale the part with increased traction instead of the whole app
- Each microservice can be programmed in different languages (referred to as polygot)

### Characteristics of microservice architectures
- Independent
    - Scaling
    - Governance
    - Deployment
    - Testing
    - Functionality

IMPORTANT: Not required to follow every characteristics
