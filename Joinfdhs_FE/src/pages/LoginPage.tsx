import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Replace Next.js Link
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

export type RoleType = 'Admin' | 'Student' | 'Mentor' | 'Super admin';

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate(); // Replace Next.js router
  const [selectedRole, setSelectedRole] = useState<RoleType>('Admin');

  useEffect(() => {
    message.info(`Role Type: ${selectedRole}`);
  }, [selectedRole]);
  const handleSubmit = async (values: { username: string; password: string }) => {
    console.log("Form values:", values); // This should log { username: "value", password: "value" }

    if (values.username && values.password) {
      await login(values.username, values.password, selectedRole, navigate);
    } else {
      console.error("Username or password is missing.");
    }
  };

    // Event handler for navigation
    const handleRegisterNavigation = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      switch (selectedRole) {
        case "Student":
          navigate("/StudentRegister");
          break;
        case "Mentor":
          navigate("/MentorRegister");
          break;
        case "Admin":
          message.error("Admin cannot register.");
          break;
        default:
          message.error("Please select a role to register.");

      }
    };
  const roleOptions = [
    { role: 'Admin', imageSrc: '/assets/LoginPage/Admin.png', altText: 'Admin' },
    { role: 'Student', imageSrc: '/assets/LoginPage/Mentee.png', altText: 'Student' },
    { role: 'Mentor', imageSrc: '/assets/LoginPage/Mentor.png', altText: 'Mentor' },
  ];

  return (
    <div className="relative min-h-screen w-full bg-white">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/assets/LoginPage/LoginBackground.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Login Container */}
      <div className="relative z-10 max-w-lg mx-auto pt-16">
        <div className="bg-white border border-blue-900 rounded-lg shadow-lg p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/assets/FrontPage/logo.png"
              alt="Logo"
              width={224}
              height={74}
            />
          </div>

          <Title level={2} className="text-center text-blue-900 mb-8">
            Choose Account Type
          </Title>

          {/* Role Selection */}
          <div className="flex justify-center gap-8 mb-10">
            {roleOptions.map(({ role, imageSrc, altText }) => (
              <div
                key={role}
                onClick={() => setSelectedRole(role as RoleType)}
                className={`
                  cursor-pointer p-4 border rounded-lg transition-all
                  ${selectedRole === role ? 'border-blue-900 shadow-md' : 'border-gray-300'}
                  hover:border-blue-900 hover:shadow-md
                `}
              >
                <img
                  src={imageSrc}
                  alt={altText}
                  width={100}
                  height={100}
                  className="object-contain"
                />
                <Typography.Text className="block text-center text-blue-900 font-semibold mt-2">
                  {role}
                </Typography.Text>
              </div>
            ))}
          </div>

          <Title level={4} className="text-center text-blue-900 mb-6">
            Login Here!
          </Title>

          <Form onFinish={handleSubmit} layout="vertical" size="large">
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please enter your username!' }]}
            >
              <Input
                prefix={<UserOutlined className="text-blue-900" />}
                placeholder="Username"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-blue-900" />}
                placeholder="Password"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item className="text-center">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className="w-full bg-blue-900 hover:bg-blue-800 rounded-lg"
              >
                Log In
              </Button>
            </Form.Item>

            <div className="text-center">
              <button
                className="text-blue-900 text-lg hover:text-blue-700 underline"
                onClick={handleRegisterNavigation} // Replace Link with navigate
              >
                New User? Register Here
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;