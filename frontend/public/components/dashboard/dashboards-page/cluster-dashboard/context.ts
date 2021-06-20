import * as React from 'react';
import { K8sResourceKind } from '../../../../module/k8s';

export const ClusterDashboardContext = React.createContext<ClusterDashboardContextValue>({
  infrastructureLoaded: true,
  infrastructureError: null,
});

type ClusterDashboardContextValue = {
  infrastructure?: K8sResourceKind;
  infrastructureLoaded: boolean;
  infrastructureError: any;
};
