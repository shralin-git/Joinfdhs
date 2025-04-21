import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Input,
  Typography,
  Row,
  Col,
  Table,
  message,
  Spin,
  Form,
  Input as AntInput,
  Button,
  Alert,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  LogoutOutlined,
  SettingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { fetchUserProfile } from "../../utils/userService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

interface User {
  key: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  collegeName?: string;
  userType: string;
}

const AdminDashboard: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [mentors, setMentors] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [newRegistrations, setNewRegistrations] = useState<User[]>([]);
  const [loadingMentors, setLoadingMentors] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [form] = Form.useForm();

  const handleMenuClick = (e: any) => {
    setSelectedMenu(e.key);
  };
  
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(navigate);
  };


  const { idToken, fullName, username, role, logout } = useAuth();
  
  const fetchUsers = async (userType: string) => {
    const url = `https://asia-south1-mediksharegistration.cloudfunctions.net/GetDataFromUsertype?userType=${userType}`;
  
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `${idToken}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        // Handle specific error cases based on the API response
        switch (response.status) {
          case 400:
            throw new Error(errorData.message || "ID token is missing");
          case 401:
          case 402:
            throw new Error(errorData.message || "Invalid or expired ID token");
          case 403:
            throw new Error(errorData.message || "You are not authorized to view user information");
          case 404:
            throw new Error(errorData.message || "Table name is required");
          default:
            throw new Error(`Unexpected error: ${response.status} ${response.statusText}`);
        }
      }
  
      const data = await response.json();
  
      if (!data || !Array.isArray(data.data)) {
        throw new Error("Invalid response format: 'data' is not an array.");
      }
  
      const formattedData = data.data.map((item: any, index: number) => ({
        key: `${index}`,
        fullName: item.fullName || "N/A",
        email: item.email || "N/A",
        phoneNumber: item.phoneNumber || "N/A",
        collegeName: item.collegeName || "N/A",
        userType: item.userType || userType,
        address: item.address || "N/A",
        stateOfPermanentResidence: item.stateOfPermanentResidence || "N/A",
        currentCourse: item.currentCourse || "N/A",
        studentEnrollmentNumber: item.studentEnrollmentNumber || "N/A",
        submitDate: item.submitDate
          ? new Date(item.submitDate._seconds * 1000).toLocaleString()
          : "N/A",
      }));
  
      return formattedData;
    } catch (error: any) {
      message.error(`Failed to fetch ${userType} data: ${error.message}`);
      return [];
    }
  };

  const fetchNewRegistrations = async () => {
    const url = `https://asia-south1-mediksharegistration.cloudfunctions.net/getRegistrationApplicationByStatus?status=new`;
    try {
      setLoadingRegistrations(true);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `${idToken}`,
        },
      });

      if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);

      const data = await response.json();
      if (!data || !Array.isArray(data.userDetails)) {
        throw new Error("Invalid response format: 'data' is not an array.");
      }

      const formattedData = data.userDetails.map((item: any, index: number) => ({
        key: `${index}`,
        fullName: item.data?.fullName || "N/A",
        email: item.data?.email || "N/A",
        phoneNumber: item.data?.phoneNumber || "N/A",
        collegeName: item.data?.collegeName || "N/A",
        stateOfResidence: item.data?.stateOfResidence || "N/A",
        mbbsNumber: item.data?.mbbsNumber || "N/A",
        specialization: item.data?.specialization || "N/A",
        processedBy: item.data?.processedBy || "N/A",
        processedDate: item.data?.processedDate || "N/A",
        status: item.data?.status || "N/A",
        submitDate: item.data?.submitDate
          ? new Date(item.data.submitDate._seconds * 1000).toLocaleDateString()
          : "N/A",
      }));

      setNewRegistrations(formattedData);
    } catch (error: any) {
      message.error(`Failed to fetch new registrations: ${error.message}`);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const loadMentors = async () => {
    setLoadingMentors(true);
    const mentorData = await fetchUsers("mentor");
    setMentors(mentorData);
    setLoadingMentors(false);
  };

  const loadStudents = async () => {
    setLoadingStudents(true);
    const studentData = await fetchUsers("student");
    setStudents(studentData);
    setLoadingStudents(false);
  };

  const updateProfile = async (values: any) => {
    const passwordFieldsFilled =
      values.oldPassword && values.newPassword && values.confirmNewPassword;
  
    const payload = {
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      stateOfResidence: values.stateOfResidence,
      collegeName: values.collegeName,
      EmployeeID: values.EmployeeID,
      ...(passwordFieldsFilled && {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      }),
    };
  
    // Proceed with API call using the payload
    const url = `https://asia-south1-mediksharegistration.cloudfunctions.net/UpdateAdminAndSuperAdminProfile`;
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${idToken}`,
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        message.success(data.message || "Profile updated successfully!");
      } else {
        message.error(data.error || "Failed to update profile.");
      }
    } catch (error: any) {
      console.error("Update Profile Error:", error);
      message.error("An unexpected error occurred.");
    }
  };

  const handleApproval = async (email: string, status: string) => {
    const url = `https://asia-south1-mediksharegistration.cloudfunctions.net/registerUser`;
  
    try {
      console.log("Processing: ", email, status);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${idToken}`,
        },
        body: JSON.stringify({
          username: email,
          status,
          remarks: "",
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
  
      // Extract the message field to determine the outcome
      if (response.status === 201) {
        message.success(`User approved successfully! ${data.message}`);
      } else if (response.status === 200) {
        message.success(`Application ${status}: ${data.message}`);
      } else if (response.status === 409) {
        message.warning(`User already registered: ${data.message}`);
      } else {
        message.error(`Unexpected status: ${data.message}`);
      }
  
      fetchNewRegistrations(); // Refresh the list after action
    } catch (error: any) {
      message.error(`Failed to ${status}: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchNewRegistrations();
    loadMentors();
    loadStudents();
  }, []);

  useEffect(() => {
    if (selectedMenu === "settings") {
      const loadUserProfile = async () => {
        setLoadingProfile(true);
        try {
          if (!username || !idToken) {
            message.error("Missing required credentials to load profile.");
            return;
          }
  
          const response = await fetchUserProfile(username, idToken);
  
          console.log("User Profile Response:", response); // Debug: Log API response
  
          if (response.success && response.data) {
            const { fullName, phoneNumber, stateOfResidence, collegeName, EmployeeID } = response.data;
  
            // Debug: Log the mapped fields
            console.log("Setting form values:", {
              fullName: response.data.fullName,
              phoneNumber: phoneNumber || "",
              stateOfResidence: stateOfResidence || "",
              collegeName: collegeName || "",
              EmployeeID: EmployeeID || "",
            });
  
            form.setFieldsValue({
              fullName: response.data.fullName || "",
              phoneNumber: response.data.phoneNumber || "",
              stateOfResidence: response.data.stateOfResidence || "",
              collegeName: response.data.collegeName || "",
              EmployeeID: response.data.EmployeeID || "",
            });

            console.log("Form Values After Setting:", form.getFieldsValue());
          } else {
            message.error(response.error || "Failed to load user profile.");
          }
        } catch (error: any) {
          console.error("Error loading profile:", error); // Debug: Log error
          message.error(error.message || "An unexpected error occurred while loading the profile.");
        } finally {
          setLoadingProfile(false);
        }
      };
  
      loadUserProfile();
    }
  }, [selectedMenu, form]);


  const newRegistrationColumns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "College Name",
      dataIndex: "collegeName",
      key: "collegeName",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: User) => (
        <div>
          <Button
            type="primary"
            className="mr-2"
            onClick={() => handleApproval(record.email, "approve")}
          >
            Approve
          </Button>
          <Button
            danger
            onClick={() => handleApproval(record.email, "deny")}
          >
            Deny
          </Button>
        </div>
      ),
    },
  ];

  const userColumns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "College Name",
      dataIndex: "collegeName",
      key: "collegeName",
    },
  ];

  return (
    <Layout className="w-full h-screen bg-blue-100">
    <Sider
      width={250}
      className="h-full bg-gradient-to-b from-primary to-blue-600 p-4 flex flex-col"
      style={{
        borderRadius: "20px", // Rounds corners
        overflow: "hidden", // Prevents overflow
      }}
    >
      {/* Top Section: Avatar and Welcome Text */}
      <div className="flex flex-col items-center">
        <Avatar size={80} icon={<UserOutlined />} className="bg-blue-600 mb-4" />
        <Text className="text-white text-lg font-semibold mt-2">Welcome, Admin!</Text>
      </div>

        {/* Main Menu */}
        <Menu
          theme="dark"
          mode="vertical"
          className="bg-transparent flex-grow mt-6" // Flex-grow pushes logout down
          selectedKeys={[selectedMenu]}
          onClick={handleMenuClick}
        >
          <Menu.Item key="dashboard" icon={<UserOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="registeredUsers" icon={<UserOutlined />}>
            Registered Users
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
        </Menu>

        {/* Logout Button */}
        <div className="mt-auto">
          <Menu
            theme="dark"
            mode="vertical"
            className="bg-transparent"
          >
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </Menu.Item>
          </Menu>
        </div>
      </Sider>

      <Content className="p-8 ml-[250px]"
              style={{
                backgroundImage: `url(/assets/mentor-dashboard/backgroundImg.jpeg)`,
                backgroundSize: "cover", // Ensures the image covers the entire background
                backgroundRepeat: "no-repeat", // Prevents the image from repeating
                backgroundPosition: "center", // Centers the image
                minHeight: "100vh", // Ensures the background image covers the entire viewport height
                marginLeft: "0px"
              }}
        >
      {selectedMenu === "dashboard" && (
        <>
          {/* Header */}
          <div className="flex justify-between items-center bg-blue-700 p-6 rounded-lg shadow-lg mb-8">
            <div>
              <Title level={3}>Welcome, {fullName}!</Title>
            </div>
            <img
              src="/assets/admin-dashboard/Admin.png"
              alt="Header Image 1"
              className="w-32 h-30"
            />
          </div>
          <div className="flex justify-between items-center mb-4">
            <Title level={3} className="text-blue-900">
              Mentor Approvals
            </Title>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchNewRegistrations}
              loading={loadingRegistrations}
            >
              Refresh
            </Button>
          </div>
          <Spin spinning={loadingRegistrations}>
            <div
              className="bg-white rounded-2xl shadow-md mb-8"
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              <Table
                columns={newRegistrationColumns}
                dataSource={newRegistrations}
                pagination={false}
              />
            </div>
          </Spin>
        </>
      )}

      {selectedMenu === "registeredUsers" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <Title level={3} className="text-blue-900">
              Registered Mentors
            </Title>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadMentors}
              loading={loadingMentors}
            >
              Refresh
            </Button>
          </div>
          <Spin spinning={loadingMentors}>
            <div
              className="bg-white rounded-2xl shadow-md mb-8"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              <Table columns={userColumns} dataSource={mentors} pagination={false} />
            </div>
          </Spin>

          <div className="flex justify-between items-center mb-4">
            <Title level={3} className="text-blue-900">
              Registered Students
            </Title>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadStudents}
              loading={loadingStudents}
            >
              Refresh
            </Button>
          </div>
          <Spin spinning={loadingStudents}>
            <div
              className="bg-white rounded-2xl shadow-md mb-8"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              <Table columns={userColumns} dataSource={students} pagination={false} />
            </div>
          </Spin>
        </>
      )}

        {selectedMenu === "settings" && (
  <div className="min-h-screen flex justify-center items-center">
    <div
      className="shadow-md rounded-xl p-10 w-[80%]"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Title level={3} className="text-center text-blue-900 mb-6">
        Admin Profile Settings
      </Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          updateProfile(values);
        }}
        className="grid grid-cols-2 gap-6"
      >
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Please enter your full name" }]}
        >
          <AntInput placeholder="Enter your full name" />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            { required: true, message: "Please enter your phone number" },
            {
              pattern: /^[0-9]{10}$/,
              message: "Please enter a valid 10-digit phone number",
            },
          ]}
        >
          <AntInput placeholder="Enter your phone number" />
        </Form.Item>
        <Form.Item
          label="State of Residence"
          name="stateOfResidence"
          rules={[{ required: true, message: "Please enter your state of residence" }]}
        >
          <AntInput placeholder="Enter state of residence" />
        </Form.Item>
        <Form.Item
          label="College Name"
          name="collegeName"
          rules={[{ required: true, message: "Please enter your College name" }]}
        >
          <AntInput placeholder="Enter College name" />
        </Form.Item>
        <Form.Item
          label="Employee ID"
          name="EmployeeID"
          rules={[{ required: true, message: "Please enter your Employee ID" }]}
        >
          <AntInput placeholder="Enter Employee ID" />
        </Form.Item>
        <Form.Item
  label="Old Password"
  name="oldPassword"
  rules={[
    ({ getFieldValue }) => ({
      validator(_, value) {
        const newPassword = getFieldValue("newPassword");
        const confirmNewPassword = getFieldValue("confirmNewPassword");

        // If any of the other fields are filled, this field becomes mandatory
        if (value || newPassword || confirmNewPassword) {
          if (!value) {
            return Promise.reject(new Error("Please enter your old password"));
          }
        }
        return Promise.resolve();
      },
    }),
  ]}
