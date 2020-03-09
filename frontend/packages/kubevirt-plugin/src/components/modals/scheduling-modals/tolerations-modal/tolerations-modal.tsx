import * as React from 'react';
import { Modal } from '@patternfly/react-core';
import { NodeModel } from '@console/internal/models';
import { getLabel } from '@console/shared';
import { FirehoseResult } from '@console/internal/components/utils';
import { ModalFooter } from '../../modal/modal-footer';
import { VMLikeEntityKind } from '../../../../types/vmLike';
import { getLoadedData, isLoaded, getLoadError } from '../../../../utils';
import { NodeChecker, LabelsList } from '../shared';
import { TOLERATIONS_MODAL_TITLE, SCHEDULING_REQUIRED_LABEL } from '../shared/consts';
import './tolerations-modal.scss';

export const TModal = ({
  nodes,
  tolerations,
  onLabelAdd,
  onLabelChange,
  onLabelDelete,
  onSubmit,
  onClose,
  isOpen,
  inProgress,
  errorMessage,
  showPatchError,
}: TModalProps) => {
  const loadError = getLoadError(nodes, NodeModel);
  const loadedNodes = getLoadedData(nodes, []);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [qualifiedNodes, setQualifiedNodes] = React.useState([]);
  // Node search 1 sec after user stopped typing
  React.useEffect(() => {
    const debounceNodeSearch = setTimeout(() => {
      if (isLoaded(nodes)) {
        const labels = Object.values(tolerations).filter(({ key }) => !!key);
        // look only for schedulable nodes
        labels.push({
          key: SCHEDULING_REQUIRED_LABEL,
          value: 'true',
        });

        const newNodes = loadedNodes.filter((node) =>
          labels.every(({ key, value }) => getLabel(node, key) === value),
        );
        setQualifiedNodes(newNodes);
        setIsLoading(false);
      }
    }, 1000);
    return () => {
      setIsLoading(true);
      clearTimeout(debounceNodeSearch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tolerations, loadedNodes]);

  const footer = (
    <ModalFooter
      id="tolerations"
      className="kubevirt-tolerations__footer"
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
      width="65%"
      title={TOLERATIONS_MODAL_TITLE}
      isOpen={isOpen}
      onClose={onClose}
      footer={footer}
      isFooterLeftAligned
    >
      <LabelsList
        labels={tolerations}
        onLabelAdd={onLabelAdd}
        onLabelChange={onLabelChange}
        onLabelDelete={onLabelDelete}
        addRowText="Add Toleration"
        showEffect
      />
      <NodeChecker qualifiedNodes={qualifiedNodes} isLoading={isLoading} />
    </Modal>
  );
};

type TModalProps = {
  isOpen: boolean;
  nodes?: FirehoseResult<VMLikeEntityKind[]>;
  tolerations: any;
  inProgress: boolean;
  errorMessage: string;
  showPatchError: boolean;
  onLabelAdd: () => void;
  onLabelChange: (index: string, key: string, value: string, effect?: string) => void;
  onLabelDelete: (index: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};
