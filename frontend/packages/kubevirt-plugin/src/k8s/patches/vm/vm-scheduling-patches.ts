import { PatchBuilder, PatchOperation } from '@console/shared/src/k8s';
import { Patch } from '@console/internal/module/k8s';
import { NodeSelector, Toleration } from '../../../types/vm';
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

export const getTolerationsPatch = (
  vmLikeEntity: VMLikeEntityKind,
  tolerations: Toleration[],
): Patch[] => {
  const tolerationsWithOperator = tolerations.map((toleration) => ({
    ...toleration,
    operator: toleration.value ? 'Equal' : 'Exists',
  }));

  return getVMLikePatches(vmLikeEntity, () => [
    new PatchBuilder('/spec/template/spec/tolerations')
      .setOperation(PatchOperation.REPLACE)
      .setValue(tolerationsWithOperator)
      .build(),
  ]);
};
