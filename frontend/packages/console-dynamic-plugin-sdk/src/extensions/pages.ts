import { RouteComponentProps } from 'react-router';
import { Extension, ExtensionDeclaration, CodeRef } from '../types';

type ResourcePage = {
  model: {
    group: string;
    version: string;
    kind: string;
  };
  component: CodeRef<
    React.Component<{
      match: RouteComponentProps['match'];
      namespace: string;
      model: {
        group: string;
        version: string;
        kind: string;
      };
    }>
  >;
};

/** Adds new standalone page (rendered outside the common page layout) to Console router. */
export type StandaloneRoutePage = ExtensionDeclaration<
  'console.page/route/standalone',
  {
    /** The component to be rendered when the route matches. */
    component: CodeRef<React.FC<RouteComponentProps>>;
    /** Valid URL path or array of paths that `path-to-regexp@^1.7.0` understands. */
    path: string | string[];
    /** When true, will only match if the path matches the `location.pathname` exactly. */
    exact?: boolean;
  }
>;

/** Adds new page to Console router. */
export type RoutePage = ExtensionDeclaration<
  'console.page/route',
  {
    /** The React component to load for the page. */
    component: CodeRef<React.Component<RouteComponentProps>>;
    /** The perspective ID to which this item belongs to. If not specified, contributes to all perspectives. */
    perspective?: string;
    /** Valid URL path or array of paths that `path-to-regexp@^1.7.0` understands. */
    path: string | string[];
    /** When true, will only match if the path matches the `location.pathname` exactly. */
    exact?: boolean;
    /** When true, a path that has a trailing slash will only match a location.pathname with a trailing slash. This has no effect when there are additional URL segments in the location.pathname. */
    strict?: boolean;
    /** When true, will match if the path is case sensitive. */
    sensitive?: boolean;
  }
>;

/** Adds new resource list to Console router. */
export type ResourceListPage = ExtensionDeclaration<'console.page/resource/list', ResourcePage>;

/** Adds new details page to Console router. */
export type ResourceDetailsPage = ExtensionDeclaration<
  'console.page/resource/details',
  ResourcePage
>;

/** Adds new resource tab page to Console router. */
export type ResourceTabPage = ExtensionDeclaration<
  'console.page/resource/tab',
  ResourcePage & {
    /** The name of the tab. */
    name: string;
    /** The optional href for the tab link. If not provided, the first `path` is used. */
    href?: string;
    /** Valid URL path or array of paths that `path-to-regexp@^1.7.0` understands. */
    path: string | string[];
    /** When true, will only match if the path matches the `location.pathname` exactly. */
    exact?: boolean;
    /** When true, a path that has a trailing slash will only match a location.pathname with a trailing slash. This has no effect when there are additional URL segments in the location.pathname. */
    strict?: boolean;
    /** When true, will match if the path is case sensitive. */
    sensitive?: boolean;
  }
>;

// Type guards

export const isRoutePage = (e: Extension): e is RoutePage => e.type === 'console.page/route';

export const isStandaloneRoutePage = (e: Extension): e is StandaloneRoutePage =>
  e.type === 'console.page/route/standalone';

export const isResourceListPage = (e: Extension): e is ResourceListPage =>
  e.type === 'console.page/resource/list';

export const isResourceDetailsPage = (e: Extension): e is ResourceDetailsPage =>
  e.type === 'console.page/resource/details';

export const isResourceTabPage = (e: Extension): e is ResourceTabPage =>
  e.type === 'console.page/resource/tab';
