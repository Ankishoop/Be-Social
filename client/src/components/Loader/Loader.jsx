import React from "react";

const Loading = () => {
  return (
    <div style={styles.loaderContainer}>
      <div style={styles.spinner}></div>
      <p>Loading...</p>
    </div>
  );
};

const styles = {
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  spinner: {
    border: "8px solid #f3f3f3",
    borderRadius: "50%",
    borderTop: "8px solid #3498db",
    width: "60px",
    height: "60px",
    animation: "spin 2s linear infinite",
  },
};

export default Loading;
