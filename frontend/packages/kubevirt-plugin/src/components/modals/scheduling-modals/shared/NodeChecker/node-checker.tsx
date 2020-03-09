import * as React from 'react';
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
import './node-checker.scss';

export const NodeChecker: React.FC<NodeCheckerProps> = ({ qualifiedNodes, isLoading }) => {
  const size = qualifiedNodes.length;
  const buttonText = size === 1 ? '1 Node' : `${size} Nodes`;
  const icon = size > 0 ? <CheckCircleIcon /> : <ExclamationCircleIcon />;
  return (
    <div className="kv-node-checker__container">
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
        <div>
          {isLoading ? (
            <LoadingInline />
          ) : (
            <Button
              className="kv-node-checker__popover-btn"
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

type NodeCheckerProps = {
  qualifiedNodes: NodeKind[];
  isLoading: boolean;
};
