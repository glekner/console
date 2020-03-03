import * as React from 'react';
import * as _ from 'lodash';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { Popover, PopoverPosition, Text, TextVariants, Button } from '@patternfly/react-core';
import {
  LoadingInline,
  ResourceLink,
  ExternalLink,
  resourcePath,
} from '@console/internal/components/utils';
import { NodeKind } from '@console/internal/module/k8s';

import { getName } from '@console/shared';

export const NodeSelectorSummary: React.FC<NodeSelectorSummaryProps> = ({
  qualifiedNodes,
  isLoading,
}) => {
  const size = _.size(qualifiedNodes);
  const buttonText = size === 1 ? '1 Node' : `${_.size(qualifiedNodes)} Nodes`;
  const icon = size > 0 ? <CheckCircleIcon /> : <ExclamationCircleIcon />;
  return (
    <div className="kubevirt-node-selector__summary-container">
      <Popover
        headerContent={<div>{size} Nodes found</div>}
        position={PopoverPosition.right}
        className="kubevirt-node-selector__summary-popover"
        bodyContent={qualifiedNodes.map((node) => (
          <ExternalLink
            key={getName(node)}
            href={resourcePath('Node', getName(node))}
            text={<ResourceLink linkTo={false} kind="Node" name={getName(node)} />}
          />
        ))}
      >
        <div className="kubevirt-node-selector__summary-node-checker">
          {isLoading ? (
            <LoadingInline />
          ) : (
            <Button
              className="kubevirt-node-selector__summary-popover-btn"
              isDisabled={isLoading || size === 0}
              variant="link"
              icon={icon}
            >
              <Text component={TextVariants.h4}>{buttonText}</Text>
            </Button>
          )}
        </div>
      </Popover>
      <Text component={TextVariants.h4}>
        {isLoading ? ' Searching for Nodes' : ' qualify for this node selector'}
      </Text>
    </div>
  );
};

type NodeSelectorSummaryProps = {
  qualifiedNodes: NodeKind[];
  isLoading: boolean;
};
