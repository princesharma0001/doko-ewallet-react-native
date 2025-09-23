# New Group Feature Installation Instructions

## New Dependencies Added

The New Group feature requires the following new dependency:

- `react-native-image-picker`: For selecting group profile images

## Installation Steps

1. Install the new dependency:
   ```bash
   npm install react-native-image-picker
   ```

2. For iOS, you may need to run:
   ```bash
   cd ios && pod install && cd ..
   ```

3. For Android, the package should work automatically with autolinking.

## Features Implemented

### NewGroup Screen (`src/Screens/NewGroup.jsx`)
- ✅ Group name input field
- ✅ Group profile image selection with camera/gallery picker
- ✅ User search functionality
- ✅ Multiple user selection with visual indicators
- ✅ Selected users display with remove option
- ✅ Create group validation (minimum 2 members required)
- ✅ Responsive design with theme support

### Navigation Updates
- ✅ Added NewGroup screen to AppNavigator
- ✅ Updated NewChat component to navigate to NewGroup on button click

### User Interface Features
- ✅ Modern, clean design matching the app's theme
- ✅ Search functionality for finding users
- ✅ Visual selection indicators
- ✅ Online/offline status indicators
- ✅ Avatar generation for users without profile images
- ✅ Responsive layout for different screen sizes

## Usage

1. Navigate to the NewChat screen
2. Click the "New Group" button
3. Select a group profile image (optional)
4. Enter a group name
5. Search and select multiple users
6. Click "Create" to create the group

The feature is now ready to use!
