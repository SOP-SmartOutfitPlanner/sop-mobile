import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CollectionScreen from "../screens/CollectionScreen";
import { CollectionDetailScreen } from "../screens/CollectionDetailScreen";
import { CreateCollectionScreen } from "../screens/CreateCollectionScreen";
import UserCollectionsScreen from "../screens/UserCollectionsScreen";

export type CollectionStackParamList = {
  CollectionMain: undefined;
  CollectionDetail: { collectionId: number };
  CreateCollection: undefined;
  EditCollection: { collectionId: number };
  UserCollections: { userId: number; userName?: string };
};

const Stack = createStackNavigator<CollectionStackParamList>();

export const CollectionStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CollectionMain" component={CollectionScreen} />
      <Stack.Screen
        name="CollectionDetail"
        component={CollectionDetailScreen}
      />
      <Stack.Screen
        name="CreateCollection"
        component={CreateCollectionScreen}
      />
      <Stack.Screen name="EditCollection" component={CreateCollectionScreen} />
      <Stack.Screen
        name="UserCollections"
        component={UserCollectionsScreen}
      />
    </Stack.Navigator>
  );
};

