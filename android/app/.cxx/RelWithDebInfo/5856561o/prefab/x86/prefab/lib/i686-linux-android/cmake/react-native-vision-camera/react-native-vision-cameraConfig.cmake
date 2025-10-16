if(NOT TARGET react-native-vision-camera::VisionCamera)
add_library(react-native-vision-camera::VisionCamera SHARED IMPORTED)
set_target_properties(react-native-vision-camera::VisionCamera PROPERTIES
    IMPORTED_LOCATION "/Users/omarbaltaji/Desktop/doko-ewallet-react-native/node_modules/react-native-vision-camera/android/build/intermediates/cxx/RelWithDebInfo/5p272v14/obj/x86/libVisionCamera.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/omarbaltaji/Desktop/doko-ewallet-react-native/node_modules/react-native-vision-camera/android/build/headers/visioncamera"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

