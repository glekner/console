import { getName } from '@console/shared';
import { V1alpha1DataVolume } from '@console/kubevirt-plugin/src/types/vm/disk/V1alpha1DataVolume';

export const getAvailableDVName = (dvs: V1alpha1DataVolume[]) => {
  const dvSet = new Set(dvs.map((dv) => getName(dv)));
  let index = 1;
  while (dvSet.has(`upload-datavolume-${index}`)) {
    index++;
  }
  return `upload-datavolume-${index}`;
};
