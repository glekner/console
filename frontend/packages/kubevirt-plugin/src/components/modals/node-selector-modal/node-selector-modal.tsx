import * as React from 'react';
import * as _ from 'lodash';
import { Modal, Button, Text, TextVariants } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import { NodeModel } from '@console/internal/models';
// import { useDebounce } from '@console/dev-console/src/components/pipelines/pipeline-builder/hooks';
import { getLabel } from '@console/shared';
import { FirehoseResult, ExternalLink, resourcePath } from '@console/internal/components/utils';
import { ModalFooter } from '../modal/modal-footer';
import { VMLikeEntityKind } from '../../../types/vmLike';
import { NodeSelector } from '../../../types';
import { getLoadedData, isLoaded, getLoadError } from '../../../utils';
import {
  NODE_SELECTOR_ADD_LABEL,
  NODE_SELECTOR_MODAL_TITLE,
  NODE_SELECTOR_LABEL_KEY,
  NODE_SELECTOR_LABEL_VALUE,
  NODE_SELECTOR_REQUIRED_LABEL,
} from './consts';
import { NodeSelectorRow } from './node-selector-row';
import { NodeSelectorSummary } from './node-selector-summary';
import './node-selector-modal.scss';

export const NSModal = ({
  nodes,
  selector,
  isLoading,
  setIsLoading,
  onLabelAdd,
  onLabelChange,
  onLabelDelete,
  onSubmit,
  onClose,
  isOpen,
  inProgress,
  errorMessage,
  showPatchError,
}: NSModalProps) => {
  const loadError = getLoadError(nodes, NodeModel);
  const loadedNodes = getLoadedData(nodes, []);

  const [qualifiedNodes, setQualifiedNodes] = React.useState([]);

  // Node search 1 sec after user stopped typing
  React.useEffect(() => {
    const debounceNodeSearch = setTimeout(() => {
      if (isLoaded(nodes)) {
        const labels = Object.values(selector).filter(({ key }) => !!key);
        // look only for schedulable nodes
        labels.push({
          key: NODE_SELECTOR_REQUIRED_LABEL.KEY,
          value: NODE_SELECTOR_REQUIRED_LABEL.VALUE,
        });

        const newNodes = loadedNodes.filter((node) =>
          labels.every(({ key, value }) => getLabel(node, key) === value),
        );
        setQualifiedNodes(newNodes);
        setIsLoading(false);
      }
    }, 1000);
    return () => clearTimeout(debounceNodeSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector, loadedNodes]);

  const footer = (
    <ModalFooter
      id="node-selector"
      className="kubevirt-node-selector__footer"
      errorMessage={showPatchError && errorMessage}
      inProgress={!isLoaded(nodes) || inProgress}
      isSimpleError={loadError}
      onSubmit={onSubmit}
      onCancel={onClose}
      submitButtonText="Apply"
    />
  );

  return (
    <Modal
      width="50%"
      title={NODE_SELECTOR_MODAL_TITLE}
      isOpen={isOpen}
      onClose={onClose}
      footer={footer}
      isFooterLeftAligned
    >
      {_.size(selector) > 0 && (
        <div className="kubevirt-node-selector__keyvalue-row">
          <Text className="kubevirt-dedicated-resources__key" component={TextVariants.h4}>
            {NODE_SELECTOR_LABEL_KEY}
          </Text>
          <Text className="kubevirt-dedicated-resources__value" component={TextVariants.h4}>
            {NODE_SELECTOR_LABEL_VALUE}
          </Text>
        </div>
      )}
      <div className="kubevirt-node-selector__selector-container">
        {Object.entries(selector).map(([index, label]) => (
          <NodeSelectorRow
            key={index}
            index={index}
            label={label}
            onChange={onLabelChange}
            onDelete={onLabelDelete}
          />
        ))}
      </div>
      <div className="kubevirt-node-selector__buttons">
        <Button
          className="pf-m-link--align-left"
          id="vm-node-selector-add-btn"
          variant="link"
          onClick={onLabelAdd}
          icon={<PlusCircleIcon />}
        >
          {NODE_SELECTOR_ADD_LABEL}
        </Button>
        <ExternalLink text={<div>Explore nodes list</div>} href={resourcePath('Node')} />
      </div>
      {_.size(selector) > 0 && (
        <NodeSelectorSummary qualifiedNodes={qualifiedNodes} isLoading={isLoading} />
      )}
    </Modal>
  );
};

type NSModalProps = {
  isOpen: boolean;
  nodes?: FirehoseResult<VMLikeEntityKind[]>;
  nodeSelector?: NodeSelector;
  selector: any;
  isLoading: boolean;
  inProgress: boolean;
  errorMessage: string;
  showPatchError: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onLabelAdd: () => void;
  onLabelChange: (index: string, key: string, value: string) => void;
  onLabelDelete: (index: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};
