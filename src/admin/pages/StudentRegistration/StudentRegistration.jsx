import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import './StudentRegistration.css';
import axios from 'axios'; 

import { Eye, EyeOff } from 'lucide-react';
import bannerBg from '../../../assets/images/banner-bg.png';

const StudentRegistration = () => {
  const navigate = useNavigate();
  
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [showPasswordMap, setShowPasswordMap] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    faculty: '',
    email: '',
    password: ''
  });

  const [studentList, setStudentList] = useState([]);

  
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/register/all');
      
      const formattedData = response.data.map(st => ({
        id: st.CustomID,
        name: st.FullName,
        email: st.Email,
        faculty: st.Faculty,
        password: st.Password
      }));
      setStudentList(formattedData);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  
  useEffect(() => {
    if (!isEditing) {
      if (studentList.length === 0) {
        setStudentId('ST-0001');
      } else {
        const lastIdNumber = Math.max(...studentList.map(st => 
          parseInt(st.id.replace('ST-', ''))
        ));
        const nextNumber = lastIdNumber + 1;
        setStudentId(`ST-${nextNumber.toString().padStart(4, '0')}`);
      }
    }
  }, [studentList, isEditing]);

  const togglePasswordVisibility = (id) => {
    setShowPasswordMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredStudents = studentList.filter((student) => {
    const matchesSearch = 
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFaculty = facultyFilter === '' || student.faculty === facultyFilter;
    return matchesSearch && matchesFaculty;
  });

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        
        await axios.put(`http://localhost:5000/api/register/${editId}`, {
            fullName: formData.name,
            email: formData.email,
            faculty: formData.faculty,
            password: formData.password
        });
        alert("Student Details Updated!");
      } else {
        
        const response = await axios.post('http://localhost:5000/api/register', {
          studentId: studentId,
          fullName: formData.name,
          faculty: formData.faculty,
          email: formData.email,
          password: formData.password
        });

        if (response.data.success) {
          alert("Student Registered Successfully!");
        }
      }
      
     
      fetchStudents(); 
      setFormData({ name: '', faculty: '', email: '', password: '' });
      setStudentId(''); 
      setShowForm(false);
      setIsEditing(false);
      setEditId(null);
      
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || "Something went wrong"));
    }
  };


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`http://localhost:5000/api/register/${id}`);
        fetchStudents(); 
        alert("Student Deleted!");
      } catch (error) {
        alert("Delete failed!");
      }
    }
  };

  const handleEdit = (student) => {
    setFormData({ name: student.name, faculty: student.faculty, email: student.email, password: student.password });
    setStudentId(student.id);
    setEditId(student.id);
    setIsEditing(true);
    setShowForm(true);
  };

  return (
    <div className="admin-layout-wrapper">
      <Sidebar />
      <div className="admin-page-content" style={{ '--bg-image': `url(${bannerBg})` }}>
        
        <header className="page-header-simple">
          <div className="welcome-text">
            <h1>Student Management</h1>
          </div>
          <button 
            className="btn-add-main" 
            onClick={() => {
              setShowForm(!showForm);
              if(isEditing) setIsEditing(false);
            }}
          >
            {showForm ? "Close Form" : "+ Register New Student"}
          </button>
        </header>

        {showForm && (
          <section className="form-container-card animate-fade">
            <h3 className="form-title">{isEditing ? "Update Student Details" : "Register New Student"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Student ID</label>
                  <input type="text" value={studentId} readOnly className="auto-id-input" />
                </div>
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Kasun Kalhara" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Faculty</label>
                  <select 
                    value={formData.faculty}
                    onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                    required
                  >
                    <option value="">Select Faculty</option>
                    <option value="Computing">Computing</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Personal Email</label>
                  <input 
                    type="email" 
                    placeholder="student@gamil.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <input 
                  type="text" 
                  placeholder="Set a password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>

              <div className="form-actions-right">
                <button type="submit" className="publish-btn">
                  {isEditing ? "Save Changes" : "Register Student"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="student-list-container">
            <div className="log-header">
                <h3 className="form-title">Registered Students</h3>
                <div className="table-controls">
                    <select 
                      className="filter-select"
                      value={facultyFilter}
                      onChange={(e) => setFacultyFilter(e.target.value)}
                    >
                      <option value="">All Faculties</option>
                      <option value="Computing">Computing</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Business">Business</option>
                    </select>

                    <input 
                      type="text" 
                      placeholder="Search ID & Name..." 
                      className="table-search" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

          <div className="table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Full Name</th>
                  <th>Email Address</th>
                  <th>Faculty</th>
                  <th>Portal Password</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td><strong>{student.id}</strong></td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.faculty}</td>
                      <td style={{ minWidth: '150px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontFamily: showPasswordMap[student.id] ? 'inherit' : 'monospace' }}>
                            {showPasswordMap[student.id] ? student.password : '••••••••'}
                          </span>
                          <button 
                            type="button"
                            onClick={() => togglePasswordVisibility(student.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center' }}
                            title={showPasswordMap[student.id] ? "Hide Password" : "Show Password"}
                          >
                            {showPasswordMap[student.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-edit" onClick={() => handleEdit(student)}>Edit</button>
                          <button className="btn-delete" onClick={() => handleDelete(student.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentRegistration;