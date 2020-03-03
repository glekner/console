import * as React from 'react';
import * as _ from 'lodash';
import { NodeModel } from '@console/internal/models';
import {
  withHandlePromise,
  HandlePromiseProps,
  Firehose,
} from '@console/internal/components/utils';
import { k8sPatch } from '@console/internal/module/k8s';
import { getVMLikeModel } from '../../../selectors/vm';
import { getNodeSelectorPatch } from '../../../k8s/patches/vm/vm-node-selector-patches';
import { VMLikeEntityKind } from '../../../types/vmLike';
import { NodeSelector } from '../../../types';
import { NSModal } from './node-selector-modal';

const NodeSelectorModal: React.FC<NodeSelectorModalProps> = (props) => {
  const { vmLikeEntity, nodeSelector = {}, handlePromise, setOpen, ...restProps } = props;

  const [selector, setSelector] = React.useState({
    ...Object.entries(nodeSelector).map(([key, value]) => ({ key, value })),
  }) as any;

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [shouldPatch, setShouldPatch] = React.useState<boolean>(false);
  const [showPatchError, setPatchError] = React.useState<boolean>(false);

  const onLabelAdd = () =>
    setSelector({
      ...selector,
      [_.size(selector).toString()]: { key: '', value: '' },
    });

  const onLabelChange = (index, key, value) => {
    setIsLoading(true);
    setShouldPatch(true);
    setSelector({ ...selector, [index]: { key, value } });
  };

  const onLabelDelete = (label) => {
    setIsLoading(true);
    setShouldPatch(true);
    setSelector(_.omit(selector, label));
  };

  const onClose = () => {
    setIsLoading(true);
    setSelector({
      ...Object.entries(nodeSelector).map(([key, value]) => ({ key, value })),
    });
    setOpen(false);
  };

  const onSubmit = async () => {
    if (shouldPatch) {
      const k8sSelector = Object.assign(
        {},
        ...Object.values(selector)
          .filter(({ key }) => !!key)
          .map(({ key, value }) => ({ [key]: value })),
      );
      handlePromise(
        k8sPatch(
          getVMLikeModel(vmLikeEntity),
          vmLikeEntity,
          await getNodeSelectorPatch(vmLikeEntity, k8sSelector),
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
        isLoading={isLoading}
        setIsLoading={setIsLoading}
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
