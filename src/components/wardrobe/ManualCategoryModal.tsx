import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCategories } from '../../hooks/useCategories';
import { Category } from '../../types/category';

interface ManualCategoryModalProps {
  visible: boolean;
  failedImages: string[];
  onClose: () => void;
  onSubmit: (selections: { imageURLs: string; categoryId: number }[]) => void;
}

export const ManualCategoryModal: React.FC<ManualCategoryModalProps> = ({
  visible,
  failedImages,
  onClose,
  onSubmit,
}) => {
  const { parentCategories, childCategories, fetchParentCategories, fetchChildCategories, isLoading, isLoadingChildren } = useCategories();
  const [selections, setSelections] = useState<Record<number, number>>({});
  const [selectedParentPerImage, setSelectedParentPerImage] = useState<Record<number, number>>({});
  const [childCategoriesPerImage, setChildCategoriesPerImage] = useState<Record<number, Category[]>>({});
  
  // Fetch parent categories when modal opens
  useEffect(() => {
    if (visible) {
      fetchParentCategories();
      // Reset selections when modal opens
      setSelections({});
      setSelectedParentPerImage({});
      setChildCategoriesPerImage({});
    }
  }, [visible]);

  const handleParentSelect = async (imageIndex: number, parentId: number) => {
    // Set selected parent for this image
    setSelectedParentPerImage(prev => ({
      ...prev,
      [imageIndex]: parentId,
    }));

    // Clear child category selection for this image
    setSelections(prev => {
      const newSelections = { ...prev };
      delete newSelections[imageIndex];
      return newSelections;
    });

    // Fetch child categories for this parent
    const children = await fetchChildCategories(parentId);
    setChildCategoriesPerImage(prev => ({
      ...prev,
      [imageIndex]: children,
    }));
  };

  const handleChildCategorySelect = (imageIndex: number, categoryId: number) => {
    setSelections(prev => ({
      ...prev,
      [imageIndex]: categoryId,
    }));
  };

  const handleSubmit = () => {
    const result = failedImages.map((url, index) => ({
      imageURLs: url,
      categoryId: selections[index],
    })).filter(item => item.categoryId); // Only include items with selected category

    onSubmit(result);
  };

  const allSelected = failedImages.every((_, index) => selections[index] !== undefined);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Categories</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            These images couldn't be automatically classified. Please select a category for each item.
          </Text>

          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Loading categories...</Text>
              </View>
            ) : (
              failedImages.map((imageUrl, index) => (
                <View key={index} style={styles.imageCard}>
                  <Image source={{ uri: imageUrl }} style={styles.image} />
                  
                  {/* Parent Category Selection */}
                  <View style={styles.categorySelection}>
                    <Text style={styles.label}>Parent Category:</Text>
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      style={styles.categoryScroll}
                      contentContainerStyle={{ paddingRight: 12 }}
                    >
                      {parentCategories.map((category) => (
                        <TouchableOpacity
                          key={category.id}
                          style={[
                            styles.categoryChip,
                            selectedParentPerImage[index] === category.id && styles.categoryChipSelected,
                          ]}
                          onPress={() => handleParentSelect(index, category.id)}
                        >
                          <Text
                            style={[
                              styles.categoryChipText,
                              selectedParentPerImage[index] === category.id && styles.categoryChipTextSelected,
                            ]}
                          >
                            {category.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Child Category Selection - Only show if parent is selected */}
                  {selectedParentPerImage[index] && (
                    <View style={styles.categorySelection}>
                      <Text style={styles.label}>Item Type:</Text>
                      {isLoadingChildren ? (
                        <View style={styles.loadingChildContainer}>
                          <ActivityIndicator size="small" color="#3b82f6" />
                        </View>
                      ) : (
                        <ScrollView 
                          horizontal 
                          showsHorizontalScrollIndicator={false}
                          style={styles.categoryScroll}
                          contentContainerStyle={{ paddingRight: 12 }}
                        >
                          {(childCategoriesPerImage[index] || []).map((category) => (
                            <TouchableOpacity
                              key={category.id}
                              style={[
                                styles.categoryChip,
                                selections[index] === category.id && styles.categoryChipSelected,
                              ]}
                              onPress={() => handleChildCategorySelect(index, category.id)}
                            >
                              <Text
                                style={[
                                  styles.categoryChipText,
                                  selections[index] === category.id && styles.categoryChipTextSelected,
                                ]}
                              >
                                {category.name}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      )}
                    </View>
                  )}
                </View>
              ))
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.submitButton, !allSelected && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!allSelected}
            >
              <Text style={styles.submitButtonText}>
                Submit ({Object.keys(selections).length}/{failedImages.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    paddingHorizontal: 20,
    paddingVertical: 12,
    lineHeight: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageCard: {
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f1f5f9',
  },
  categorySelection: {
    padding: 12,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  categoryScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minWidth: 80,
    alignItems: 'center',
  },
  categoryChipSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoryChipText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: '#fff',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  loadingChildContainer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
