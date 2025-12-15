export const GoogleDriveIcon = ({ size = 24, ...props }) => {
  return (
    <img
      src="/google-drive-icon.png"
      alt="Google Drive"
      width={size}
      height={size}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...props.style }}
      {...props}
    />
  );
};

