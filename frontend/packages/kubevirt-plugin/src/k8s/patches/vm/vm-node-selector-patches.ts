import { PatchBuilder, PatchOperation } from '@console/shared/src/k8s';
import { Patch } from '@console/internal/module/k8s';
import { NodeSelector } from '../../../types/vm';
import { VMLikeEntityKind } from '../../../types/vmLike';
import { getVMLikePatches } from '../vm-template';

export const getNodeSelectorPatch = (
  vmLikeEntity: VMLikeEntityKind,
  selectors: NodeSelector,
): Patch[] =>
  getVMLikePatches(vmLikeEntity, () => [
    new PatchBuilder('/spec/template/spec/nodeSelector')
      .setOperation(PatchOperation.REPLACE)
      .setValue(selectors)
      .build(),
  ]);
