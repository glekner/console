import * as React from 'react';
import { Checkbox, Modal } from '@patternfly/react-core';
import { k8sPatch } from '@console/internal/module/k8s';
import { withHandlePromise, HandlePromiseProps } from '@console/internal/components/utils';
import { ModalComponentProps } from '@console/internal/components/factory';
import { ModalFooter } from '../modal/modal-footer';
import { getVMLikeModel } from '../../../selectors/vm';
import { getDedicatedCpuPatch } from '../../../k8s/patches/vm/vm-cpu-patches';
import { VMLikeEntityKind } from '../../../types';
import './cpu-pinning-modal.scss';

export const CpuPinningModal = withHandlePromise(
  ({
    vmLikeEntity,
    isCPUPinned,
    isOpen,
    setOpen,
    title = 'Resource Scheduling',
    handlePromise,
    inProgress,
    errorMessage,
  }: CpuPinningModalProps) => {
    const [isPinned, setIsPinned] = React.useState<boolean>(isCPUPinned);
    const [showPatchError, setPatchError] = React.useState<boolean>(false);

    const submit = async () => {
      // eslint-disable-next-line promise/catch-or-return
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
        className=""
        errorMessage={showPatchError && errorMessage}
        inProgress={inProgress}
        onSubmit={submit}
        onCancel={() => setOpen(false)}
        submitButtonText="Save"
      />
    );

    return (
      <Modal
        title={title}
        isOpen={isOpen}
        isSmall
        onClose={() => setOpen(false)}
        footer={footer}
        isFooterLeftAligned
      >
        <>
          <span className="kubevirt-cpu-pinning__schedule-title">
            Scheduling will attempt to apply the following settings if possible
          </span>
          <Checkbox
            className="kubevirt-cpu-pinning__checkbox"
            label="Isolate this workload on schedule resources (guaranteed policy)"
            isChecked={isPinned}
            onChange={(flag) => setIsPinned(flag)}
            id="cpu-pinning-checkbox"
          />
        </>
      </Modal>
    );
  },
);

export type CpuPinningModalProps = HandlePromiseProps &
  ModalComponentProps & {
    vmLikeEntity: VMLikeEntityKind;
    isOpen: boolean;
    isCPUPinned: boolean;
    title?: string;
    setOpen: (isOpen: boolean) => void;
  };
