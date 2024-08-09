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

# DESIGN a Content-Based Message Routing Architecture
Lets say A is a system for an insurance company
- Anytime someone purchases insurance, System A has to send messages for different insurance coverages to different backend processing

### How would you design this system so System A could deliver messages to these backends

Bad Answer:
- System A will cal APIs to these different backend systems
    - ex. if type is car, call car backend system
    - not good because when there is high volume of customers, systems need to scale up at the same time.
- System A puts messages into queue (SQS) and you have lamda or EC2 to grab all messages and based on message type it calls different backend systems
    - this causes lambda or EC2 to become a bottle neck
    - if single lamda handles processing and volume of one insurance type goes up, it can impact other insurance type processing by taking over limit of lambda

![alt text](image-7.png)

Ideal solutions:
- System A publishes messages into SNS topic which can do filtering based on metadata
    - metadata is not the message body but is the property of the message which can have a field such as insurance type
    - SNS topic can send messages to the queues separately for processing
    - then you can process using lambda or EC2 and each queue and backend can scale independently
    ![alt text](image-8.png)
- If you want to use actual message field instead of metadata, you can do so using EventBus
    - EventBus can look at the field insurance type and send it to the correct SQS
    - Can also do advanced conditions, so if insurance type is x and name is y then send here
    - Why not just use EventBus? It is a little more expensive so switch to SNS if too expensive
    - SNS and SQS can scale infinitely but EventBus has limits on scaling
    ![alt text](image-9.png)

# DESIGN Image Storage and Retrieval Architecture
This is reusable and is used in other bigger use cases such as Amazon, Tinder, Shopify, etc.

When it comes to saving/storing images, you have 2 options:
- save in database as blob object
- save as object in object storage such as S3

Keep in mind when you save image and user is trying to retrieve the image, it is not always the same image
- When uploading on facebook or instagram, you can upload with high resolution but if you check the image on feed you might notice it is pixelated (meaning it was downscaled based on user device to save bandwidth)
- Saving and retrieving images involves processing such as downsampling image for different resolutions
- almost all architecture that deals with high volume of images uses object restorage or S3 to sacrafice speed for a cheaper cost

Amazon S3
- highly scalable, available and durable
- Each S3 is replicated across multiple availability zones

### How to design saving image
![alt text](image-10.png)
Lets say user uploads jpg and invokes an API hosted on API gateway
- this gateway will call a backend lambda
- lambda will save image in S3 bucket
- within S3 bucket, image will be saved in folder named ny/images/male
- image this is tinder meaning there will be multiple S3 buckets in diff regions with subfolders for states

Things to keep in mind
- API gates can directly save to S3 if you do not need any business processing but generally lamda will do some processing (such as image having explicit content)
- Lamda will put the location of the image in a database
    - if there are multiple S3 buckets with different data structure, you do not want to hard code everything into retrieval code
    - So when lamda saves in bucket it will at the same time save location into database (ex. dynamoDB)
- For upscaling/downscaling images, from S3 you trigger lambda which uses image kit to downscale/upscale
    - This lambda can scale image in different formats and store in different S3 buckets
    - once saved, it will put an entry into dynamoDB table for different resolutions
- if there is no need to process for explicit images, you can skip first lambda

### Retrieving Images
Much simpler than saving
- User invokes API Gateway with name of image
- backend lambda will go to dynamoDB (user tries to fetch from their device and app website can detect device type and set header)
- based on device type, dynamoDB will have folder location of specific resolution image in S3 bucket
![alt text](image-11.png)

# DESIGN a High Priority Queuing/Messaging System
Lets say you have 2 systems (A & B)
- System A receives messages and has to send messages to system B but certain messages need to be processed fast

Ex. Insurance Company want to process car insurance messages first

Option 1 (Highly unlikely for interview):
- Use a rabbitMQ where you can set a priority value in header in message
- Listener will pick up higher priority messages first

Option 2 (Popular option):
- Design using SQS (does not have default priority headers)
- Done by creating 2 different queues
    - one for car insurance and one for other
