import * as React from 'react';
import { TFunction } from 'i18next';
import { Shortcut, ShortcutTable } from '@console/dynamic-plugin-sdk';
import { TopologyViewType } from '../../topology-types';

export type Options = {
  supportedFileTypes: string[];
  isEmptyModel: boolean;
  viewType: TopologyViewType;
};
export const getTopologyShortcuts = (t: TFunction, options: Options): React.ReactElement => (
  <ShortcutTable>
    {!options.isEmptyModel && options.viewType === TopologyViewType.graph && (
      <>
        <Shortcut data-test-id="move" drag>
          {t('topology~Move')}
        </Shortcut>
        <Shortcut data-test-id="edit-application-grouping" shift drag>
          {t('topology~Edit Application grouping')}
        </Shortcut>
        <Shortcut data-test-id="context-menu" rightClick>
          {t('topology~Access context menu')}
        </Shortcut>
        <Shortcut data-test-id="create-connector-handle" hover>
          {t('topology~Access create connector handle')}
        </Shortcut>
      </>
    )}
    {!options.isEmptyModel && (
      <Shortcut data-test-id="view-details" click>
        {t('topology~View details in side panel')}
      </Shortcut>
    )}
    <Shortcut data-test-id="open-quick-search" ctrl keyName="Spacebar">
      {t('topology~Open quick search modal')}
    </Shortcut>
    {options.supportedFileTypes?.length > 0 && (
      <Shortcut data-test-id="upload-file" dragNdrop>
        {t('topology~Upload file ({{fileTypes}}) to project', {
          fileTypes: options.supportedFileTypes.map((ex) => `.${ex}`).toString(),
        })}
      </Shortcut>
    )}
  </ShortcutTable>
);
