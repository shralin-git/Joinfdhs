import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboardPage from "./pages/dashboard/Admin-DashboardPage";
import MentorDashboardPage from "./pages/dashboard/Mentor-DashboardPage";
import StudentDashboardPage from "./pages/dashboard/Student-DashboardPage";
import StudentEnrollPage from "./pages/dashboard/student-enrol/StudentEnrollPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentRegistrationPage from "./pages/registration/student/Registration"
import MentorRegistrationPage from "./pages/registration/mentor/Registration"
import FrontPage from "./pages/FrontPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<FrontPage />} />
      <Route path="/Login" element={<LoginPage />} />


      {/* Unauthorized Page */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/StudentRegister" element={<StudentRegistrationPage />} />
      <Route path="/MentorRegister" element={<MentorRegistrationPage />} />

      {/* Admin Dashboard */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["Admin", "Super admin"]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Mentor Dashboard */}
      <Route
        path="/mentor-dashboard"
        element={
          <ProtectedRoute allowedRoles={["Mentor"]}>
            <MentorDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Student Dashboard */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={["Student"]}>
            <StudentDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Student Enroll Page (Nested Route) */}
      <Route
        path="/student-dashboard/enrol"
        element={
          <ProtectedRoute allowedRoles={["Student"]}>
            <StudentEnrollPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;