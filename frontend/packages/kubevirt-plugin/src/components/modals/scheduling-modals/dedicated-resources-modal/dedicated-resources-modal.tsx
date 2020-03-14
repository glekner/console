import * as React from 'react';
import { Button, ButtonVariant, Checkbox, Modal, Text, TextVariants } from '@patternfly/react-core';
import { k8sPatch } from '@console/internal/module/k8s';
import { NodeModel } from '@console/internal/models';
import {
  Firehose,
  withHandlePromise,
  HandlePromiseProps,
  FirehoseResult,
  Label,
} from '@console/internal/components/utils';
import { ModalFooter } from '../../modal/modal-footer';
import { getVMLikeModel, isDedicatedCPUPlacement, asVM } from '../../../../selectors/vm';
import { getDedicatedCpuPatch } from '../../../../k8s/patches/vm/vm-cpu-patches';
import { VMLikeEntityKind } from '../../../../types/vmLike';
import { isLoaded, getLoadError } from '../../../../utils';
import { DEDICATED_RESOURCES, DEDICATED_RESOURCES_LABELS } from './consts';
import './dedicated-resources-modal.scss';
import { useNodeQualifier } from '../shared/hooks';
import { NodeChecker } from '../shared/NodeChecker/node-checker';
import { useCollisionChecker } from '../../../../hooks/use-collision-checker';

const ResourceModal = withHandlePromise<ResourceModalProps>(
  ({ vmLikeEntity, nodes, isOpen, setOpen, handlePromise, inProgress, errorMessage }) => {
    const loadError = getLoadError(nodes, NodeModel);
    const isCPUPinned = isDedicatedCPUPlacement(asVM(vmLikeEntity));

    const [isPinned, setIsPinned] = React.useState<boolean>(isCPUPinned);
    const [showPatchError, setPatchError] = React.useState<boolean>(false);
    const qualifiedNodes = useNodeQualifier(DEDICATED_RESOURCES_LABELS, nodes);

    const [showCollisionAlert, reload] = useCollisionChecker<VMLikeEntityKind>(
      isDedicatedCPUPlacement(asVM(vmLikeEntity)),
      (oldBool: VMLikeEntityKind, newBool: VMLikeEntityKind) => oldBool === newBool,
    );

    const onReload = () => {
      reload();
      setIsPinned(isDedicatedCPUPlacement(asVM(vmLikeEntity)));
    };

    const submit = async () => {
      if (isPinned !== isCPUPinned) {
        handlePromise(
          k8sPatch(
            getVMLikeModel(vmLikeEntity),
            vmLikeEntity,
            await getDedicatedCpuPatch(vmLikeEntity, isPinned),
          ),
        )
          .then(() => setOpen(false))
          .catch(() => setPatchError(true));
      } else {
        setOpen(false);
      }
    };
    const footer = (
      <ModalFooter
        id="dedicated-resources"
        className="kubevirt-dedicated-resources__footer"
        errorMessage={showPatchError && errorMessage}
        inProgress={inProgress || !isLoaded(nodes)}
        isSimpleError={!!loadError}
        onSubmit={submit}
        onCancel={() => setOpen(false)}
        submitButtonText="Save"
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
    );

    return (
      <Modal
        width="50%"
        title={DEDICATED_RESOURCES}
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        footer={footer}
        isFooterLeftAligned
      >
        <Checkbox
          className="kubevirt-dedicated-resources__checkbox"
          label="Schedule this workload with dedicated resources (guaranteed policy)"
          isChecked={isPinned}
          isDisabled={!isLoaded(nodes)}
          onChange={(flag) => setIsPinned(flag)}
          id="dedicated-resources-checkbox"
        />
        <Text className="kubevirt-dedicated-resources__helper-text" component={TextVariants.small}>
          Available only on Nodes with labels{' '}
          <Label kind={NodeModel.kind} name="cpumanager" value="true" expand />
        </Text>
        <NodeChecker qualifiedNodes={qualifiedNodes} />
      </Modal>
    );
  },
);

type ResourceModalProps = HandlePromiseProps & {
  vmLikeEntity: VMLikeEntityKind;
  isOpen: boolean;
  nodes?: FirehoseResult<VMLikeEntityKind[]>;
  setOpen: (isOpen: boolean) => void;
};

export const DedicatedResourcesModal: React.FC<DedicatedResourcesModalProps> = (props) => {
  const { vmLikeEntity, ...restProps } = props;

  const resources = [
    {
      kind: NodeModel.kind,
      isList: true,
      namespaced: false,
      prop: 'nodes',
    },
  ];

  return (
    <Firehose resources={resources}>
      <ResourceModal vmLikeEntity={vmLikeEntity} {...restProps} />
    </Firehose>
  );
};

type DedicatedResourcesModalProps = {
  vmLikeEntity: VMLikeEntityKind;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};
