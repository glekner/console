import * as React from 'react';
import * as _ from 'lodash';
import { ModalTitle, ModalBody, ModalComponentProps } from '@console/internal/components/factory';
import { Button, ButtonVariant } from '@patternfly/react-core';
import {
  FirehoseResult,
  withHandlePromise,
  HandlePromiseProps,
} from '@console/internal/components/utils';
import { k8sPatch } from '@console/internal/module/k8s';
import { isLoaded, getLoadedData } from '../../../../utils';
import { ModalFooter } from '../../modal/modal-footer';
import { VMLikeEntityKind } from '../../../../types/vmLike';
import { getVMLikeModel, getNodeSelector } from '../../../../selectors/vm';
import { getNodeSelectorPatches } from '../../../../k8s/patches/vm/vm-scheduling-patches';
import { NodeChecker } from '../shared/NodeChecker/node-checker';
import { useNodeQualifier } from '../shared/hooks';
import { LabelsList } from '../../../LabelsList/labels-list';
import { NODE_SELECTOR_MODAL_TITLE } from '../shared/consts';
import { nodeSelectorToIDLabels } from './helpers';
import { useIDLabels } from '../../../../hooks/use-id-labels';
import { NodeSelectorLabel } from '../shared/types';
import { useCollisionChecker } from '../../../../hooks/use-collision-checker';

export const NSModal = withHandlePromise(
  ({
    nodes,
    close,
    handlePromise,
    inProgress,
    errorMessage,
    vmLikeEntity,
    vmLikeEntityLoading,
  }: NSModalProps) => {
    const vmLikeFinal = getLoadedData(vmLikeEntityLoading, vmLikeEntity);

    const [
      selectorLabels,
      setSelectorLabels,
      onLabelAdd,
      onLabelChange,
      onLabelDelete,
    ] = useIDLabels<NodeSelectorLabel>(nodeSelectorToIDLabels(getNodeSelector(vmLikeEntity)));

    const [qualifiedNodes, loadError] = useNodeQualifier(selectorLabels, nodes);

    const [showCollisionAlert, reload] = useCollisionChecker<VMLikeEntityKind>(
      vmLikeFinal,
      (oldVM: VMLikeEntityKind, newVM: VMLikeEntityKind) =>
        _.isEqual(getNodeSelector(oldVM), getNodeSelector(newVM)),
    );

    const onReload = () => {
      reload();
      setSelectorLabels(nodeSelectorToIDLabels(getNodeSelector(vmLikeFinal)));
    };

    const onSubmit = async () => {
      const k8sSelector = Object.assign(
        {},
        ...selectorLabels.filter(({ key }) => !!key).map(({ key, value }) => ({ [key]: value })),
      );

      if (!_.isEqual(getNodeSelector(vmLikeFinal), k8sSelector)) {
        // eslint-disable-next-line promise/catch-or-return
        handlePromise(
          k8sPatch(
            getVMLikeModel(vmLikeFinal),
            vmLikeFinal,
            await getNodeSelectorPatches(vmLikeFinal, k8sSelector),
          ),
        ).then(close);
      } else {
        close();
      }
    };

    return (
      <div className="modal-content">
        <ModalTitle>{NODE_SELECTOR_MODAL_TITLE}</ModalTitle>
        <ModalBody>
          <LabelsList
            labels={selectorLabels}
            onLabelAdd={onLabelAdd}
            onLabelChange={onLabelChange}
            onLabelDelete={onLabelDelete}
          />
          <NodeChecker qualifiedNodes={qualifiedNodes} />
        </ModalBody>
        <ModalFooter
          id="node-selector"
          errorMessage={errorMessage}
          inProgress={!isLoaded(nodes) || inProgress}
          isSimpleError={!!loadError}
          onSubmit={onSubmit}
          onCancel={close}
          submitButtonText="Apply"
          infoTitle={showCollisionAlert && 'Node Selector has been updated outside this flow.'}
          infoMessage={
            <>
              Saving these changes will override any Node Selector previously saved.
              <br />
              <Button variant={ButtonVariant.link} isInline onClick={onReload}>
                Reload Node Selector
              </Button>
              .
            </>
          }
        />
      </div>
    );
  },
);

type NSModalProps = HandlePromiseProps &
  ModalComponentProps & {
    vmLikeEntity: VMLikeEntityKind;
    nodes?: FirehoseResult<VMLikeEntityKind[]>;
    inProgress: boolean;
    vmLikeEntityLoading?: FirehoseResult<VMLikeEntityKind>;
    errorMessage: string;
  };
