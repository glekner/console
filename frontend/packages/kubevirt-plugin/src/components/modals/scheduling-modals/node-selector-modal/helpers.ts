import { NodeSelector } from '../../../../types';
import { NodeSelectorLabel } from '../shared/types';

export const nodeSelectorToIDLabels = (nodeSelector: NodeSelector): NodeSelectorLabel[] =>
  Object.entries(nodeSelector || {}).map(([key, value], id) => ({ id, key, value }));
