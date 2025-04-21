'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Select, message, Alert } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StateSelect from './StateSelect';

const RegistrationForm: React.FC = () => {
  const { Option } = Select;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [stateValue, setStateValue] = useState<string>("");

  // Base URL
  const baseUrl = "https://asia-south1-mediksharegistration.cloudfunctions.net";

  // Handler for registration
  const handleRegister = async (values: any) => {
    const payload = {
      fullName: values.name,
      email: values.email,
      RollNumber: values.rollNumber,
      collegeName: values.institution,
      stateOfResidence: stateValue, // Use the selected state
      phoneNumber: values.contact,
    };

    console.log('Payload:', payload);

    try {
      const response = await axios.post(`${baseUrl}/StudentRegistration`, payload);

      if (response.status === 201) {
        setErrorMessage(null); // Clear any existing error message
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 5000); // Hide message after 5 seconds
        message.success('Your registration was completed successfully!');
        form.resetFields(); // Clear the form
        setStateValue(""); // Reset the state value

        navigate("/login");
      }
    } catch (error: any) {
      console.error('Registration failed:', error);

      // Error handling based on API response
      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 401:
            setErrorMessage('Invalid email format. Please try again.');
            break;
          case 402:
            setErrorMessage('Invalid phone number format. Please try again.');
            break;
          case 404:
            setErrorMessage('User already exists for this email.');
            break;
          case 405:
            setErrorMessage(
              `Missing required fields: ${data.message}. Please try again.`
            );
            break;
          default:
            setErrorMessage('Registration failed. Please try again.');
        }
      } else {
        setErrorMessage('Unable to connect to the server. Please try again.');
      }
    }
  };

  // Handle state change
  const handleStateChange = (value: string) => {
    setStateValue(value);
    console.log('Selected State:', value);
  };

  return (
    <div
      className="relative w-screen h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/Registration/RegBackground.jpeg')" }}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-5xl font-bold text-blue-900 mt-8">
          Welcome! We are excited just as you are.
        </h1>
        <h2 className="text-3xl font-normal text-blue-900 mt-4">
          Registration Form
        </h2>
        {showMessage && (
          <div style={{ color: 'green', fontWeight: 'bold', marginBottom: '10px' }}>
            Your registration was completed successfully!
          </div>
        )}

        <div className="bg-blue-900 bg-opacity-30 border border-blue-900 rounded-lg p-8 w-[600px] mt-8">
          {/* Show error message if it exists */}
          {errorMessage && (
            <div className="mb-4">
              <Alert
                message="Error"
                description={errorMessage}
                type="error"
                showIcon
                closable
                onClose={() => setErrorMessage(null)}
              />
            </div>
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleRegister}
          >
            <div className="grid grid-cols-2 gap-6">
              <Form.Item
                label="Name:"
                name="name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Email ID:"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Contact No.:"
                name="contact"
                rules={[{ required: true, message: 'Please enter your contact number' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="State of Residence:"
                name="state"
                rules={[{ required: true, message: "Please select your state" }]}
              >
                <StateSelect placeholder="Select your state" onChange={handleStateChange} />
              </Form.Item>
              <Form.Item
                label="Roll No.:"
                name="rollNumber"
                rules={[{ required: true, message: 'Please enter your roll number' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="College Name:"
                name="institution"
                rules={[{ required: true, message: 'Please enter your college name' }]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="flex justify-center">
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-900 rounded-full h-12 w-36 text-lg"
              >
                Register
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;