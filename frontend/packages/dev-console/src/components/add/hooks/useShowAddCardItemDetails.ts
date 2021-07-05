import * as React from 'react';
import { useUserSettings } from '@console/dynamic-plugin-sdk';

export const useShowAddCardItemDetails = (): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
] => {
  const [showDetails, setShowDetails, showDetailsLoaded] = useUserSettings(
    'devconsole.addPage.showDetails',
    true,
    true,
  );
  return [showDetailsLoaded && showDetails, setShowDetails];
};
