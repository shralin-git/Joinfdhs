'use client';

import React, { useState } from 'react';
import { Input, Select, Button, message } from 'antd';
import axios from 'axios';
import StateSelect from '../../components/StateSelect';

const { Option } = Select;

export default function Form() {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    contact: '',
    rollNumber: '',
    state: '',
    institution: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSelectChange = (value: string) => {
    setFormValues({ ...formValues, state: value });
  };

  const handleSubmit = async () => {
    const { name, email, contact, rollNumber, state, institution } = formValues;

    if (!name || !email || !contact || !rollNumber || !state || !institution) {
      message.error('Please fill out all fields.');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/StudentRegistration`,
        formValues
      );
      if (response.status === 200) {
        message.success('Registration successful!');
        setFormValues({
          name: '',
          email: '',
          contact: '',
          rollNumber: '',
          state: '',
          institution: '',
        });
      }
    } catch (error) {
      console.error(error);
      message.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 md:px-8">
      <h1 className="text-2xl md:text-4xl font-bold text-blue-900 mb-4 text-center">
        Student Registration
      </h1>

      <div className="bg-blue-50 p-6 md:p-8 w-full md:w-[80%] lg:w-[60%] xl:w-[50%] rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-blue-900 font-bold mb-1">Name</label>
            <Input
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-blue-900 font-bold mb-1">Email</label>
            <Input
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-blue-900 font-bold mb-1">Contact</label>
            <Input
              name="contact"
              value={formValues.contact}
              onChange={handleInputChange}
              placeholder="Enter your contact number"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-blue-900 font-bold mb-1">Roll Number</label>
            <Input
              name="rollNumber"
              value={formValues.rollNumber}
              onChange={handleInputChange}
              placeholder="Enter your roll number"
              className="w-full"
            />
          </div>
          <div>
          <label className="block text-blue-900 font-bold mb-1">State</label>
            <StateSelect
              onChange={handleSelectChange} // Function to handle state selection changes
              placeholder="Select your state"
              value={formValues.state} // Binds the current selected value from formValues
            />
          </div>
          <div>
            <label className="block text-blue-900 font-bold mb-1">Institution</label>
            <Input
              name="institution"
              value={formValues.institution}
              onChange={handleInputChange}
              placeholder="Enter your College name"
              className="w-full"
            />
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <Button
            type="primary"
            onClick={handleSubmit}
            className="w-full md:w-40 bg-blue-600"
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}