import React from "react";
import { Select } from "antd";

const { Option } = Select;

interface StateSelectProps {
  value?: string; // Current selected value
  onChange: (value: string) => void; // Handler for selection change
  placeholder?: string; // Optional placeholder text
}

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const StateSelect: React.FC<StateSelectProps> = ({
  value,
  onChange,
  placeholder = "Select your state",
}) => {
  return (
    <Select
      className="w-full"
      onChange={onChange}
      value={value}
      placeholder={placeholder}
    >
      {indianStates.map((state) => (
        <Option key={state} value={state}>
          {state}
        </Option>
      ))}
    </Select>
  );
};

export default StateSelect;