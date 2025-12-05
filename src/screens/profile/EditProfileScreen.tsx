import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AnimatedBackground from "../../components/common/AnimatedBackground";
import { useAuth } from "../../hooks/auth";
import { useOnboarding } from "../../hooks/onboarding";
import { Job } from "../../types/job";
import { Style as StyleOption } from "../../types/style";

export const EditProfileScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const { user } = useAuth();
  const {
    jobs,
    styles: styleOptions,
    fetchJobs,
    fetchStyles,
    isLoading,
  } = useOnboarding();

  const [displayName] = useState(user?.displayName ?? "");
  const [email] = useState(user?.email ?? "");
  const [location, setLocation] = useState(user?.location ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [jobId, setJobId] = useState<number | undefined>(
    user?.jobId ?? undefined
  );
  const [selectedStyleIds, setSelectedStyleIds] = useState<number[]>(
    user?.userStyles?.map((s) => s.styleId) ?? []
  );
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Prefetch jobs and styles for selectors
    fetchJobs().catch(() => {});
    fetchStyles().catch(() => {});
  }, []);

  const toggleStyle = (style: StyleOption) => {
    setSelectedStyleIds((prev) => {
      if (prev.includes(style.id)) {
        return prev.filter((id) => id !== style.id);
      }
      return [...prev, style.id];
    });
    setDirty(true);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // TODO: call real update profile API when backend is ready
      // For now just simulate success and go back
      console.log("EditProfile payload:", {
        location,
        bio,
        jobId,
        selectedStyleIds,
      });
      Alert.alert("Profile updated", "Your profile changes have been saved.");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        "Update failed",
        error?.message || "Unable to update profile right now."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedBackground>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Basic info */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Basic information</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Display name</Text>
              <TextInput
                value={displayName}
                editable={false}
                style={[styles.input, styles.inputDisabled]}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                editable={false}
                style={[styles.input, styles.inputDisabled]}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                value={location ?? ""}
                onChangeText={(text) => {
                  setLocation(text);
                  setDirty(true);
                }}
                placeholder="City, Country"
                placeholderTextColor="#64748B"
                autoCapitalize="words"
                style={styles.input}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                value={bio ?? ""}
                onChangeText={(text) => {
                  setBio(text);
                  setDirty(true);
                }}
                placeholder="Tell us about yourself..."
                placeholderTextColor="#64748B"
                style={[styles.input, styles.textarea]}
                multiline
                maxLength={500}
                autoCapitalize="sentences"
              />
              <Text style={styles.helperText}>
                {`${(bio ?? "").length}/500 characters`}
              </Text>
            </View>
          </View>

          {/* Job */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Occupation</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Job</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                {(jobs as Job[]).map((job) => {
                  const isActive = jobId === job.id;
                  return (
                    <TouchableOpacity
                      key={job.id}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => setJobId(job.id)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isActive && styles.chipTextActive,
                        ]}
                      >
                        {job.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                {isLoading && (
                  <ActivityIndicator size="small" color="#38BDF8" />
                )}
              </ScrollView>
              <Text style={styles.helperText}>
                Let others know what you do to better understand your style.
              </Text>
            </View>
          </View>

          {/* Styles */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Style preferences</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Styles you like</Text>
              <View style={styles.chipWrap}>
                {(styleOptions as StyleOption[]).map((style) => {
                  const isActive = selectedStyleIds.includes(style.id);
                  return (
                    <TouchableOpacity
                      key={style.id}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => toggleStyle(style)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isActive && styles.chipTextActive,
                        ]}
                      >
                        {style.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                {isLoading && styleOptions.length === 0 && (
                  <ActivityIndicator size="small" color="#38BDF8" />
                )}
              </View>
            </View>
          </View>

          {/* Save button */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!dirty || saving) && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!dirty || saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#0F172A" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={18} color="#0F172A" />
                <Text style={styles.saveButtonText}>Save changes</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </AnimatedBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 36,
    paddingBottom: 14,
  },
  headerBackButton: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#E5E7EB",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.6)",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E5E7EB",
    marginBottom: 12,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#CBD5F5",
    marginBottom: 6,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#E5E7EB",
    backgroundColor: "rgba(15,23,42,0.9)",
  },
  inputDisabled: {
    color: "#9CA3AF",
    backgroundColor: "rgba(15,23,42,0.6)",
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  helperText: {
    marginTop: 4,
    fontSize: 12,
    color: "#9CA3AF",
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.7)",
    backgroundColor: "rgba(15,23,42,0.7)",
  },
  chipActive: {
    backgroundColor: "#22D3EE",
    borderColor: "#22D3EE",
  },
  chipText: {
    fontSize: 12,
    color: "#E5E7EB",
    fontWeight: "500",
  },
  chipTextActive: {
    color: "#0F172A",
    fontWeight: "700",
  },
  saveButton: {
    marginTop: 8,
    borderRadius: 999,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#22D3EE",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
});

export default EditProfileScreen;
