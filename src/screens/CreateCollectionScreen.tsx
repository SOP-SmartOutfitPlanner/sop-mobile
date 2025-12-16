import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useCreateCollection, useUpdateCollection, useCollectionDetail } from "../hooks/useCollections";
import { useOutfits } from "../hooks/outfit/useOutfits";
import { Outfit } from "../types/outfit";
import { useAuth } from "../hooks/auth/useAuth";
import { CollectionStackParamList } from "../navigation/CollectionStackNavigator";

const FALLBACK_IMAGE = require("../../assets/adaptive-icon.png");

interface SelectedOutfit {
  outfitId: number;
  description: string;
}

type CreateCollectionRoute = RouteProp<CollectionStackParamList, "CreateCollection">;
type EditCollectionRoute = RouteProp<CollectionStackParamList, "EditCollection">;

export const CreateCollectionScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  
  // Get collectionId from route params (only EditCollection has it)
  const collectionId = (route.params as any)?.collectionId;
  const isEditMode = !!collectionId;
  
  const { user } = useAuth();
  const { createCollection, loading: createLoading } = useCreateCollection();
  const { updateCollection, loading: updateLoading } = useUpdateCollection();
  const { collection: existingCollection, loading: fetchLoading } = useCollectionDetail(collectionId || 0);
  const { outfits, fetchOutfits } = useOutfits();
  
  const loading = createLoading || updateLoading || fetchLoading;

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  const [selectedOutfits, setSelectedOutfits] = useState<
    Map<number, SelectedOutfit>
  >(new Map());
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch outfits
  useEffect(() => {
    fetchOutfits({ takeAll: true });
  }, [fetchOutfits]);

  // Initialize form with existing collection data in edit mode
  useEffect(() => {
    if (isEditMode && existingCollection) {
      setTitle(existingCollection.title);
      setShortDescription(existingCollection.shortDescription || "");
      
      if (existingCollection.thumbnailURL) {
        setThumbnailUri(existingCollection.thumbnailURL);
      }

      // Initialize selected outfits from collection
      const outfitsMap = new Map<number, SelectedOutfit>();
      existingCollection.outfits?.forEach((entry) => {
        if (entry.outfit) {
          const outfitId = entry.outfit.outfitId || entry.outfit.id;
          if (outfitId) {
            outfitsMap.set(outfitId, {
              outfitId,
              description: entry.description || "",
            });
          }
        }
      });
      setSelectedOutfits(outfitsMap);
    }
  }, [isEditMode, existingCollection]);

  const filteredOutfits = useMemo(() => {
    if (!searchQuery.trim()) return outfits;
    const query = searchQuery.toLowerCase();
    return outfits.filter(
      (outfit) =>
        outfit.name.toLowerCase().includes(query) ||
        outfit.description?.toLowerCase().includes(query)
    );
  }, [outfits, searchQuery]);

  const handlePickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera roll permissions");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setThumbnailUri(result.assets[0].uri);
    }
  }, []);

  const handleOutfitToggle = useCallback((outfit: Outfit) => {
    setSelectedOutfits((prev) => {
      const newSelected = new Map(prev);
      if (newSelected.has(outfit.id)) {
        newSelected.delete(outfit.id);
      } else {
        newSelected.set(outfit.id, {
          outfitId: outfit.id,
          description: outfit.description || "",
        });
      }
      return newSelected;
    });
  }, []);

  const handleOutfitDescriptionChange = useCallback(
    (outfitId: number, description: string) => {
      setSelectedOutfits((prev) => {
        const newSelected = new Map(prev);
        const existing = newSelected.get(outfitId);
        if (existing) {
          newSelected.set(outfitId, { ...existing, description });
        }
        return newSelected;
      });
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    if (!title.trim()) {
      Alert.alert("Validation Error", "Title is required");
      return;
    }

    // Thumbnail is only required for create, not edit (if already exists)
    if (!isEditMode && !thumbnailUri) {
      Alert.alert("Validation Error", "Thumbnail image is required");
      return;
    }
    
    // In edit mode, need either existing thumbnail or new one
    if (isEditMode && !thumbnailUri && !existingCollection?.thumbnailURL) {
      Alert.alert("Validation Error", "Thumbnail image is required");
      return;
    }

    if (selectedOutfits.size === 0) {
      Alert.alert("Validation Error", "Please select at least one outfit");
      return;
    }

    if (!user?.id) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("Title", title.trim());
      formData.append("ShortDescription", shortDescription.trim() || "");

      // Handle thumbnail: API requires ThumbnailImg field even when updating
      const getThumbnailFile = (uri: string) => {
        const filename = uri.split("/").pop() || "thumbnail.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";
        return {
          uri,
          type,
          name: filename,
        };
      };

      let thumbnailToAppend: any = null;

      if (isEditMode) {
        if (thumbnailUri && thumbnailUri !== existingCollection?.thumbnailURL) {
          thumbnailToAppend = getThumbnailFile(thumbnailUri);
        } else if (existingCollection?.thumbnailURL) {
          thumbnailToAppend = getThumbnailFile(existingCollection.thumbnailURL);
        }
      } else if (thumbnailUri) {
        thumbnailToAppend = getThumbnailFile(thumbnailUri);
      }

      if (!thumbnailToAppend) {
        const errorMsg = isEditMode
          ? "Thumbnail is required. Please select an image or ensure the collection has an existing thumbnail."
          : "Thumbnail image is required";
        Alert.alert("Validation Error", errorMsg);
        return;
      }

      formData.append("ThumbnailImg", thumbnailToAppend as any);

      // Append outfits
      Array.from(selectedOutfits.values()).forEach((outfit, index) => {
        formData.append(`Outfits[${index}].OutfitId`, outfit.outfitId.toString());
        formData.append(
          `Outfits[${index}].Description`,
          outfit.description || ""
        );
      });

      const collection = isEditMode && collectionId
        ? await updateCollection(collectionId, formData)
        : await createCollection(formData);

      Alert.alert(
        "Success",
        isEditMode ? "Collection updated successfully" : "Collection created successfully",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        (err?.response?.status
          ? `Request failed with status ${err.response.status}`
          : isEditMode
          ? "Failed to update collection"
          : "Failed to create collection");

      Alert.alert("Error", errorMessage);
    }
  }, [
    title,
    shortDescription,
    thumbnailUri,
    selectedOutfits,
    user?.id,
    createCollection,
    updateCollection,
    isEditMode,
    collectionId,
    existingCollection,
    navigation,
  ]);

  const validation = useMemo(
    () => ({
      title: title.trim().length === 0 ? "Title is required" : null,
      thumbnail: !thumbnailUri && !existingCollection?.thumbnailURL
        ? "Thumbnail image is required"
        : null,
      outfits:
        selectedOutfits.size === 0
          ? "Please select at least one outfit"
          : null,
    }),
    [title, thumbnailUri, selectedOutfits.size, existingCollection?.thumbnailURL]
  );

  const isFormValid =
    title.trim().length > 0 &&
    (thumbnailUri || existingCollection?.thumbnailURL) &&
    selectedOutfits.size > 0;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? "Edit Collection" : "Create Collection"}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Title <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                validation.title && styles.inputError,
              ]}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter collection title"
              placeholderTextColor="#94A3B8"
            />
            {validation.title && (
              <Text style={styles.errorText}>{validation.title}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Short Description (Optional)</Text>
            <TextInput
              style={styles.textArea}
              value={shortDescription}
              onChangeText={setShortDescription}
              placeholder="Describe your collection..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              maxLength={200}
            />
            <Text style={styles.charCount}>
              {shortDescription.length}/200 characters
            </Text>
          </View>
        </View>

        {/* Thumbnail Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Thumbnail Image <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={handlePickImage}
            activeOpacity={0.8}
          >
            {thumbnailUri ? (
              <View style={styles.imagePreview}>
                <Image
                  source={{ uri: thumbnailUri }}
                  style={styles.previewImage}
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setThumbnailUri(null)}
                >
                  <Ionicons name="close-circle" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={48} color="#94A3B8" />
                <Text style={styles.imagePlaceholderText}>
                  Tap to select image
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {validation.thumbnail && (
            <Text style={styles.errorText}>{validation.thumbnail}</Text>
          )}
        </View>

        {/* Select Outfits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Select Outfits <Text style={styles.required}>*</Text>
          </Text>

          <View style={styles.searchContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color="#94A3B8"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search outfits..."
              placeholderTextColor="#94A3B8"
            />
          </View>

          {selectedOutfits.size > 0 && (
            <View style={styles.selectedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.selectedText}>
                {selectedOutfits.size} outfit{selectedOutfits.size > 1 ? "s" : ""} selected
              </Text>
            </View>
          )}

          {validation.outfits && (
            <Text style={styles.errorText}>{validation.outfits}</Text>
          )}

          <View style={styles.outfitsList}>
            {filteredOutfits.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="shirt-outline" size={48} color="#94A3B8" />
                <Text style={styles.emptyText}>No outfits available</Text>
              </View>
            ) : (
              filteredOutfits.map((outfit) => {
                const isSelected = selectedOutfits.has(outfit.id);
                const selectedData = selectedOutfits.get(outfit.id);

                return (
                  <TouchableOpacity
                    key={outfit.id}
                    style={[
                      styles.outfitCard,
                      isSelected && styles.outfitCardSelected,
                    ]}
                    onPress={() => handleOutfitToggle(outfit)}
                    activeOpacity={0.7}
                  >
                    {isSelected && (
                      <View style={styles.selectedIndicator}>
                        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                      </View>
                    )}

                    <View style={styles.outfitContent}>
                      <View style={styles.outfitImageContainer}>
                        {outfit.items && outfit.items.length > 0 && outfit.items[0].imgUrl ? (
                          <Image
                            source={{ uri: outfit.items[0].imgUrl }}
                            style={styles.outfitImage}
                          />
                        ) : (
                          <View style={styles.outfitImagePlaceholder}>
                            <Ionicons name="shirt-outline" size={24} color="#94A3B8" />
                          </View>
                        )}
                      </View>

                      <View style={styles.outfitInfo}>
                        <Text style={styles.outfitName}>{outfit.name}</Text>
                        {outfit.description && (
                          <Text style={styles.outfitDescription} numberOfLines={2}>
                            {outfit.description}
                          </Text>
                        )}
                        {outfit.items && outfit.items.length > 0 && (
                          <Text style={styles.outfitItemCount}>
                            {outfit.items.length} items
                          </Text>
                        )}
                      </View>
                    </View>

                    {isSelected && (
                      <View style={styles.outfitDescriptionInput}>
                        <Text style={styles.outfitDescriptionLabel}>
                          Outfit Description (Optional)
                        </Text>
                        <TextInput
                          style={styles.outfitDescriptionTextInput}
                          value={selectedData?.description || ""}
                          onChangeText={(text) =>
                            handleOutfitDescriptionChange(outfit.id, text)
                          }
                          placeholder="Add a description for this outfit..."
                          placeholderTextColor="#94A3B8"
                          multiline
                          numberOfLines={2}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!isFormValid || loading) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons
                name={isEditMode ? "checkmark-circle-outline" : "add-circle-outline"}
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.submitButtonText}>
                {isEditMode ? "Update Collection" : "Create Collection"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  required: {
    color: "#F87171",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E2E8F0",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  inputError: {
    borderColor: "#F87171",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    minHeight: 80,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    textAlign: "right",
  },
  errorText: {
    fontSize: 12,
    color: "#F87171",
    marginTop: 4,
  },
  imagePicker: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(6, 182, 212, 0.4)",
    borderStyle: "dashed",
  },
  imagePreview: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: "#64748B",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#FFFFFF",
  },
  selectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.4)",
  },
  selectedText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#34D399",
  },
  outfitsList: {
    gap: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
  },
  outfitCard: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  outfitCardSelected: {
    borderColor: "#10B981",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  selectedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },
  outfitContent: {
    flexDirection: "row",
    gap: 12,
  },
  outfitImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  outfitImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  outfitImagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  outfitInfo: {
    flex: 1,
    justifyContent: "center",
  },
  outfitName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  outfitDescription: {
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 4,
  },
  outfitItemCount: {
    fontSize: 12,
    color: "#64748B",
  },
  outfitDescriptionInput: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  outfitDescriptionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
    marginBottom: 8,
  },
  outfitDescriptionTextInput: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    minHeight: 60,
    textAlignVertical: "top",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#1E293B",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#06B6D4",
    borderRadius: 12,
    paddingVertical: 16,
  },
  submitButtonDisabled: {
    backgroundColor: "#475569",
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

