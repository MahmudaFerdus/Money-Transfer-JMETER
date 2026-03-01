#  Money Transaction API - Load Testing with JMeter

##  Project Overview

This repository contains **JMeter load testing scripts (.jmx)** and **test reports** for a Money Transaction API. The API simulates a digital financial ecosystem with multiple user roles (Admin, Customer, Agent, Merchant) performing various monetary transactions under concurrent load.

>  **API Documentation:** [Postman Documentation](https://documenter.getpostman.com/view/22815578/2sBXcAH2jZ#3732c53b-20b4-4476-8412-061879045406)


##  Test Architecture

The JMeter test plan is structured into **two thread groups** to simulate a realistic end-to-end money transaction workflow:


###  Thread Group 1: Setup Thread Group

| Parameter          | Value    |
|--------------------|----------|
| Number of Threads  | 1        |
| Ramp-Up Period     | 1 second |
| Loop Count         | 1        |

This thread group handles **one-time setup operations** executed sequentially:

| Step | Action                               | Description                                                         |
|------|--------------------------------------|---------------------------------------------------------------------|
| 1    | Admin Login                          | Admin authenticates into the system                                 |
| 2    | Create Customer 1                    | Admin creates the first customer account                            |
| 3    | Create Customer 2                    | Admin creates the second customer account                           |
| 4    | Create Agent                         | Admin creates an agent account                                      |
| 5    | Create Merchant                      | Admin creates a merchant account                                    |
| 6    | Create Virtual Money                 | Using system's special secret key from `SYSTEM` account             |
| 7    | Initial Deposit: System → Agent      | System deposits initial funds to Agent                              |
| 8    | Initial Deposit: System → Customer 1 | System deposits initial funds to Customer 1                         |



###  Thread Group 2: Transaction Load Test Thread Group

| Parameter          | Value      |
|--------------------|------------|
| Number of Threads  | 50         |
| Ramp-Up Period     | 15 seconds |
| Loop Count         | 1          |

This thread group simulates **50 concurrent users** ramping up over 15 seconds to perform transactional operations under load.

####  Login Phase (Run Once Controller)

Logins are executed **only once per thread** using a Run Once Controller:

| Login            |
|------------------|
| Customer 1 Login |
| Customer 2 Login |
| Agent Login      |

####  Transaction Operations

| # | Transaction                         | Description                                      |
|---|-------------------------------------|--------------------------------------------------|
| 1 | Deposit: Agent → Customer 2         | Agent deposits money into Customer 2's account   |
| 2 | Send Money: Customer 2 → Customer 1 | Customer 2 transfers money to Customer 1         |
| 3 | Payment: Customer 1 → Merchant      | Customer 1 makes a payment to the Merchant       |
| 4 | Withdraw: Customer 2 → Agent        | Customer 2 withdraws money through the Agent     |
| 5 | Check Balance: Customer 1           | Customer 1 checks account balance                |
| 6 | Transaction History                 | Retrieve transaction history                     |
| 7 | Search Transaction by ID            | Search specific transaction using transaction ID |


##  Load Test Results Summary

| Metric               | Value          |
|-----------------------|----------------|
| Total Threads         | 50             |
| Ramp-Up Period        | 15 seconds     |
| Loop Count            | 1              |
| ✅ Pass Rate          | **99.8%**      |
| ❌ Fail Rate          | **0.2%**       |

Note that : The API demonstrated **excellent stability** under load with a **99.8% success rate** across 50 concurrent users performing multiple transaction types simultaneously.

## How to View the Load Test Report

###  Option 1: Download ZIP  

1. Download the **[html_report.zip]** file from this repository
2. Extract the ZIP file
3. Open `index.html` in your browser
4. Full graphical dashboard with all charts and graphs will load
  
How to Run the Test Yourself

**Prerequisites**

Apache JMeter (v5.x+)
Java JDK (v8+)
Run via JMeter GUI
Open Apache JMeter
Go to File → Open
Select the .jmx file
Click ▶️ Start button

For generating report: Run via Command Line (Recommended for Load Testing)
Bash
jmeter -n -t "Money Transfer Scenerio Load Test Thread Group .jmx" -l results.csv -e -o html_report/

📌 Key Features Tested
✅ User authentication (Admin, Customer, Agent)
✅ User creation (Customer, Agent, Merchant)
✅ Virtual money creation with secret key
✅ Deposit transactions (System → User, Agent → Customer)
✅ Peer-to-peer money transfer (Customer → Customer)
✅ Payment processing (Customer → Merchant)
✅ Cash withdrawal (Customer → Agent)
✅ Balance inquiry
✅ Transaction history retrieval
✅ Transaction search by ID

👤 Author
[Mahmuda Ferdus]

GitHub: @MahmudaFerdus/

