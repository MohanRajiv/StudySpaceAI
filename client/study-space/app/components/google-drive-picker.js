"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { FaTimes } from "react-icons/fa";
import { GoogleDriveIcon } from "./google-drive-icon";

// Export a function to open the picker that can be called from parent
let openPickerFunction = null;

export const GoogleDrivePicker = ({ onFilesSelected, selectedDriveFiles, onRemoveFile, autoOpen = false, showButton = true, onBeforeConnect }) => {
  const { userId } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pickerLoaded, setPickerLoaded] = useState(false);
  const pickerInitialized = useRef(false);

  useEffect(() => {
    checkConnectionStatus();
    loadPickerAPI();
  }, []);

  // Auto-open picker if autoOpen is true and connected
  useEffect(() => {
    if (autoOpen && isConnected && pickerLoaded) {
      // Wait a bit for everything to be ready
      const timer = setTimeout(() => {
        handleOpenPicker();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [autoOpen, isConnected, pickerLoaded]);

  const loadPickerAPI = () => {
    if (typeof window !== 'undefined' && window.gapi && window.google) {
      window.gapi.load('picker', () => {
        setPickerLoaded(true);
      });
    } else if (typeof window !== 'undefined') {
      // Wait for gapi to be available
      const checkGAPI = setInterval(() => {
        if (window.gapi && window.google) {
          window.gapi.load('picker', () => {
            setPickerLoaded(true);
          });
          clearInterval(checkGAPI);
        }
      }, 100);

      // Cleanup after 10 seconds if still not loaded
      setTimeout(() => clearInterval(checkGAPI), 10000);
    }
  };

  const checkConnectionStatus = async () => {
    try {
      const res = await fetch("/api/google-drive/files?pageSize=1");
      if (res.ok) {
        setIsConnected(true);
      } else if (res.status === 400) {
        // Expected when not connected - silently set to false
        setIsConnected(false);
      }
    } catch (error) {
      // Network errors - silently set to false
      setIsConnected(false);
    }
  };

  const handleConnect = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Save current page state before redirecting (if callback provided)
      if (onBeforeConnect && typeof onBeforeConnect === 'function') {
        onBeforeConnect();
      }
      
      const res = await fetch("/api/google-drive/auth");
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to connect to Google Drive");
      }
      
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        throw new Error("No authorization URL received");
      }
    } catch (error) {
      console.error("Error connecting to Google Drive:", error);
      alert(error.message || "Failed to connect to Google Drive. Please check your environment configuration.");
      setIsLoading(false);
    }
  }, [onBeforeConnect]);

  const pickerCallback = useCallback(async (data) => {
    if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
      const docs = data[window.google.picker.Response.DOCUMENTS];
      
      if (docs && docs.length > 0) {
        // Handle each selected file
        for (const doc of docs) {
          try {
            // Download the file
            const res = await fetch("/api/google-drive/download", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ fileId: doc.id }),
            });

            if (!res.ok) {
              if (res.status === 401) {
                setIsConnected(false);
                alert("Google Drive connection expired. Please reconnect.");
                return;
              }
              throw new Error("Failed to download file");
            }

            const fileData = await res.json();
            
            // Convert base64 to blob
            const binaryString = atob(fileData.fileData);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: fileData.mimeType });
            
            // Create a File object from the blob
            const downloadedFile = new File([blob], fileData.fileName, { type: fileData.mimeType });
            
            // Add drive file metadata
            downloadedFile.driveId = doc.id;
            downloadedFile.driveName = doc.name;
            downloadedFile.driveMimeType = doc.mimeType;

            onFilesSelected(downloadedFile);
          } catch (error) {
            console.error("Error processing selected file:", error);
            alert(`Failed to process file: ${doc.name}`);
          }
        }
      }
    } else if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.CANCEL) {
      // User cancelled the picker
      console.log("User cancelled Google Drive picker");
    }
  }, [onFilesSelected]);

  const handleOpenPicker = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get access token and client ID - this will tell us if connected
      const tokenRes = await fetch("/api/google-drive/picker-token");
      
      if (tokenRes.status === 401 || tokenRes.status === 400) {
        setIsConnected(false);
        // Instead of alert, trigger the connect flow
        handleConnect();
        setIsLoading(false);
        return;
      }

      if (!tokenRes.ok) {
        throw new Error("Failed to get access token");
      }

      const { accessToken, clientId } = await tokenRes.json();

      if (!window.gapi || !window.google || !pickerLoaded) {
        throw new Error("Google Picker API not loaded");
      }

      // Create a view for PDF files only
      const docsView = new window.google.picker.DocsView()
        .setMimeTypes('application/pdf')
        .setIncludeFolders(false);

      // Create and show the picker
      const picker = new window.google.picker.PickerBuilder()
        .addView(docsView)
        .setOAuthToken(accessToken)
        .setCallback(pickerCallback)
        .setOrigin(window.location.origin)
        .setSize(window.innerWidth > 600 ? 1024 : window.innerWidth - 20, window.innerHeight - 100)
        .build();

      picker.setVisible(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error opening picker:", error);
      alert("Failed to open Google Drive picker. Please try again.");
      setIsLoading(false);
    }
  }, [pickerLoaded, pickerCallback, isConnected, handleConnect]);

  // Expose the open picker function globally so it can be called from anywhere
  // Always expose it, so clicking the icon works even when not connected (will trigger connect flow)
  useEffect(() => {
    openPickerFunction = handleOpenPicker;
    window.openGoogleDrivePicker = handleOpenPicker;
    return () => {
      openPickerFunction = null;
      if (window.openGoogleDrivePicker) {
        delete window.openGoogleDrivePicker;
      }
    };
  }, [handleOpenPicker]);

  // Don't render anything if showButton is false (for when we just want to expose the function)
  if (!showButton) {
    return null;
  }

  if (!isConnected) {
    return (
      <div className="google-drive-connect">
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="google-drive-connect-btn"
        >
          <GoogleDriveIcon size={20} />
          {isLoading ? "Connecting..." : "Connect Google Drive"}
        </button>
      </div>
    );
  }

  return (
    <div className="google-drive-picker-container">
      <button
        onClick={handleOpenPicker}
        disabled={isLoading || !pickerLoaded}
        className="google-drive-open-btn"
      >
        <GoogleDriveIcon size={20} />
        {isLoading ? "Opening..." : pickerLoaded ? "Select from Google Drive" : "Loading..."}
      </button>
      
      {selectedDriveFiles.length > 0 && (
        <div className="selected-drive-files">
          {selectedDriveFiles.map((file, index) => (
            <div key={index} className="selected-drive-file-item">
              <GoogleDriveIcon size={16} />
              <span>{file.driveName || file.name}</span>
              <button
                type="button"
                onClick={() => onRemoveFile(index)}
                className="remove-drive-file-btn"
              >
                <FaTimes size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Export a hook to get the open picker function
export const useGoogleDrivePicker = () => {
  return () => {
    if (openPickerFunction) {
      openPickerFunction();
    } else {
      console.error("Google Drive Picker not ready. Make sure GoogleDrivePicker component is mounted.");
    }
  };
};
