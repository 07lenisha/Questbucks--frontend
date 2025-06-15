
import { createContext, useContext, useState } from "react";

const AdminContext = createContext();

export const useAdminContext = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const toggleRefresh = () => setRefreshFlag((prev) => !prev);

  return (
    <AdminContext.Provider value={{ refreshFlag, toggleRefresh }}>
      {children}
    </AdminContext.Provider>
  );
};
