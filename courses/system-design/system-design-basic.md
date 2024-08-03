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

# Microservices on AWS
Answer to everything: **Amazon EC2**

Can use **Elastic load balancing** or **Amazon API Gateway** to host the microservices

Serverless alternative: **AWS Lamda**
- scales automatically

Containerize app by using **Amazon Elastic Kubernetes Service**

## Kubernetes
Each microservice will be fronted by different services
- Each will be running in a container which will run in a pod
- all will be fronted by a single ingress (app load balancer)

![alt text](image-4.png)

# Load Balancer
Elastic load balancing
- automatically distributes app traffic across multiple targets (ec2, containers, ip addresses, etc.)
- has a unique DNS name so user can invoke app
- if traffic goes up and new EC2 created to scale, load balancer will auto discover the new EC2 instance
- tracks health of all EC2 instances (ex if one is down it will distribute to healthy targets)
- integrates with ssl
- as traffic goes up, load balancer will auto scale up

If app is exposed from a website you already have, you can use DNS service such as Amazon Route 53 to direct traffic to load balancer

![alt text](image-5.png)

## Types of Load Balancer
### Application Load balancer
Let's say you want to invoke different backends for different urls
- Load balancer can distribute to different targets allowing for each target to scale independently without impacting other operations

**Properties**
- Operates on OSI Layer 7
- Routes traffic based on url path
- Each url backend can be different
- Can validate and terminate SSL

![alt text](image-6.png)

### Network Load Balancer

**Properties**
- Operates on OSI Layer 4
- Can route traffic based on protocol and port of incoming traffic
    - such as TLS with port 443 which translates to HTTPS or protocol TCP port 80 which translates to HTTP traffic
- SSL passthrough by default (not going to validate certificates and backend need to validate)

### ALB or NLB
NLB
- Handles spiky traffic better
- exposes static IP address
    - ALB need global accelerator

Influenced by choices
- API Gateway REST API private integration with NLB with private link
- NLB supports EC
 instance and IP address as backend
- ALB supports EC2, IP address and Lambda

# API (Application Computer Interface) - What and Why?
Connection between computers or programs. Type of software interface, offering a service to other pieces of software.

### Examples
Lets say you go to restaurant with a menu of food and a kitchen with chef
- You place order at a waiter who takes order to kitchen and brings the requested food to your table
    - waiter is acting as a interface between you and kitchen (waiter is an API)

API system could be a bank, airline booking, tinder, uber, etc.

![alt text](image-7.png)

### But Why can't you order from chef directly?
In real world, there are multiple users accessing an app.

There are other factors involved
- traffic management
- load balancing
- specific input/output
- authentication

Coding all this into a program makes it difficult to modify, test and deploy code
- Need separate layer called API Gateway which hosts all API, auth, managing backend, etc.

# Differences between Load Balance and API Gateway
**Application Load Balance:**
- Auto distribute incoming traffic across backend targets
- Layer 7 load balancer
- infrastructure managed by AWS, highly available, elastic

Typical Pattern ALB Integration
![alt text](image-8.png)

**API Gateway:**
- Fully managed and serverless API service from AWS
- Auto scales up and down
- Infrastructure managed by AWS, highly available, elastic

Typical Pattern API Gateway Integration
![alt text](image-9.png)

Differences Between ALP vs. API Gateway
![alt text](image-11.png)
![alt text](image-12.png)

# IMPORTANT: Scaling - Vertical vs. Horizontal
Lets say you have an app running in a server.
- If no traffic on server, cou utilization is zero.

If traffic grows and increases cpu utilization close to max and server can't handle traffic

## Vertical Scaling
- If you have to scale the server, one option is to add more RAM to server (go to bigger server)
- add more resources to your server

**Vertical Scaling deep dive:**
- You will bring up a bigger server then load app
- cut over traffic from smaller server to bigger server
- then delete the smaller server
- there is a cut over time period where app will be down during change

![alt text](image-13.png)

Lets say traffic reduces.
- Since you are now on a bigger server, you now have to pay for the bigger server
- you do not want to go back and forth

### Challenges of Vertical scalling
- Scaling up/down takes longer
- Chance of missing transactions during scaling cutover
- limited scaling (servers only come up to certain cpu and memory)
    - vertical scaling not ideal for massively scalable distibuted system and is expensive

