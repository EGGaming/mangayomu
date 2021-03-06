import React from 'react';
import { List, Icon, ListItem, Typography, Divider, ListSection, Screen } from '@components/core';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsStackParamList } from '@navigators/Settings/Settings.interfaces';
import Reader from '@screens/Settings/screens/Reader';
import Appearance from '@screens/Settings/screens/Appearance';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';

const Main: React.FC<StackScreenProps<SettingsStackParamList, 'Main'>> = (props) => {
  const { navigation } = props;
  function navigateTo(screenName: keyof SettingsStackParamList) {
    return () => {
      navigation.navigate(screenName);
    };
  }
  return (
    <ScrollView>
      <List>
        <ListItem
          adornment={<Icon bundle='MaterialCommunityIcons' name='cog-outline' color='primary' />}
          title='General'
        />
        <Divider />
        <Appearance />
        <Divider />
        <Reader />
        <Divider />
        <ListItem adornment={<Icon bundle='Feather' name='compass' color='primary' />} title='Browse' />
        <ListItem adornment={<Icon bundle='Feather' name='code' color='primary' />} title='Advanced' />
      </List>
    </ScrollView>
  );
};

export default Main;
