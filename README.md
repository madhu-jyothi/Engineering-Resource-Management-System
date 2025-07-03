# Project: Engineering Resource Management System

## Tech Stack Used
- **Frontend:** React, Vite, Tailwind CSS, Shadcn UI
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Token)
- **Charts:** Recharts (DoughnutChart)
- **AI Tools:** GitHub Copilot

## How to Set Up and Run

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or cloud instance)

### Setup Steps
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd GeekyAnts assignments
   ```
2. **Install dependencies:**
   - For the backend:
     ```bash
     cd server
     npm install
     ```
   - For the frontend:
     ```bash
     cd ../web
     npm install
     ```
3. **Configure environment variables:**
   - In `server/.env`, set your MongoDB URI:
     ```env
     MONGO_URI=mongodb://localhost:27017/your-db-name
     JWT_SECRET=your_jwt_secret
     ```
4. **Seed the database (optional):**
   ```bash
   cd server
   node seed.js
   ```
5. **Run the backend server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```
6. **Run the frontend app:**
   ```bash
   cd ../web
   npm run dev
   ```
7. **Access the app:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [https://engineering-resource-management-system-hj5b.onrender.com/](https://engineering-resource-management-system-hj5b.onrender.com/)

## Tools Used
- **VS Code** (development environment)
- **GitHub Copilot** (AI code assistant)
- **Postman** (API testing)
- **MongoDB Compass** (database GUI)

### How AI tools were used 
- **GitHub Copilot:** Used throughout the project for code generation, UI/UX refinement, and automating repetitive tasks. Copilot provided suggestions for React components, backend API routes, authentication logic, and even for writing documentation and README sections.

### How AI accelerated development (with examples)
- **UI Modernization:** Copilot quickly suggested how to replace native HTML elements with Shadcn UI components, saving hours of manual refactoring.
- **Persistent Authentication:** Copilot provided a robust pattern for storing and restoring authentication state using localStorage, which was directly adapted for the AuthProvider logic.
- **API Integration:** Copilot generated fetch logic and error handling for both dashboards, reducing boilerplate and helping catch edge cases.
- **Styling Consistency:** Copilot suggested Tailwind and Shadcn class combinations for consistent, modern UI, and helped with color, spacing, and accessibility improvements.
- **Documentation:** Copilot helped draft this README and other documentation sections, ensuring clarity and completeness.

### Challenges with AI-generated code & resolutions
- **Over-generalization:** Sometimes Copilot suggested generic code that didn’t fit the project’s specific data models (e.g., mismatched field names or missing population in Mongoose queries). These were resolved by cross-checking with actual schema and adjusting the code.
- **UI/UX Details:** Copilot occasionally missed subtle UI requirements (like background color or spacing). Manual review and iterative feedback ensured the UI matched the exact user requirements.
- **Error Handling:** Some Copilot suggestions lacked robust error handling. These were improved by adding custom error messages and validation logic.

### Approach to validating and understanding AI suggestions
- **Manual Review:** Every Copilot suggestion was reviewed for correctness, security, and fit with the project’s architecture.
- **Testing:** All major flows (login, assignment, dashboard updates) were tested manually after Copilot-generated changes.
- **Incremental Adoption:** Suggestions were integrated incrementally, with regular commits and rollbacks if needed.
- **Documentation & Comments:** AI-generated code was cross-referenced with official docs (React, Express, Shadcn UI) to ensure best practices.

## Default Credentials

- **Manager:**
  - Email: manager@company.com
  - Password: password123
- **Engineers:**
  - Email: alice@company.com | Password: password123
  - Email: bob@company.com   | Password: password123
  - Email: carol@company.com | Password: password123
  - Email: dave@company.com  | Password: password123

---
