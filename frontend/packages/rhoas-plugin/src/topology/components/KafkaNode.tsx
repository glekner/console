import * as React from 'react';
import {
  observer,
  Node,
  useDndDrop,
  WithContextMenuProps,
  WithCreateConnectorProps,
  WithDragNodeProps,
  WithSelectionProps,
} from '@patternfly/react-topology';
import { connect } from 'react-redux';
import { referenceForModel } from '@console/internal/module/k8s';
import { RootState } from '@console/internal/redux';
import { calculateRadius } from '@console/shared';
import { getServiceBindingStatus } from '@console/topology/src/utils';
import { kafkaIcon } from '../../const';
import { KafkaConnectionModel } from '../../models';
import { obsOrKafkaConnectionDropTargetSpec } from './rhoasComponentUtils';
import TrapezoidBaseNode from './TrapezoidBaseNode';

import './KafkaNode.scss';

interface StateProps {
  serviceBinding: boolean;
}

type KafkaNodeProps = {
  element: Node;
  tooltipLabel?: string;
} & WithSelectionProps &
  WithDragNodeProps &
  WithContextMenuProps &
  WithCreateConnectorProps &
  StateProps;

const KafkaNode: React.FC<KafkaNodeProps> = ({
  element,
  selected,
  onSelect,
  serviceBinding,
  tooltipLabel,
  ...props
}) => {
  const { width, height } = element.getBounds();
  const size = Math.min(width, height);
  const iconRadius = Math.min(width, height) * 0.25;
  const { radius } = calculateRadius(size);
  const spec = React.useMemo(
    () => obsOrKafkaConnectionDropTargetSpec(serviceBinding),
    [serviceBinding],
  );
  const [dndDropProps, dndDropRef] = useDndDrop(spec, { element, ...props });

  return (
    <TrapezoidBaseNode
      className="KafkaNode"
      tooltipLabel={tooltipLabel}
      onSelect={onSelect}
      icon={kafkaIcon}
      innerRadius={iconRadius}
      selected={selected}
      kind={referenceForModel(KafkaConnectionModel)}
      element={element}
      outerRadius={radius}
      {...props}
      dndDropRef={dndDropRef}
      {...dndDropProps}
    />
  );
};

const mapStateToProps = (state: RootState): StateProps => {
  return {
    serviceBinding: getServiceBindingStatus(state),
  };
};

export default connect(mapStateToProps)(observer(KafkaNode));
