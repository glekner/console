import * as _ from 'lodash';
import { PatchBuilder } from '@console/dynamic-plugin-sdk';
import { getSimpleName } from '../../../selectors/utils';
import { getDeviceBootOrder } from '../../../selectors/vm';

export const getShiftBootOrderPatches = (
  path: string,
  devices: any[],
  removedDeviceName: string,
  removedDeviceBootOrder: number = -1,
) => {
  const devicesWithoutRemovedDevice =
    removedDeviceName == null
      ? devices
      : devices.filter((device) => getSimpleName(device) !== removedDeviceName);

  return devicesWithoutRemovedDevice
    .filter((device) => getDeviceBootOrder(device, -1) > removedDeviceBootOrder)
    .map((device) => {
      const patchedDevice = _.cloneDeep(device);
      patchedDevice.bootOrder = getDeviceBootOrder(patchedDevice) - 1;

      return new PatchBuilder(path)
        .setListUpdate(
          patchedDevice,
          devicesWithoutRemovedDevice,
          (other, updatedItem) => getSimpleName(other) === getSimpleName(updatedItem),
        )
        .build();
    });
};
