"use client";
import { useEffect, useState } from "react";
import { GoogleDrivePicker } from "./google-drive-picker";
import { GoogleDriveIcon } from "./google-drive-icon";

export const GoogleDrivePickerButton = ({ onFileSelected }) => {
  const [openPicker, setOpenPicker] = useState(null);

  useEffect(() => {
    // This will be set by the GoogleDrivePicker component
    const checkPicker = setInterval(() => {
      if (window.openGoogleDrivePicker) {
        setOpenPicker(() => window.openGoogleDrivePicker);
        clearInterval(checkPicker);
      }
    }, 100);

    return () => clearInterval(checkPicker);
  }, []);

  return (
    <>
      {/* Hidden picker component to initialize */}
      <div style={{ display: 'none' }}>
        <GoogleDrivePicker
          onFilesSelected={onFileSelected}
          selectedDriveFiles={[]}
          onRemoveFile={() => {}}
          showButton={false}
        />
      </div>
      <button
        type="button"
        onClick={() => {
          if (openPicker) {
            openPicker();
          } else if (window.openGoogleDrivePicker) {
            window.openGoogleDrivePicker();
          } else {
            alert("Google Drive picker is loading. Please wait a moment and try again.");
          }
        }}
        style={{ 
          cursor: 'pointer', 
          marginLeft: '8px',
          background: 'none',
          border: 'none',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title="Add from Google Drive"
      >
        <GoogleDriveIcon size={24} />
      </button>
    </>
  );
};

