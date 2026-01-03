import React, { useState } from "react";
import { AdminService } from "../services/admin.service";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateEmployeeModal: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "employee",
    department: "",
    designation: "",
    wage: "",
    joinDate: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await AdminService.createUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        designation: formData.designation,
        wage: parseFloat(formData.wage) || 0,
        joinDate: formData.joinDate
      });

      alert(response.message + (response.tempPassword ? `\n\nTemporary Password: ${response.tempPassword}` : ''));
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "employee",
        department: "",
        designation: "",
        wage: "",
        joinDate: new Date().toISOString().split('T')[0]
      });
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  console.log('Modal render - open:', open);
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.2)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#F6F3FA",
          borderRadius: 12,
          padding: "32px 24px",
          minWidth: 500,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 24 }}>
          Create New Employee
        </div>
        {error && (
          <div style={{ 
            background: "#ffebee", 
            color: "#c62828", 
            padding: "12px", 
            borderRadius: 6, 
            marginBottom: 16,
            fontSize: 14
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            <input 
              className="modal-input" 
              placeholder="First Name" 
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input 
              className="modal-input" 
              placeholder="Department" 
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            <input 
              className="modal-input" 
              placeholder="Last Name" 
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <input 
              className="modal-input" 
              placeholder="Designation" 
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            <input 
              className="modal-input" 
              placeholder="Email Address" 
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input 
              className="modal-input" 
              placeholder="Wage (₹)" 
              name="wage"
              type="number"
              value={formData.wage}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
            <select 
              className="modal-input"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
            <input 
              className="modal-input" 
              placeholder="Join Date" 
              name="joinDate"
              type="date"
              value={formData.joinDate}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button
              type="button"
              style={{
                background: "#B39DDB",
                color: "#fff",
                borderRadius: 6,
                padding: "8px 24px",
                border: "none",
                fontWeight: 500,
                fontSize: 16,
                cursor: "pointer"
              }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? "#B39DDB" : "#512DA8",
                color: "#fff",
                borderRadius: 6,
                padding: "8px 24px",
                border: "none",
                fontWeight: 500,
                fontSize: 16,
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Creating..." : "Create Employee"}
            </button>
          </div>
        </form>
      </div>
      <style>
        {`
          .modal-input {
            flex: 1;
            padding: 10px 12px;
            border-radius: 6px;
            border: 1px solid #E0E0E0;
            font-size: 15px;
            background: #fff;
          }
        `}
      </style>
    </div>
  );
};
