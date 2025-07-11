# 📊 CSPGCL Data Analytics & Visualization Web Application

This repository contains the code and documentation for a **Data Analytics and Visualization Web Application** developed as part of my vocational training at **Hasdeo Thermal Power Station, Korba (West)** under **Chhattisgarh State Power Generation Company Limited (CSPGCL)**.

## ⚡ Project Overview

Power plant staff currently log operational data in spreadsheets but lack an intuitive platform for visualizing trends or gaining actionable insights.  
This project addresses that gap by providing an **interactive web-based dashboard** for short-term trend analysis and time series pattern discovery.

👉 **Note:** This project uses **real-world operational data** from Hasdeo Thermal Power Station.  
Because this data is partially **confidential**, only **one month’s worth of records** was used for this demonstration and analysis.  
However, the system is designed to easily expand to cover **full annual datasets** if this solution is accepted and deployed by CSPGCL employees across all units.

Key features:
- 📅 Calendar-based date selection
- 📈 Dynamic dashboards and interactive charts
- 🔍 Automated suggestions & trend highlights
- 🗂️ Centralized access to all KPIs

---

## 🎯 Objectives

- Enable effective data analysis and visualization for daily operational KPIs.
- Simplify identification of hidden trends and patterns in plant performance.
- Provide a user-friendly, interactive web interface.
- Ensure seamless backend–frontend integration for real-time data retrieval.
- Automate suggestive insights for faster, informed decision-making.

---

## 🚩 Problem Statement

**Traditional Excel charts** are static, manually updated, and cumbersome for multi-metric or multi-period analysis. This web app replaces them with:
- Automated, interactive visualizations
- Multi-metric dashboards
- Centralized KPI access
- Automated recommendations

---

## 🧩 Tech Stack

| Layer         | Technology              |
|---------------|-------------------------|
| **Frontend**  | HTML5, CSS3, JavaScript, Chart.js |
| **Backend**   | Node.js, Express.js     |
| **Database**  | MySQL                   |
| **Version Control** | Git + GitHub |

---

## 🗂️ System Architecture

The project uses a robust **three-tier architecture**:
1. **Presentation Layer** — HTML/CSS/JS + Chart.js for an interactive dashboard.
2. **Application Layer** — Node.js + Express.js for backend logic and APIs.
3. **Data Layer** — MySQL for storing cleaned operational data.

---

## 🗃️ Database Design

- **Main Table:** `cleaned_cspgcl`
- **Fields:**  
  - `Date` (DATE) — operational date  
  - `Generation (MU)` (FLOAT) — daily power generation  
  - `Coal Consumption (MT)` (FLOAT) — daily coal use  
  - `Heat Rate (kcal/kWh)` (FLOAT) — daily heat rate  
  - `Specific Coal Consumption (kg/kWh)` (FLOAT)

Raw daily performance reports (DPRs) were cleaned, validated, and imported into MySQL for structured querying and visualization.

---

## ⚙️ How It Works

1. **User selects a date** using a calendar widget.
2. Frontend sends a request to the backend API.
3. Backend queries the MySQL database for relevant KPIs.
4. Clean data is returned to the frontend.
5. Chart.js renders dynamic graphs for easy trend analysis.
6. Automated suggestions highlight insights and possible actions.

---

## ✅ Features

- Calendar-based filtering for specific day insights.
- Generation trend, coal consumption, heat rate, and specific coal charts.
- Comparative scatter plots for deeper pattern discovery.
- Suggestive analytics for quick decision support.

---

## 🚀 Running Locally

**Prerequisites:**  
- Node.js & npm installed  
- MySQL server installed & running  
- `.env` file with your database credentials

**Steps:**


## 📚 Documentation

Full project report and additional documentation can be found in **`Report_of_Cspgcl_Project_pgti[1].pdf`**.

---

## 🔒 Security

- DB credentials managed via `.env`
- Secure API endpoints
- Proper input validation

---

## 🧪 Testing

- Unit & integration tests for backend endpoints
- Manual UI tests for dashboard usability and performance

---

## 🚀 Future Improvements

- Predictive analytics and ML-based forecasting
- Real-time data streaming for live dashboards
- User authentication & role-based access
- Mobile-friendly version

---

## 👤 Author

**Arushi Dewangan**  
B.Tech (CSE), 6th Semester  
Kalinga Institute of Industrial Technology, BBSR

---

## 📜 License

This project is for **academic and portfolio purposes only**.

---

**Thank you for checking out this project!**  
Feel free to **fork**, **clone**, or **open an issue** if you’d like to contribute or learn more.
