import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Item } from '../../../types/item';
import { GetItems } from '../../../services/endpoint/wardorbe';
import { getUserId } from '../../../services/api/apiClient';

interface AnalysisPromptModalProps {
  visible: boolean;
  itemIds: number[];
  onAnalyze: (selectedItemIds: number[]) => Promise<void>;
  onSkip: () => void;
  isAnalyzing?: boolean;
}

export const AnalysisPromptModal: React.FC<AnalysisPromptModalProps> = ({
  visible,
  itemIds,
  onAnalyze,
  onSkip,
  isAnalyzing = false,
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(new Set());
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  // Fetch items when modal opens
  useEffect(() => {
    if (visible && itemIds.length > 0) {
      fetchItems();
    }
  }, [visible, itemIds]);

  // Initialize selection when items are loaded
  useEffect(() => {
    if (items.length > 0 && selectedItemIds.size === 0) {
      // Select all items by default
      setSelectedItemIds(new Set(items.map(item => item.id)));
    }
  }, [items, selectedItemIds.size]);

  // Reset selection when modal closes
  useEffect(() => {
    if (!visible) {
      setSelectedItemIds(new Set());
      setItems([]);
    }
  }, [visible]);

  const fetchItems = async () => {
    setIsLoadingItems(true);
    try {
      const userId = await getUserId();
      if (!userId) {
        console.error('User not found');
        return;
      }

      // Fetch all items and filter by itemIds
      const response = await GetItems({
        userId: parseInt(userId),
        pageIndex: 1,
        pageSize: 100,
        takeAll: true,
      });

      if (response.data && response.data.data) {
        // Filter items that match the uploaded itemIds
        const filteredItems = response.data.data.filter(item => 
          itemIds.includes(item.id)
        );
        setItems(filteredItems);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setIsLoadingItems(false);
    }
  };

  const toggleItemSelection = (itemId: number) => {
    setSelectedItemIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItemIds.size === items.length) {
      // Deselect all
      setSelectedItemIds(new Set());
    } else {
      // Select all
      setSelectedItemIds(new Set(items.map(item => item.id)));
    }
  };

  const handleAnalyze = async () => {
    const idsToAnalyze = Array.from(selectedItemIds);
    if (idsToAnalyze.length === 0) {
      return;
    }
    try {
      await onAnalyze(idsToAnalyze);
    } catch (error) {
      console.error('Error analyzing items:', error);
    }
  };

  const selectedCount = selectedItemIds.size;
  const totalCount = items.length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>AI Analysis</Text>
            <Text style={styles.subtitle}>
              Select items to analyze with AI for detailed attributes
            </Text>
          </View>
          <TouchableOpacity onPress={onSkip} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#e2e8f0" />
          </TouchableOpacity>
        </View>

        {/* Selection Status Bar */}
        <View style={styles.statusBar}>
          <View style={styles.statusLeft}>
            <Ionicons name="star" size={18} color="#f59e0b" />
            <Text style={styles.statusText}>
              {selectedCount} of {totalCount} items selected
            </Text>
          </View>
          {totalCount > 0 && (
            <TouchableOpacity onPress={toggleSelectAll} style={styles.deselectButton}>
              <Text style={styles.deselectButtonText}>
                {selectedCount === totalCount ? 'Deselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Items Grid */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        >
          {isLoadingItems ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#38bdf8" />
              <Text style={styles.loadingText}>Loading items...</Text>
            </View>
          ) : items.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="images-outline" size={48} color="#64748b" />
              <Text style={styles.emptyText}>No items found</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {items.map((item) => {
                const isSelected = selectedItemIds.has(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.itemCard,
                      isSelected && styles.itemCardSelected,
                    ]}
                    onPress={() => toggleItemSelection(item.id)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: item.imgUrl }}
                      style={styles.itemImage}
                      resizeMode="cover"
                    />
                    {isSelected && (
                      <View style={styles.checkmarkContainer}>
                        <View style={styles.checkmark}>
                          <Ionicons name="checkmark" size={16} color="#fff" />
                        </View>
                      </View>
                    )}
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemLabel} numberOfLines={1}>
                        Sop Item
                      </Text>
                      <Text style={styles.itemCategory} numberOfLines={1}>
                        {item.categoryName || 'Unknown'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={onSkip}
            disabled={isAnalyzing}
          >
            <Text style={styles.skipButtonText}>Skip Analysis</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.analyzeButton,
              (selectedCount === 0 || isAnalyzing) && styles.analyzeButtonDisabled,
            ]}
            onPress={handleAnalyze}
            disabled={selectedCount === 0 || isAnalyzing}
          >
            {isAnalyzing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="flash" size={18} color="#fff" />
                <Text style={styles.analyzeButtonText}>
                  Run AI Analysis ({selectedCount})
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Loading Overlay */}
        {isAnalyzing && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingModal}>
              <ActivityIndicator size="large" color="#38bdf8" />
              <Text style={styles.loadingModalTitle}>Analyzing Items</Text>
              <Text style={styles.loadingModalText}>
                AI is analyzing {selectedCount} item{selectedCount > 1 ? 's' : ''}...
              </Text>
              <Text style={styles.loadingModalSubtext}>
                This may take a moment
              </Text>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040816',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#cbd5f5',
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#e2e8f0',
    fontWeight: '600',
  },
  deselectButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deselectButtonText: {
    fontSize: 13,
    color: '#38bdf8',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  itemCard: {
    width: '47%',
    aspectRatio: 0.75,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  itemCardSelected: {
    borderColor: '#38bdf8',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  itemImage: {
    width: '100%',
    height: '70%',
    backgroundColor: '#11173a',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#38bdf8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  itemInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 12,
    color: '#cbd5f5',
    fontWeight: '600',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 11,
    color: '#94a3b8',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: '#040816',
  },
  skipButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    color: '#cbd5f5',
    fontSize: 15,
    fontWeight: '600',
  },
  analyzeButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#38bdf8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  analyzeButtonDisabled: {
    opacity: 0.5,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: '#cbd5f5',
    fontSize: 14,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 12,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(4, 8, 22, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingModal: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    minWidth: 280,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  loadingModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: 20,
    marginBottom: 8,
  },
  loadingModalText: {
    fontSize: 14,
    color: '#cbd5f5',
    textAlign: 'center',
    marginBottom: 4,
  },
  loadingModalSubtext: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
