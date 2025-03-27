import { toast } from "react-toastify";

export const showToast = (type, message) => {
  const options = {
    position: "top-right",
    autoClose: 3000, // Closes after 3 seconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    closeButton: true, // Ensures the close button is enabled
    theme: "dark",
  };
  if (type === "success") {
    toast.success(message, options);
  } else if (type === "error") {
    toast.error(message, options);
  } else if (type === "info") {
    toast.info(message, options);
  } else if (type === "warning") {
    toast.warning(message, options);
  }
};
