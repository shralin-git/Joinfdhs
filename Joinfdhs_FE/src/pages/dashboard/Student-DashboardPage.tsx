"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Layout,
  Menu,
  Avatar,
  Typography,
  Button,
  Form,
  Input as AntInput,
  message,
  Alert,
  Spin,
} from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { fetchUserProfile } from "../../utils/userService";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const StudentDashboard: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState("settings");
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { idToken, fullName, username, logout } = useAuth();

  useEffect(() => {
    if (location.pathname === "/student-dashboard") {
      setSelectedMenu("settings");
    }
  }, [location.pathname]);

  const handleMenuClick = (e: any) => {
    if (e.key === "dashboard") {
      navigate("/student-dashboard/enrol");
    } else {
      setSelectedMenu(e.key);
    }
  };

  const handleLogout = () => {
    logout(navigate);
  };

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      if (!username || !idToken) {
        message.error("Missing required credentials to load profile.");
        return;
      }

      const response = await fetchUserProfile(username, idToken);

      console.log("Profile response:", response);

      if (response.success && response.data) {
        form.setFieldsValue({
          fullName: response.data.fullName || "",
          phoneNumber: response.data.phoneNumber || "",
          stateOfResidence: response.data.stateOfResidence || "",
          collegeName: response.data.collegeName || "",
          RollNumber: response.data.RollNumber || "",
        });
      } else {
        message.error(response.error || "Failed to load user profile.");
      }
    } catch (error: any) {
      console.error("Error loading profile:", error);
      message.error(error.message || "An unexpected error occurred while loading the profile.");
    } finally {
      setLoadingProfile(false);
    }
  };

  const updateProfile = async (values: any) => {
    const payload = {
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      stateOfResidence: values.stateOfResidence,
      collegeName: values.collegeName,
      RollNumber: values.RollNumber,
      ...(values.oldPassword && values.newPassword && values.confirmNewPassword && {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      }),
    };

    const url = "https://asia-south1-mediksharegistration.cloudfunctions.net/UpdateStudentProfile";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${idToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Update failed. Please try again.");
        return;
      }

      message.success("Student information updated successfully!");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
    } catch (error: any) {
      console.error("Update failed:", error);
      setErrorMessage("Unable to connect to the server. Please try again.");
    }
  };

  useEffect(() => {
    if (selectedMenu === "settings") {
      fetchProfile();
    }
  }, [selectedMenu]);

  return (
    <Layout className="w-full h-screen bg-blue-100">
      {/* Sidebar */}
      <Sider
        width={250}
        className="h-full bg-gradient-to-b from-primary to-blue-700 p-4 flex flex-col justify-between rounded-r-2xl"
      >
        <div className="flex flex-col items-center">
          <Avatar size={80} icon={<UserOutlined />} className="bg-blue-600 mb-4" />
          <Text className="text-white text-lg font-semibold">
            Welcome, {fullName || "Guest"}!
          </Text>
        </div>
        <Menu
          theme="dark"
          mode="vertical"
          className="bg-transparent"
          selectedKeys={[selectedMenu]}
          onClick={handleMenuClick}
        >
          <Menu.Item key="dashboard" icon={<UserOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Content */}
      <Content
        className="p-8 ml-[250px]"
        style={{
          backgroundImage: `url(/assets/mentor-dashboard/backgroundImg.jpeg)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          minHeight: "100vh",
          marginLeft: "0px"
        }}
      >
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
      Student Settings - Profile Update
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
          label="College name"
          name="collegeName"
          rules={[{ required: true, message: "Please enter your College name" }]}
        >
          <AntInput placeholder="Enter College name" />
        </Form.Item>
        <Form.Item
          label="Roll Number"
          name="RollNumber"
          rules={[{ required: true, message: "Please enter your roll number" }]}
        >
          <AntInput placeholder="Enter your roll number" />
        </Form.Item>
        <Form.Item
          label="Old Password"
          name="oldPassword"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value || getFieldValue("newPassword") || getFieldValue("confirmNewPassword")) {
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
                if (value || getFieldValue("oldPassword") || getFieldValue("confirmNewPassword")) {
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
                if (value || getFieldValue("newPassword") || getFieldValue("oldPassword")) {
                  if (!value) {
                    return Promise.reject(new Error("Please confirm your new password"));
                  }
                  if (value !== getFieldValue("newPassword")) {
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
          <Button type="primary" htmlType="submit">
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

export default StudentDashboard;