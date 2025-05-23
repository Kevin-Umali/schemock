/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as TemplateImport } from './routes/template'
import { Route as SqlImport } from './routes/sql'
import { Route as MockImport } from './routes/mock'
import { Route as HelperImport } from './routes/helper'
import { Route as CsvImport } from './routes/csv'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const TemplateRoute = TemplateImport.update({
  id: '/template',
  path: '/template',
  getParentRoute: () => rootRoute,
} as any)

const SqlRoute = SqlImport.update({
  id: '/sql',
  path: '/sql',
  getParentRoute: () => rootRoute,
} as any)

const MockRoute = MockImport.update({
  id: '/mock',
  path: '/mock',
  getParentRoute: () => rootRoute,
} as any)

const HelperRoute = HelperImport.update({
  id: '/helper',
  path: '/helper',
  getParentRoute: () => rootRoute,
} as any)

const CsvRoute = CsvImport.update({
  id: '/csv',
  path: '/csv',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/csv': {
      id: '/csv'
      path: '/csv'
      fullPath: '/csv'
      preLoaderRoute: typeof CsvImport
      parentRoute: typeof rootRoute
    }
    '/helper': {
      id: '/helper'
      path: '/helper'
      fullPath: '/helper'
      preLoaderRoute: typeof HelperImport
      parentRoute: typeof rootRoute
    }
    '/mock': {
      id: '/mock'
      path: '/mock'
      fullPath: '/mock'
      preLoaderRoute: typeof MockImport
      parentRoute: typeof rootRoute
    }
    '/sql': {
      id: '/sql'
      path: '/sql'
      fullPath: '/sql'
      preLoaderRoute: typeof SqlImport
      parentRoute: typeof rootRoute
    }
    '/template': {
      id: '/template'
      path: '/template'
      fullPath: '/template'
      preLoaderRoute: typeof TemplateImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/csv': typeof CsvRoute
  '/helper': typeof HelperRoute
  '/mock': typeof MockRoute
  '/sql': typeof SqlRoute
  '/template': typeof TemplateRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/csv': typeof CsvRoute
  '/helper': typeof HelperRoute
  '/mock': typeof MockRoute
  '/sql': typeof SqlRoute
  '/template': typeof TemplateRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/csv': typeof CsvRoute
  '/helper': typeof HelperRoute
  '/mock': typeof MockRoute
  '/sql': typeof SqlRoute
  '/template': typeof TemplateRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/csv' | '/helper' | '/mock' | '/sql' | '/template'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/csv' | '/helper' | '/mock' | '/sql' | '/template'
  id: '__root__' | '/' | '/csv' | '/helper' | '/mock' | '/sql' | '/template'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  CsvRoute: typeof CsvRoute
  HelperRoute: typeof HelperRoute
  MockRoute: typeof MockRoute
  SqlRoute: typeof SqlRoute
  TemplateRoute: typeof TemplateRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  CsvRoute: CsvRoute,
  HelperRoute: HelperRoute,
  MockRoute: MockRoute,
  SqlRoute: SqlRoute,
  TemplateRoute: TemplateRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/csv",
        "/helper",
        "/mock",
        "/sql",
        "/template"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/csv": {
      "filePath": "csv.tsx"
    },
    "/helper": {
      "filePath": "helper.tsx"
    },
    "/mock": {
      "filePath": "mock.tsx"
    },
    "/sql": {
      "filePath": "sql.tsx"
    },
    "/template": {
      "filePath": "template.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