- On processing side, you can process using EC2 or Lambda (inside auto scaling group which can be set to be based on volume in SQS)
- Other EC2 doesn't need auto scaling group to save cost (if cost not issue then use ASG)
    - For Lambda, you can control memory

    ![alt text](image-12.png)

Option 3:
- If interviewer wants all that managed in another AWS service instead of system A
- Done by using Amazon Event Bridge with pattern matching
    - based on value in certain fields, you can send to diff target

    ![alt text](image-13.png)

### Why do we need SQS?
You can call directly to EC2 or Lambda, but when message fails to process then it is lost
- SQS has a requeue feature which will saved failed sends and resend it meaning you don't need code in EC2 to handle

# Data Analytics System Design on AWS
### Steps of Data Analytics
- Collect Data
- Transform Data based on requirements
- Query data to find necessary info
- Create Reports that give business insights

### Sample Architecture 1: Query and report on click stream data
Click Stream:
- Needs website and need to track clicks
- stream using streaming service like Amazon Kinesis or Kafka
- Dump all data in Amazon Simple Storage Service (Data in S3 is unstructured since is object based storage)
- AWS Glue uses crawlers to go through data in objects and find metadata of the data catalog of that data
    - Metadata or Data catalog mean what are the fields and types of the data
- AWS glue catalog will say in this S3 bucket this data can fit in this data structure
- You can query using amazon Athena which can read glue catalog and query
- can also define dashboards using QuickSight
![alt text](image-14.png)

### Sample Architecture 2: ETL (Extract, Transform, Load) and data warehouse
ETL
- Data collection part is similar
- AWS glue can define metadata and read data based on that S3 bucket and transform that data (remove columns, change values) and load into another S3 bucket

Data warehousing
- done with Amazon Redshift using Redshift spectrum
    - this directly running SQL queries from S3 bucket

![alt text](image-15.png)

Alternative
- AWS glue can after ETL load data into Redshift Tables
- Redshift you can define tables, indexes, keys and redshift queries are generally faster than athena

![alt text](image-16.png)

### What is AWS Glue?
- Serverless data integration service making it easier to discover prep and combine data for analytics
    - serverless means it will scale as needed and you only pay per use
- Glue crawlers can run on data and discover types of column and data (metadata)
- Can visually create ETL flows (Supports python/spark and Scala)
- Enrich, clean and normalize data without code
- Replicate data across various services

### Sample Architecture 3: Unified catalog across multiple data stores
Input Data Sources
- Redshift
- S3 Bucket
- Amazon RDS
- Database running on EC2

Run AWS glue which creates glue data catalog
- Can join catalog across different data sources and run sql queries using redshift and athena and also run big data process with Amazon EMR

If interviewer asks about dashboarding or reporting
- use Amazon QuickSight

![alt text](image-17.png)

Amazon EMR
- Managed big data platform
- Runs open-source tools (Apache Spark, Hive, Hbase, Flink, Hudi, Presto)
- Run on EC2 or EKS (Elastic Kubernetes Service), or on-prem using EMR on Outposts

### Sample Architecture 4: Big data analysis of click stream data
Ex. Data getting dumped in S3 storage and EMR reading through it
- EMR cannont directly read from S3 unless it know the metadata
- AWS Glue needs to crawl data and create glue data catalog

![alt text](image-18.png)

### Sample Architecture 5: In Stream querying and ETL
What if you need to query on data in stream before it's dumped?
- sometimes you want to perform selective loading of data to save space (not dump all data into S3)
- Data Gathering part is done by Kinesis Data Streams on Kafka
- Once you have data, put in Kinesis Data Analytics to transform and analyze data in real time
- Then send Kinesis data Firehousse which dumps into S3 bucket
![alt text](image-19.png)

### Data Lake
Purpose is the four steps
![alt text](image-20.png)

In interview ask: Should you do analytics when data in stream or after or does it need data warehousing?

Most important thing to remember is Data Lake holds massive amount of data
- S3 is at the heart of a Data Lake as main storage service (scalable, cost effective, has tiers, can run queries, warehousing)

# Performan Cost and Optimization
