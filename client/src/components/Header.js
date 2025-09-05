import React, { useState, useEffect } from "react";
import { Drawer, Button, Typography } from "antd";
import '../styles/Header.css';
import { MenuOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const Header = () => {
  const [loginUser, setLoginUser] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("user"));
    if (storedData && storedData.user) setLoginUser(storedData.user);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="header">
      {/* Heading */}
      <Text strong className="heading">Expense-Manager</Text>

      {/* Desktop Menu */}
      {loginUser && (
        <div className="desktop-menu">
          <div className="user-info">
            <div className="user-icon">
              {loginUser.username.charAt(0).toUpperCase()}
            </div>
            <span className="username">{loginUser.username}</span>
          </div>
          <button className="logout-btn" onClick={logoutHandler}>
            <LogoutOutlined /> Logout
          </button>
        </div>
      )}

      {/* Mobile Hamburger */}
      <Button
        className="mobile-menu"
        type="primary"
        icon={<MenuOutlined />}
        onClick={() => setDrawerVisible(true)}
      />

      {/* Drawer for mobile */}
      <Drawer
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {loginUser && (
          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <Text>
              <UserOutlined style={{ marginRight: 5 }} />
              {loginUser.username}
            </Text>
            <button className="logout-btn" onClick={logoutHandler}>
              <LogoutOutlined /> Logout
            </button>
          </div>
        )}
      </Drawer>
    </header>
  );
};

export default Header;
