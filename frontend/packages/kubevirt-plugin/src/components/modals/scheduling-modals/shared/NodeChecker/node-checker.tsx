import * as React from 'react';
import {
  Alert,
  Popover,
  PopoverPosition,
  Text,
  TextVariants,
  Button,
} from '@patternfly/react-core';
import {
  ResourceLink,
  ExternalLink,
  resourcePath,
  pluralize,
} from '@console/internal/components/utils';
import { NodeKind } from '@console/internal/module/k8s';
import { getName } from '@console/shared';
import './node-checker.scss';

export const NodeChecker: React.FC<NodeCheckerProps> = ({ qualifiedNodes }) => {
  const size = qualifiedNodes.length;
  const buttonText = pluralize(size, 'Node');
  return (
    <Alert
      className="kv-node-checker"
      variant={size > 0 ? 'success' : 'warning'}
      isInline
      title={
        size > 0
          ? 'Nodes found for all scheduling requirements on this workload'
          : 'No Nodes found for all scheduling requirements on this workload'
      }
    >
      <Popover
        headerContent={<div>{buttonText} found</div>}
        position={PopoverPosition.right}
        className="kv-node-checker__popover"
        bodyContent={qualifiedNodes.map((node) => (
          <ExternalLink
            key={getName(node)}
            href={resourcePath('Node', getName(node))}
            text={<ResourceLink linkTo={false} kind="Node" name={getName(node)} />}
          />
        ))}
      >
        <Button isInline isDisabled={size === 0} variant="link">
          <Text component={TextVariants.h4}>{buttonText}</Text>
        </Button>
      </Popover>{' '}
      qualify for this node selector
    </Alert>
  );
};

type NodeCheckerProps = {
  qualifiedNodes: NodeKind[];
};
