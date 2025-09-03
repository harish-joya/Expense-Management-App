import Header from './Header';
import Footer from './Footer';
import '../styles/Layout.css'; 

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Header />
      <div className="layout-content">
        {children}
      </div>
      <Footer/>
    </div>
  );
};

export default Layout;
