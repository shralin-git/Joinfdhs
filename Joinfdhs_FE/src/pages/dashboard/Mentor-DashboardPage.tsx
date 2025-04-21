"use client"; // Needed if using Next.js App Router

import React, { useState, useEffect } from "react";
import {
  Menu,
  Layout,
  Avatar,
  Typography,
  Button,
  Table,
  Form,
  Input as AntInput,
  message,
  Spin,
} from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo } from "../../utils/userService";

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

const MentorDashboard: React.FC = () => {
  const { idToken, username, fullName, role, logout } = useAuth();
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [students, setStudents] = useState<User[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  const handleMenuClick = (e: any) => {
    setSelectedMenu(e.key);
  };

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
        throw new Error(errorData.message || "Failed to fetch user data.");
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
      }));

      return formattedData;
    } catch (error: any) {
      message.error(`Failed to fetch ${userType} data: ${error.message}`);
      return [];
    }
  };

  const loadStudents = async () => {
    setLoadingStudents(true);
    const studentData = await fetchUsers("student");
    setStudents(studentData);
    setLoadingStudents(false);
  };

  const updateProfile = async (values: any) => {
    const url = `https://asia-south1-mediksharegistration.cloudfunctions.net/UpdateMentorProfile`;
  
    try {
      setIsUpdatingProfile(true);
  
      // Check if all three password fields are filled
      const passwordsProvided =
        values.oldPassword && values.newPassword && values.confirmNewPassword;
  
      // Build the payload dynamically
      const payload: any = {
        fullName: values.fullName,
        mbbsNumber: values.mbbsNumber,
        collegeName: values.collegeName,
        stateOfResidence: values.stateOfResidence,
        specialization: values.specialization,
        phoneNumber: values.phoneNumber,
        ...(passwordsProvided && {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          confirmNewPassword: values.confirmNewPassword,
        }),
      };
  
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
        throw new Error(errorData.error || "Failed to update profile.");
      }
  
      const data = await response.json();
      message.success(data.message || "Profile updated successfully!");
    } catch (error: any) {
      message.error(`Failed to update profile: ${error.message}`);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const loadUserInfo = async () => {
    try {
      if (!idToken) {
        throw new Error("Authentication token is missing.");
      }

      if (!username) {
        throw new Error("Username is missing.");
      }

      const userInfo = await fetchUserInfo(username);
      form.setFieldsValue({
        fullName: userInfo.fullName || "",
        phoneNumber: userInfo.phoneNumber || "",
        stateOfResidence: userInfo.stateOfResidence || "",
        collegeName: userInfo.collegeName || "",
        mbbsNumber: userInfo.mbbsNumber || "",
        specialization: userInfo.specialization || "",
      });
    } catch (error: any) {
      message.error(`Failed to load user information: ${error.message}`);
    }
  };

  useEffect(() => {
    if (selectedMenu === "settings") {
      loadUserInfo();
    } else if (selectedMenu === "dashboard") {
      loadStudents();
    }
  }, [selectedMenu]);

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
        className="h-full bg-gradient-to-b from-primary to-blue-600 p-4 flex flex-col justify-between rounded-r-2xl margin-left-0"
      >
        <div className="flex flex-col items-center">
          <Avatar size={80} icon={<UserOutlined />} className="bg-blue-600 mb-4" />
          <Text className="text-white text-lg font-semibold">Welcome, {fullName}!</Text>
        </div>
        <Menu
          theme="dark"
          mode="vertical"
          className="bg-transparent mt-8"
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
              <Typography.Text
                  className="block"
                  style={{
                    color: "#d9d9d9", // Soft grey color for the date text
                    fontSize: "14px",
                    marginBottom: "4px",
                  }}
                >
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Typography.Text>
                <Typography.Title level={3} className="text-white">
                  Welcome, {fullName}!
                </Typography.Title>
              </div>
              <img
                src="/assets/mentor-dashboard/Mentee.png"
                alt="Header Image 1"
                className="w-32 h-30"
              />
            </div>
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
              style={{ backgroundColor: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(10px)" }}
            >
              <Title level={3} className="text-center text-blue-900 mb-6">
                Settings
              </Title>
              <Form
                form={form}
                layout="vertical"
                onFinish={updateProfile}
                className="grid grid-cols-2 gap-6"
              >
                <Form.Item
                  label="Name"
                  name="fullName"
                  rules={[{ required: true, message: "Please enter your name" }]}
                >
                  <AntInput placeholder="Enter your name" />
                </Form.Item>
                <Form.Item
                  label="Phone Number"
                  name="phoneNumber"
                  rules={[
                    { required: true, message: "Please enter your phone number" },
                    { pattern: /^[0-9]{10}$/, message: "Please enter a valid 10-digit phone number" },
                  ]}
                >
                  <AntInput placeholder="Enter your phone number" />
                </Form.Item>
                <Form.Item
                  label="State of Residence"
                  name="stateOfResidence"
                  rules={[{ required: true, message: "Please enter your state" }]}
                >
                  <AntInput placeholder="Enter your state of residence" />
                </Form.Item>
                <Form.Item
                  label="College Name"
                  name="collegeName"
                  rules={[{ required: true, message: "Please enter your College name" }]}
                >
                  <AntInput placeholder="Enter your College name" />
                </Form.Item>
                <Form.Item
                  label="MBBS Number"
                  name="mbbsNumber"
                  rules={[{ required: true, message: "Please enter your MBBS number" }]}
                >
                  <AntInput placeholder="Enter your MBBS number" />
                </Form.Item>
                <Form.Item
                  label="Specialization"
                  name="specialization"
                  rules={[{ required: true, message: "Please enter your specialization" }]}
                >
                  <AntInput placeholder="Enter your specialization" />
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
                            return Promise.reject(new Error("The two passwords do not match!"));
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
                  <Button type="primary" htmlType="submit" loading={isUpdatingProfile}>
                    Update
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

export default MentorDashboard;