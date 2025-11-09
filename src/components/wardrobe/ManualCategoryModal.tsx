import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCategories } from '../../hooks/useCategories';
import { Category } from '../../types/category';
import { FailedItem } from '../../types/image';

interface ManualCategoryModalProps {
  visible: boolean;
  failedImages: FailedItem[];
  onClose: () => void;
  onSubmit: (selections: { imageURLs: string; categoryId: number }[]) => void;
}

export const ManualCategoryModal: React.FC<ManualCategoryModalProps> = ({
  visible,
  failedImages,
  onClose,
  onSubmit,
}) => {
  const { parentCategories, fetchParentCategories, fetchChildCategories, isLoading, isLoadingChildren } = useCategories();
  const [selections, setSelections] = useState<Record<number, number>>({});
  const [selectedParentPerImage, setSelectedParentPerImage] = useState<Record<number, number>>({});
  const [childCategoriesPerImage, setChildCategoriesPerImage] = useState<Record<number, Category[]>>({});
  
  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      fetchParentCategories();
      setSelections({});
      setSelectedParentPerImage({});
      setChildCategoriesPerImage({});
    }
  }, [visible, fetchParentCategories]);

  // Memoized handler for parent category selection
  const handleParentSelect = useCallback(async (imageIndex: number, parentId: number) => {
    setSelectedParentPerImage(prev => ({
      ...prev,
      [imageIndex]: parentId,
    }));

    setSelections(prev => {
      const newSelections = { ...prev };
      delete newSelections[imageIndex];
      return newSelections;
    });

    const children = await fetchChildCategories(parentId);
    setChildCategoriesPerImage(prev => ({
      ...prev,
      [imageIndex]: children,
    }));
  }, [fetchChildCategories]);

  // Memoized handler for child category selection
  const handleChildCategorySelect = useCallback((imageIndex: number, categoryId: number) => {
    setSelections(prev => ({
      ...prev,
      [imageIndex]: categoryId,
    }));
  }, []);

  // Memoized submit handler
  const handleSubmit = useCallback(() => {
    const result = failedImages
      .map((item, index) => ({
        imageURLs: item.imageUrl,
        categoryId: selections[index],
      }))
      .filter(item => item.categoryId);

    onSubmit(result);
  }, [failedImages, selections, onSubmit]);

  // Memoized calculation for submit button state
  const allSelected = useMemo(() => 
    failedImages.every((_, index) => selections[index] !== undefined),
    [failedImages, selections]
  );

  // Memoized selection count
  const selectionCount = useMemo(() => 
    Object.keys(selections).length,
    [selections]
  );

  // Render category chip
  const renderCategoryChip = useCallback((
    category: Category,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity
      key={category.id}
      style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  ), []);

  // Render image card
  const renderImageCard = useCallback((failedItem: FailedItem, index: number) => {
    const selectedParent = selectedParentPerImage[index];
    const selectedChild = selections[index];
    const childCategories = childCategoriesPerImage[index] || [];

    return (
      <View key={index} style={styles.imageCard}>
        <Image source={{ uri: failedItem.imageUrl }} style={styles.image} />
        
        {/* Error Reason Badge */}
        {failedItem.reason && (
          <View style={styles.reasonBadge}>
            <Ionicons name="alert-circle" size={14} color="#ef4444" />
            <Text style={styles.reasonText}>{failedItem.reason}</Text>
          </View>
        )}
        
        {/* Parent Category Selection */}
        <View style={styles.categorySelection}>
          <Text style={styles.label}>Parent Category:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.scrollContent}
          >
            {parentCategories.map((category) => 
              renderCategoryChip(
                category,
                selectedParent === category.id,
                () => handleParentSelect(index, category.id)
              )
            )}
          </ScrollView>
        </View>

        {/* Child Category Selection */}
        {selectedParent && (
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
                contentContainerStyle={styles.scrollContent}
              >
                {childCategories.map((category) =>
                  renderCategoryChip(
                    category,
                    selectedChild === category.id,
                    () => handleChildCategorySelect(index, category.id)
                  )
                )}
              </ScrollView>
            )}
          </View>
        )}
      </View>
    );
  }, [
    selectedParentPerImage,
    selections,
    childCategoriesPerImage,
    parentCategories,
    isLoadingChildren,
    renderCategoryChip,
    handleParentSelect,
    handleChildCategorySelect,
  ]);

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
            contentContainerStyle={styles.contentContainer}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Loading categories...</Text>
              </View>
            ) : (
              failedImages.map(renderImageCard)
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.submitButton, !allSelected && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!allSelected}
            >
              <Text style={styles.submitButtonText}>
                Submit ({selectionCount}/{failedImages.length})
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
  contentContainer: {
    paddingBottom: 20,
  },
  imageCard: {
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f1f5f9',
  },
  reasonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fef2f2',
    borderBottomWidth: 1,
    borderBottomColor: '#fee2e2',
  },
  reasonText: {
    fontSize: 13,
    color: '#ef4444',
    flex: 1,
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
  scrollContent: {
    paddingRight: 12,
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
