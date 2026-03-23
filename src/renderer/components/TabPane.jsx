// src/renderer/components/TabPane.jsx
import React from 'react';

const TabPane = ({ children, active, tabId }) => {
  return active === tabId ? <div className="tab-pane">{children}</div> : null;
};

export default TabPane;