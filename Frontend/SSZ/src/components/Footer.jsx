import React from "react";

const Footer = () => {
  const styles = {
    footer: {
      textAlign: "center",
      padding: "10px 20px",
      backgroundColor: "#f8f9fa",
      color: "#6c757d",
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      borderTop: "1px solid #eaeaea",
    },
  };

  return (
    <footer style={styles.footer}>
      &copy; {new Date().getFullYear()} SkillSetZone. All Rights Reserved.
    </footer>
  );
};

export default Footer;
