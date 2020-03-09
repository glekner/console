import * as React from 'react';
import * as _ from 'lodash';
import { NodeModel } from '@console/internal/models';
import {
  withHandlePromise,
  HandlePromiseProps,
  Firehose,
} from '@console/internal/components/utils';
import { k8sPatch } from '@console/internal/module/k8s';
import { getVMLikeModel } from '../../../../selectors/vm';
import { getTolerationsPatch } from '../../../../k8s/patches/vm/vm-scheduling-patches';
import { VMLikeEntityKind } from '../../../../types/vmLike';
import { Toleration } from '../../../../types';
import { TModal } from './tolerations-modal';

const TolerationsModal: React.FC<TolerationsModalProps> = (props) => {
  const { vmLikeEntity, initialTolerations = [], handlePromise, setOpen, ...restProps } = props;

  const [tolerations, setTolerations] = React.useState({
    ...Object.values(initialTolerations),
  }) as any;

  const [showPatchError, setPatchError] = React.useState<boolean>(false);

  const onLabelAdd = () =>
    setTolerations({
      ...tolerations,
      [_.size(tolerations).toString()]: { key: '', value: '', effect: 'NoSchedule' },
    });

  const onLabelChange = (index, key, value, effect) => {
    setTolerations({ ...tolerations, [index]: { key, value, effect } });
  };

  const onLabelDelete = (label) => {
    setTolerations(_.omit(tolerations, label));
  };

  const onClose = () => {
    setTolerations({
      ...Object.values(initialTolerations),
    });
    setOpen(false);
  };

  const onSubmit = async () => {
    if (!_.isEqual(initialTolerations, tolerations)) {
      handlePromise(
        k8sPatch(
          getVMLikeModel(vmLikeEntity),
          vmLikeEntity,
          await getTolerationsPatch(
            vmLikeEntity,
            Object.values(tolerations).filter(({ key }) => !!key),
          ),
        ),
      )
        .then(() => setOpen(false))
        .catch(() => setPatchError(true));
    } else {
      onClose();
    }
  };

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
      <TModal
        tolerations={tolerations}
        onLabelAdd={onLabelAdd}
        onLabelChange={onLabelChange}
        onLabelDelete={onLabelDelete}
        onSubmit={onSubmit}
        onClose={onClose}
        showPatchError={showPatchError}
        {...restProps}
      />
    </Firehose>
  );
};

type TolerationsModalProps = HandlePromiseProps & {
  vmLikeEntity: VMLikeEntityKind;
  initialTolerations: Toleration[];
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

export default withHandlePromise(TolerationsModal);
