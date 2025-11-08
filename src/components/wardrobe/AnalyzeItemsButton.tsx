import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Item } from '../../types/item';
import { AnalyzeItems } from '../../services/endpoint/upload';

interface AnalyzeItemsButtonProps {
  items: Item[];
  onAnalysisComplete: () => void;
}

export const AnalyzeItemsButton: React.FC<AnalyzeItemsButtonProps> = ({ items, onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Get items that need analysis (isAnalyzed = false)
  const itemsNeedingAnalysis = items.filter(item => !item.isAnalyzed);

  if (itemsNeedingAnalysis.length === 0) {
    return null;
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setShowModal(true);

    try {
      const itemIds = itemsNeedingAnalysis.map(item => item.id);
      const response = await AnalyzeItems(itemIds);

      if (response.statusCode === 200) {
        // Wait a bit to show success message
        setTimeout(() => {
          setShowModal(false);
          setIsAnalyzing(false);
          onAnalysisComplete();
        }, 1500);
      }
    } catch (error) {
      console.error('Error analyzing items:', error);
      setIsAnalyzing(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Ionicons name="analytics-outline" size={20} color="#f59e0b" />
          <Text style={styles.infoText}>
            {itemsNeedingAnalysis.length} item{itemsNeedingAnalysis.length > 1 ? 's' : ''} need{itemsNeedingAnalysis.length === 1 ? 's' : ''} analysis
          </Text>
        </View>
        <TouchableOpacity
          style={styles.analyzeButton}
          onPress={handleAnalyze}
          disabled={isAnalyzing}
        >
          <Ionicons name="flash" size={18} color="#fff" />
          <Text style={styles.analyzeButtonText}>Analyze Now</Text>
        </TouchableOpacity>
      </View>

      {/* Analysis Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#f59e0b" />
            <Text style={styles.modalText}>
              Analyzing {itemsNeedingAnalysis.length} item{itemsNeedingAnalysis.length > 1 ? 's' : ''}...
            </Text>
            <Text style={styles.modalSubtext}>
              This may take a moment
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fcd34d',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: '#92400e',
    marginLeft: 8,
    fontWeight: '500',
  },
  analyzeButton: {
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    minWidth: 250,
  },
  modalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 16,
    textAlign: 'center',
  },
  modalSubtext: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
});
