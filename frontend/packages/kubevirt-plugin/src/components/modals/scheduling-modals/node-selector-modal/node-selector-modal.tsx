import * as React from 'react';
import { Modal } from '@patternfly/react-core';
import { NodeModel } from '@console/internal/models';
import { getLabel } from '@console/shared';
import { FirehoseResult } from '@console/internal/components/utils';
import { ModalFooter } from '../../modal/modal-footer';
import { VMLikeEntityKind } from '../../../../types/vmLike';
import { NodeSelector } from '../../../../types';
import { getLoadedData, isLoaded, getLoadError } from '../../../../utils';
import { NodeChecker, LabelsList } from '../shared';
import { NODE_SELECTOR_MODAL_TITLE, NODE_SELECTOR_REQUIRED_LABEL } from '../shared/consts';
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
      <LabelsList
        labels={selector}
        onLabelAdd={onLabelAdd}
        onLabelChange={onLabelChange}
        onLabelDelete={onLabelDelete}
      />
      <NodeChecker qualifiedNodes={qualifiedNodes} isLoading={isLoading} />
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
