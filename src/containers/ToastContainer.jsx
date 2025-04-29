// src/components/ToastContainer.js
import { Toaster } from 'react-hot-toast';

const ToastContainer = () => {
  return (
    <Toaster
      position="top-center" // Position at the top center
      reverseOrder={false}
      toastOptions={{
        style: {
          background: '#f9fafb', // Lighter gray background for classic look
          color: '#333', // Darker text for better contrast
          padding: '16px 24px', // Wider toast with more padding
          borderRadius: '8px', // Rounded corners
          fontSize: '16px', // Slightly larger font size for readability
          width: '400px', // Fixed width to make the toast wide
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Classic subtle shadow
          marginTop: '20px', // A little space at the top
        },
        success: {
          style: {
            background: '#e0f9e9', // Light green background for success
            color: '#2f855a', // Dark green text for success
            border: '1px solid #2f855a', // Border to match the text color
          },
          iconTheme: {
            primary: '#2f855a', // Green icon for success
            secondary: '#ffffff',
          },
          duration: 4000, // Duration for toast visibility
          progressBar: true, // Enable the progress bar (scrubber effect)
          progressStyle: {
            background: '#38a169', // Green color for the scrubber
            height: '4px', // Thicker progress bar for scrubber effect
            borderRadius: '4px', // Rounded edges on the progress bar
            animation: 'scrub 4s linear infinite', // Scrubber animation
          },
        },
        error: {
          style: {
            background: '#fee2e2', // Light red background for error
            color: '#991b1b', // Dark red text for error
            border: '1px solid #991b1b', // Border to match the text color
          },
          iconTheme: {
            primary: '#991b1b', // Red icon for error
            secondary: '#ffffff',
          },
          duration: 4000, // Duration for toast visibility
          progressBar: true, // Enable the progress bar (scrubber effect)
          progressStyle: {
            background: '#e53e3e', // Red color for the scrubber
            height: '4px', // Thicker progress bar for scrubber effect
            borderRadius: '4px', // Rounded edges on the progress bar
            animation: 'scrub 4s linear infinite', // Scrubber animation
          },
        },
      }}
    />
  );
};

export default ToastContainer;
