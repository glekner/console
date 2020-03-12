import * as React from 'react';
import { FirehoseResult } from '@console/internal/components/utils';
import { NodeKind, K8sResourceKind } from '@console/internal/module/k8s';
import { getLabels } from '@console/shared';
import { NodeModel } from '@console/internal/models';
import { getLoadedData, isLoaded, getLoadError } from '../../../../utils';
import { NodeSelectorLabel } from './types';

export const useNodeQualifier = <T extends NodeSelectorLabel>(
  labels: T[],
  nodes: FirehoseResult<K8sResourceKind[]>,
): [NodeKind[], string] => {
  const loadError = getLoadError(nodes, NodeModel);
  const loadedNodes = getLoadedData(nodes, []);
  const [qualifiedNodes, setQualifiedNodes] = React.useState([]);

  React.useEffect(() => {
    if (isLoaded(nodes)) {
      const filteredLabels = labels.filter(({ key }) => !!key);
      const newNodes = [];
      loadedNodes.forEach((node) => {
        const nodeLabels = getLabels(node);
        if (nodeLabels && filteredLabels.every(({ key, value }) => nodeLabels[key] === value)) {
          newNodes.push(node);
        }
      });
      setQualifiedNodes(newNodes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labels, loadedNodes]);

  return [qualifiedNodes, loadError];
};
