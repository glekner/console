import { Extension } from '@console/plugin-sdk/src/typings/base';
import { CodeRef, EncodedCodeRef, UpdateExtensionProperties } from '../types';

/** Actions are reusable executable functions that can be contributed to menus and toolbars */
export namespace ExtensionProperties {
  export type Action = {
    /** A unique identifier for this action. */
    id: string;
    /** An optional href to support navigational links. */
    href?: string;
    /** The function to execute for this action. Optional if `href` provided */
    execute?: EncodedCodeRef;
    /** Whether the action is disabled. */
    disabled?: boolean;
    /** The tooltip for this action. */
    tooltip?: string;
    /** The icon for this action. */
    icon?: string | React.ReactNode;
    /** A `/` separated string where each segment denotes Eg. `Menu 1/Menu 2/Menu 3` */
    path?: string;
    /** Insert this item before the action referenced here */
    insertBefore?: string;
    /** Wether the action is hidden */
    hidden?: boolean;
  };

  export type ActionCodeRefs = {
    execute?: CodeRef<() => void>;
  };

  export type ActionFactory = {
    /** The context ID helps to narrow the scope of contributed actions to a particular area of the application. */
    contextId?: string;
    /** A react hook which returns actions for the given scope. */
    getActions: EncodedCodeRef;
  };

  export type ActionFactoryCodeRefs = {
    getActions: CodeRef<(scope: any) => Action[] | undefined>;
  };

  export type ResourceActionFactory = ActionFactory & {
    /** The model for which this action applies. */
    model?: {
      group?: string;
      version?: string;
      kind?: string;
    };
    /** Standard getAction with resource specific params. */
    getAction: EncodedCodeRef;
  };

  export type ResourceActionFactoryCodeRefs = {
    getActions: CodeRef<(scope: any) => Action[] | undefined>;
    getAction: CodeRef<(...args) => Action | Promise<Action | undefined> | undefined>;
  };

  export type ResourceAction = Action & {
    /** Describes the access check to perform. */
    accessReview?: any;
  };
}

// Extension types

// Type guards
