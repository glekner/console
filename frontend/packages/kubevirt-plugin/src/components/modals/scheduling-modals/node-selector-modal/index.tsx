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
import { getNodeSelectorPatches } from '../../../../k8s/patches/vm/vm-scheduling-patches';
import { VMLikeEntityKind } from '../../../../types/vmLike';
import { NodeSelector } from '../../../../types';
import { NSModal } from './node-selector-modal';

const NodeSelectorModal: React.FC<NodeSelectorModalProps> = (props) => {
  const { vmLikeEntity, nodeSelector = {}, handlePromise, setOpen, ...restProps } = props;

  const [selector, setSelector] = React.useState({
    ...Object.entries(nodeSelector).map(([key, value]) => ({ key, value })),
  }) as any;
  const [showPatchError, setPatchError] = React.useState<boolean>(false);

  const onLabelAdd = () =>
    setSelector({
      ...selector,
      [_.size(selector).toString()]: { key: '', value: '' },
    });

  const onLabelChange = (index, key, value) => {
    setSelector({ ...selector, [index]: { key, value } });
  };

  const onLabelDelete = (label) => {
    setSelector(_.omit(selector, label));
  };

  const onClose = () => {
    setSelector({
      ...Object.entries(nodeSelector).map(([key, value]) => ({ key, value })),
    });
    setOpen(false);
  };

  const onSubmit = async () => {
    const k8sSelector = Object.assign(
      {},
      ...Object.values(selector)
        .filter(({ key }) => !!key)
        .map(({ key, value }) => ({ [key]: value })),
    );

    if (!_.isEqual(nodeSelector, k8sSelector)) {
      handlePromise(
        k8sPatch(
          getVMLikeModel(vmLikeEntity),
          vmLikeEntity,
          await getNodeSelectorPatches(vmLikeEntity, k8sSelector),
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
      <NSModal
        selector={selector}
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

type NodeSelectorModalProps = HandlePromiseProps & {
  vmLikeEntity: VMLikeEntityKind;
  nodeSelector: NodeSelector;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

export default withHandlePromise(NodeSelectorModal);
