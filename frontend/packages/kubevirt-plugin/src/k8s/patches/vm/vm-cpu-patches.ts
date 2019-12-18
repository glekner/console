import { VMLikeEntityKind } from '../../../types';
import { PatchBuilder, PatchOperation } from '../../utils/patch';
import { getVMLikePatches } from '../vm-template';
import { getCPU, asVM } from '../../../selectors/vm';

export const getDedicatedCpuPatch = (
  vmLikeEntity: VMLikeEntityKind,
  dedicatedCpuPlacement: boolean,
) => {
  const isCPUAvailable = !!getCPU(asVM(vmLikeEntity));

  const patches = [
    new PatchBuilder(
      isCPUAvailable
        ? '/spec/template/spec/domain/cpu/dedicatedCpuPlacement'
        : '/spec/template/spec/domain/cpu',
    )
      .setOperation(PatchOperation.REPLACE)
      .setValue(isCPUAvailable ? dedicatedCpuPlacement : { cores: 1, dedicatedCpuPlacement })
      .build(),
  ];
  return getVMLikePatches(vmLikeEntity, () => patches);
};