## Horizontal Scaling
Instead of moving app to a bigger server, you will spin up another server with your app running in it and new traffic will go to this server

![alt text](image-14.png)

**Horizontal Scaling deep dive:**
When new server comes up, load balancer simply send traffic to new server
- Load balancer points to auto scaling group
- There is no trasition or cutoff period
- Scales up/down faster
- Massively scalable
- cost effective since you do not need to move to more expensive/powerful servers
- Legacy code needs to be refactored for horizontal scaling

# VM, Serverless, Container Scaling

**Lambda Scaling**
- can only scale horizontally
- For each traffic, a new instance of your lambda spins up

**Container Scaling**
- For kubernetes, container runs in a pod
    - as traffic goes up, it will create another pod within the same EC2 so new pod starts getting traffic
    - Each EC2 can have certain number of pods and, once cpu filled, you will have to scale the EC2 which is referred to as **cluster auto scaler**

- For Fargate, there is no underlying ECS and AWS manages where pod is running
    - at certain point the Fargate scales and creates another pod running the container for app

# Real World Interview Tips on Scaling
Lets say interviewer asks you:

## How can you make your app scalable for a big traffic day?

![alt text](image-15.png)

- I will put my VMs into an auto scaling group behind Elastic Load Balancing
- If we let load balancer to scale up naturally, it might not be able to keep up
    - I will PRE-WARM LOAD BALANCERS to handle big traffic bump
    - I will utilize SCHEDULED SCALING which will have multiple amazon EC2s up and running to handle huge traffic
    - I will ensure application machine image (AMI) IS LIGHTWEIGHT (because more unecessary libraries/packages means longer to spin up EC2's in scaling)
    - If app is connecting to database USE DATABASE PROXY (ex. RDS proxy) to maintain database connection
        - Usually instead of reusing that connection it will create a new connection and result in multiple open connections which uses computing from database
    - Run IEM (Infrastructure Event Management) to ensure it can handle high traffic
        - Event that AWS runs before big traffic day so that it will scale up
    - Also check account limit for AWS account
    - Utilize different Account + Region Combo


Also talk about breaking app into microservices which can allow a heavy hitting API to scale a lot more without impacting other microservices

### Serverless Scaling
- Before big traffic day, ensure the provisioned concurrent (Scheduled) so it will pre-warm certain number of Lambdas for high traffic
    - Provisioned Concurrency can be done in an auto scaling way or scheduled manner
- Optimize Lambda code using X-Ray
- Optimize Lambda config using CloudWatch Insights

For API Gateway
- Enable API caching
- use HTTP API instead of REST API if possible
- Check account limits
- Utilize different Account + Region Combo

![alt text](image-16.png)

### Going into kubernetes
- Use HPA of horizontal pod auto scaler
- Use rs or Replica Set to run multiple copies of pod so it can handle increased traffic
- Use Cluster Autoscaler to provision additional nodes
- Pre-warm load balancers
- Use Proxy database

![alt text](image-17.png)

# Synchronous vs Event Driven/Async Architecture
When you have 3 microservices and they are hitting 3 different backends
- In all cases the caller is expecting a result in the same invocation

A look into the serverless option

## Synchronous Architecture:
- Caller will invoke the API and wait for response during SAME invocation

### How does sychronous architecture scale
Lets say multiple users start executing same API
- Gateway, Lambda and database have to scale
    - but if Lambda eventually reaches limit, any calls after will fail
![alt text](image-18.png)

**Challenges in Synchronous Architecture**
- All components of sync architecture MUST scale together
- Consumer needs to resent tranaction for re-processing
- Expensive

## Event-Driven/Async Architectrure
We decouple the components and buff messages until services are available to process
- Instead of API gateway calling directly to Lambda, API put messages into Amazon SQS (simple queue service) to control rate of consumptions

![alt text](image-19.png)

**Advantages**
- Each component can scale independently
- Retry built in (frontend/user does not need to resend messages)
- Cost effective than synchronous architecture

## Use sync and async architectures together where applicable
Examples where they are used together

Ordering systems
- Order inserts can be done event-driven
- Order status retrieval can be done syncronously since it is more lightweight and components of this can be cached

# Queues and PubSubs
