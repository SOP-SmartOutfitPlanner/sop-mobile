import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/auth/useAuth";
import { useCollectionComments } from "../../hooks/useCollectionComments";
import { formatRelativeTime } from "../../utils/dateUtils";
import { COLLECTION_COLORS } from "../../constants/collectionStyles";

const FALLBACK_AVATAR = require("../../../assets/adaptive-icon.png");

interface CollectionCommentsProps {
  collectionId: number;
  initialCount: number;
  onCountChange: (count: number) => void;
}

export const CollectionComments: React.FC<CollectionCommentsProps> = ({
  collectionId,
  initialCount,
  onCountChange,
}) => {
  const { user } = useAuth();
  const {
    comments,
    loading,
    refreshing,
    loadingMore,
    canLoadMore,
    posting,
    addComment,
    editComment,
    deleteComment,
    loadMore,
  } = useCollectionComments({
    collectionId,
    initialCount,
    onCountChange,
  });
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleSubmit = async () => {
    if (!input.trim()) {
      return;
    }
    await addComment(input.trim());
    setInput("");
  };

  const handleUpdateComment = async () => {
    if (!editingId) {
      return;
    }
    if (!editingText.trim()) {
      Alert.alert("Oops", "Comment cannot be empty.");
      return;
    }
    await editComment(editingId, editingText.trim());
    setEditingId(null);
    setEditingText("");
  };

  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingText("");
  };

  const isOwnComment = (userId: number) => {
    if (!user?.id) {
      return false;
    }
    return Number(user.id) === userId;
  };

  const renderComment = (comment: typeof comments[number]) => {
    const isEditing = editingId === comment.id;
    const isOwner = isOwnComment(comment.userId);
    const avatarSource = comment.userAvatarUrl
      ? { uri: comment.userAvatarUrl }
      : null;

    return (
      <View key={comment.id} style={styles.commentCard}>
        <View style={styles.commentHeader}>
          <View style={styles.commentAuthorRow}>
            {avatarSource ? (
              <Image source={avatarSource} style={styles.commentAvatar} />
            ) : (
              <View style={styles.commentAvatarPlaceholder}>
                <Ionicons
                  name="person"
                  size={16}
                  color={COLLECTION_COLORS.text.muted}
                />
              </View>
            )}
            <View style={styles.commentAuthorInfo}>
              <Text style={styles.commentAuthor}>
                {comment.userDisplayName}
              </Text>
              <Text style={styles.commentTime}>
                {formatRelativeTime(comment.createdDate)}
              </Text>
            </View>
          </View>
          {isOwner && !isEditing && (
            <View style={styles.commentActions}>
              <TouchableOpacity
                onPress={() => startEditing(comment.id, comment.comment)}
                style={styles.commentActionButton}
              >
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={COLLECTION_COLORS.text.muted}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteComment(comment.id)}
                style={styles.commentActionButton}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color="#EF4444"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        {isEditing ? (
          <View style={styles.editRow}>
            <TextInput
              value={editingText}
              onChangeText={setEditingText}
              style={styles.editInput}
              placeholderTextColor={COLLECTION_COLORS.text.muted}
              multiline
            />
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={[styles.editButton, styles.cancelButton]}
                onPress={cancelEditing}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editButton, styles.saveButton]}
                onPress={handleUpdateComment}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={styles.commentText}>{comment.comment}</Text>
        )}
      </View>
    );
  };

  const commentList = useMemo(
    () => comments.map(renderComment),
    [comments, editingId, editingText]
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <View style={styles.inputIconContainer}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={20}
            color={COLLECTION_COLORS.accent.cyan}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Share your thoughts about this collection..."
          placeholderTextColor={COLLECTION_COLORS.text.muted}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!input.trim() || posting) && styles.sendButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={posting || !input.trim()}
          activeOpacity={0.8}
        >
          {posting ? (
            <ActivityIndicator
              size="small"
              color={COLLECTION_COLORS.text.primary}
            />
          ) : (
            <Ionicons
              name="send"
              size={18}
              color={COLLECTION_COLORS.text.primary}
            />
          )}
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={COLLECTION_COLORS.accent.cyan}
          />
        </View>
      ) : comments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="chatbubbles-outline"
            size={48}
            color={COLLECTION_COLORS.text.muted}
          />
          <Text style={styles.emptyText}>
            No comments yet. Be the first to comment!
          </Text>
        </View>
      ) : (
        <View style={styles.commentsList}>{commentList}</View>
      )}

      {canLoadMore && (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={loadMore}
          disabled={loadingMore}
          activeOpacity={0.8}
        >
          {loadingMore ? (
            <ActivityIndicator
              size="small"
              color={COLLECTION_COLORS.accent.cyan}
            />
          ) : (
            <>
              <Text style={styles.loadMoreText}>Load more</Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color={COLLECTION_COLORS.accent.cyan}
              />
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: COLLECTION_COLORS.glass.card,
    borderWidth: 1,
    borderColor: COLLECTION_COLORS.glass.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginBottom: 20,
  },
  inputIconContainer: {
    paddingBottom: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLLECTION_COLORS.text.primary,
    paddingVertical: 4,
    maxHeight: 100,
    fontWeight: "400",
  },
  sendButton: {
    backgroundColor: COLLECTION_COLORS.accent.cyan,
    borderRadius: 999,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLLECTION_COLORS.accent.cyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: COLLECTION_COLORS.glass.light,
    opacity: 0.5,
    shadowOpacity: 0,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    textAlign: "center",
    color: COLLECTION_COLORS.text.muted,
    fontSize: 14,
    fontWeight: "500",
  },
  commentsList: {
    gap: 12,
  },
  commentCard: {
    backgroundColor: COLLECTION_COLORS.glass.light,
    borderWidth: 1,
    borderColor: COLLECTION_COLORS.glass.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  commentAuthorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLLECTION_COLORS.glass.border,
  },
  commentAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLLECTION_COLORS.glass.card,
    borderWidth: 1,
    borderColor: COLLECTION_COLORS.glass.border,
    justifyContent: "center",
    alignItems: "center",
  },
  commentAuthorInfo: {
    flex: 1,
  },
  commentAuthor: {
    fontWeight: "700",
    color: COLLECTION_COLORS.text.primary,
    fontSize: 15,
    marginBottom: 2,
  },
  commentTime: {
    fontSize: 12,
    color: COLLECTION_COLORS.text.muted,
    fontWeight: "400",
  },
  commentText: {
    fontSize: 14,
    color: COLLECTION_COLORS.text.secondary,
    lineHeight: 20,
    fontWeight: "400",
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  commentActionButton: {
    padding: 6,
    borderRadius: 8,
  },
  editRow: {
    marginTop: 8,
    gap: 12,
  },
  editInput: {
    borderWidth: 1,
    borderColor: COLLECTION_COLORS.glass.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: COLLECTION_COLORS.text.primary,
    backgroundColor: COLLECTION_COLORS.glass.card,
    minHeight: 80,
    textAlignVertical: "top",
  },
  editButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  editButton: {
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: 80,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: COLLECTION_COLORS.accent.cyan,
  },
  cancelButton: {
    backgroundColor: COLLECTION_COLORS.glass.light,
    borderWidth: 1,
    borderColor: COLLECTION_COLORS.glass.border,
  },
  saveButtonText: {
    color: COLLECTION_COLORS.text.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  cancelButtonText: {
    color: COLLECTION_COLORS.text.secondary,
    fontWeight: "600",
    fontSize: 14,
  },
  loadMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: COLLECTION_COLORS.glass.border,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 16,
    backgroundColor: COLLECTION_COLORS.glass.light,
  },
  loadMoreText: {
    color: COLLECTION_COLORS.accent.cyan,
    fontWeight: "600",
    fontSize: 14,
  },
});

