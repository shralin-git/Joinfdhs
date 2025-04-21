'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Select, message, Alert } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StateSelect from '../components/StateSelect'; // Ensure this path is correct

const MentorRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const baseUrl = "https://asia-south1-mediksharegistration.cloudfunctions.net";

  // Handle form submission
  const handleRegister = async (values: any) => {
    const payload = {
      fullName: values.name,
      email: values.email,
      phoneNumber: values.contact,
      mbbsNumber: values.mbbsNumber,
      specialization: values.specialization,
      stateOfResidence: values.state,
      collegeName: values.institution,
    };

    try {
      const response = await axios.post(`${baseUrl}/MentorRegistration`, payload);

      if (response.status === 201) {
        setErrorMessage(null);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 5000);
        message.success('Your registration was successful!');
        form.resetFields();

        navigate("/login");
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 401:
            setErrorMessage('Invalid email format.');
            break;
          case 402:
            setErrorMessage('Invalid phone number format.');
            break;
          case 404:
            setErrorMessage('User already exists for this email.');
            break;
          case 405:
            setErrorMessage(`Missing required fields: ${data.message}.`);
            break;
          default:
            setErrorMessage('Registration failed. Please try again.');
        }
      } else {
        setErrorMessage('Unable to connect to the server. Please check your internet connection.');
      }
    }
  };

  return (
    <div
      className="relative w-screen h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/Registration/RegBackground.jpeg')" }}
    >
      <div className="flex flex-col items-center justify-center h-full px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-blue-900 mt-4 text-center">
          Mentor Registration
        </h1>
        <h2 className="text-xl md:text-3xl font-normal text-blue-900 mt-2 text-center">
          Join us and share your expertise!
        </h2>

        <div className="bg-blue-900 bg-opacity-30 border border-blue-900 rounded-lg p-6 md:p-8 w-full md:w-[80%] lg:w-[60%] xl:w-[50%] mt-6">
          {showSuccessMessage && (
            <Alert
              message="Success"
              description="Your registration was successful!"
              type="success"
              showIcon
              closable
              className="mb-4"
            />
          )}

          {errorMessage && (
            <Alert
              message="Error"
              description={errorMessage}
              type="error"
              showIcon
              closable
              className="mb-4"
              onClose={() => setErrorMessage(null)}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleRegister}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                label="Name:"
                name="name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input placeholder="Enter your full name" />
              </Form.Item>
              <Form.Item
                label="Email ID:"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input placeholder="Enter your email ID" />
              </Form.Item>
              <Form.Item
                label="Contact No.:"
                name="contact"
                rules={[
                  { required: true, message: 'Please enter your contact number' },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: 'Please enter a valid 10-digit phone number',
                  },
                ]}
              >
                <Input placeholder="Enter your contact number" />
              </Form.Item>
              <Form.Item
                label="State of Residence:"
                name="state"
                rules={[{ required: true, message: 'Please select your state' }]}
              >
                <StateSelect 
                  placeholder="Select your state" 
                  onChange={(value: string) => form.setFieldValue('state', value)} 
                />
              </Form.Item>
              <Form.Item
                label="MBBS No.:"
                name="mbbsNumber"
                rules={[{ required: true, message: 'Please enter your MBBS number' }]}
              >
                <Input placeholder="Enter your MBBS number" />
              </Form.Item>
              <Form.Item
                label="College name:"
                name="institution"
                rules={[{ required: true, message: 'Please enter your College name' }]}
              >
                <Input placeholder="Enter your College name" />
              </Form.Item>
              <Form.Item
                label="Specialization:"
                name="specialization"
                rules={[{ required: true, message: 'Please enter your specialization' }]}
              >
                <Input placeholder="Enter your specialization" />
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

export default MentorRegistration;