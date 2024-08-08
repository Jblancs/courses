# AWS Well Architectured Framework

AWS Well'Architected provides consistent approach to evaluate architectures, and implement designs that can scale over time

This is done by evaluating architecture using 5 pillars:
- **Operational excellence**
    - focuses on running and monitoring systems to make sure if something goes down, it can be brought up. Makes sure disaster can be detected quickly.
- **Security**
    - focuses on protecting information and systems
- **Reliability (most important pillar)**
    - ensures that app is running reliably (if traffic goes up or availability zone goes down, app should be able to handle that)
- **Performance Efficiency**
    - ensures that the way app is running is performant (is EC2 optimized for performance)
- **Cost Optimization**
    - ensures app is cost optimized

For real world system design, you need to know the priority.

In interviewer asks how you ensure the design you are doing is good?
- You are designing based on the 5 pillars and priority of app

# Three-Tier Architecture using VMs or EC2s (Popular system design for interviews)
This architecture has 3 distinct layers or tiers
- Presentation layer (Frontend)
    - interacts with backend using APIs
- Application Layer (backend)
    - saves and retrieves info from database as needed
- Database

![alt text](image.png)

### Presentation Layer (Frontend)
Ex. Amazon.com website where you can browse different items
- This could be running on nginx, apache web server, etc

Lets say user wants to add item to cart
- when user clicks add to cart, you have to insert info into db and check business logic such as address, credit card info, etc.
- presentation layer calls the backend where business logic is running

### Application Layer (Backend)
Ex. Java code running in a jar file which runs in Apache Tomcat, Oracle WebLogic Server, etc.

### Database
Could be oracle, MySQL, PostgreSQL

### One way to design this
- You can run webserver on virtual machine (EC2)
- You can run appserver on EC2
- Appserver can communicate with database
- Both EC2 can have IP Address

## POPULAR INTERVIEW QUESTION: How will webserver access appserver and how will user access webserver from internet?
- Because you cannot hard code these IP addresses into app because EC2 could go down or you may need to scale

You communicate between appserver and webserver using Load Balancers so user can access webserver by using the DNS attached to Load balancer which points to webserver
![alt text](image-2.png)

## POPULAR INTERVIEW QUESTION: What are the single points of failure in this architecture?
Elastic load balancers are managed by cloud provider and inherently highly available
- under the hood, this load balancer is running in 3 availability zones
- This is NOT a single point of failure

HOWEVER The Appserver, Webserver and Database are single points of failure

### How will you make this architecture scalable and highly available?
- Done by putting the EC2s in appserver and webserver into autoscaling group and should have at least 2 webserver and appserver EC2s in 2 different availability zones
![alt text](image-3.png)

## POPULAR INTERVIEW QUESTION: How are you going to secure this design from the network perspective
- You want to put as many components in the private subnet or green zone as possible
- only thing that should be on the yellow or red zone or public subnet is the elastic load balancer fronting that webserver so internet traffic can come to that load balancer

![alt text](image-4.png)

Can also implement network security constructs for AWS:
- Network Access Control List (NACL)
- Security Group (on EC2s to control traffic)
- Integrate Web Application Firewal (WAF) with load balancer
    - lets you monitor web requests and protect app from malicious requests

## POPULAR INTERVIEW QUESTION: How about database?
You can ask a lot of probing in this area:
- SQL vs. NoSQL (push convo towards AWS Native databases)
- AWS Native Databases
    - offers out of the box high availability, fault protection and replication

Lets say you use Amazon Aurora
- out of the box it is Multi-AZ (one copy of data is save in multiple availability zones)
- if 1 zone goes down, aurora automatically promotes copy of data as primary instance
- if you want resiliency beyond a single region, use Global Database which replicates database in another region
- These features are available on dynamoDB as well

## POPULAR INTERVIEW QUESTION: How about database optimization?
How do you handle high traffic?

How can you optimize the database?

- Aurora provides **Read Replica** which handles read traffic while the write traffic goes to primary instance
- Caching layer using amazon Elasticache and utilize caching in different layers of architecture
- Query tuning for app

# Three Tier Architecture using Serverless and Containers
It will look like this with serverless
![alt text](image-5.png)

- Static content (such as html pages) will be stored in amazon S3 buckets

When user clicks button that requires business logic validation or info retrieved or saved into database (dynamic content)
- api is called to get, post or delete data
- api will be hosted on Amazon API Gateway

Business Logic will be in AWS Lambda

Beauty of serverless design
- Do not need to worry about making this design highly available or scalable since it already is out of the box

## Three tier architecture with Kubernetes
- web and app server will be running in container within a pod
- made highly available by deploying at least 2 pods for each in diff availability zones

From here you have option
- pods can run withing EC2 worker node
- run this as fargate

These are made scalable by utilizing kubernetes scaling constructs
- ReplicaSet
- HPA
- Cluster Autoscaler

The load balancer fronting the webserver will be ALB Ingress

For backend it could be ALB Ingress or kubernetes service

![alt text](image-6.png)
