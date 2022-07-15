import { ListItem } from '@components/core';
import React from 'react';
import { ItemDropdownProps } from './ItemDropdown.interfaces';

const ItemDropdown: React.FC<ItemDropdownProps> = (props) => {
  const { title, subtitle, items, icon, paper = false } = props;
  return <ListItem title={title} subtitle={subtitle} adornment={icon} holdItem={items} paper={paper} />;
};

export default React.memo(ItemDropdown);