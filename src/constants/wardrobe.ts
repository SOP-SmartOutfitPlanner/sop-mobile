export const ITEM_TYPES = [
  "top",
  "bottom", 
  "dress",
  "jacket",
  "shoes",
  "accessory"
] as const;

export const COLORS = [
  "black",
  "white", 
  "grey",
  "navy",
  "blue",
  "red",
  "green"
] as const;

export const IMAGE_PICKER_OPTIONS = {
  allowsEditing: true,
  aspect: [3, 4] as [number, number],
  quality: 0.8,
};

export const ALERT_MESSAGES = {
  PERMISSIONS_REQUIRED: {
    title: "Permissions Required",
    message: "Please grant camera and photo library permissions to use this feature."
  },
  SELECT_IMAGE: {
    title: "Select Image",
    message: "Choose an option"
  },
  ERROR_NAME_REQUIRED: {
    title: "Error",
    message: "Please enter an item name"
  },
  ERROR_TAKE_PHOTO: {
    title: "Error",
    message: "Failed to take photo"
  },
  ERROR_SELECT_IMAGE: {
    title: "Error", 
    message: "Failed to select image"
  },
  SUCCESS_SAVE: {
    title: "Success",
    message: "Item added successfully!"
  }
} as const;