>
  <AntInput.Password placeholder="Enter old password" />
</Form.Item>
<Form.Item
  label="New Password"
  name="newPassword"
  dependencies={["oldPassword", "confirmNewPassword"]}
  rules={[
    { min: 6, message: "Password must be at least 6 characters long" },
    ({ getFieldValue }) => ({
      validator(_, value) {
        const oldPassword = getFieldValue("oldPassword");
        const confirmNewPassword = getFieldValue("confirmNewPassword");

        // If any of the other fields are filled, this field becomes mandatory
        if (value || oldPassword || confirmNewPassword) {
          if (!value) {
            return Promise.reject(new Error("Please enter your new password"));
          }
        }
        return Promise.resolve();
      },
    }),
  ]}
>
  <AntInput.Password placeholder="Enter new password" />
</Form.Item>
<Form.Item
  label="Confirm New Password"
  name="confirmNewPassword"
  dependencies={["oldPassword", "newPassword"]}
  rules={[
    ({ getFieldValue }) => ({
      validator(_, value) {
        const oldPassword = getFieldValue("oldPassword");
        const newPassword = getFieldValue("newPassword");

        // If any of the other fields are filled, this field becomes mandatory
        if (value || oldPassword || newPassword) {
          if (!value) {
            return Promise.reject(new Error("Please confirm your new password"));
          }
          if (value !== newPassword) {
            return Promise.reject(new Error("Passwords do not match"));
          }
        }
        return Promise.resolve();
      },
    }),
  ]}
>
  <AntInput.Password placeholder="Confirm new password" />
</Form.Item>

        <div className="col-span-2 flex justify-center">
          <Button type="primary" htmlType="submit" >
            Update Profile
          </Button>
        </div>
      </Form>
    </div>
  </div>
)}
      </Content>
    </Layout>
  );
};

export default AdminDashboard;