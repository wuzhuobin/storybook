import type { Plugin } from 'esbuild';

const name = 'virtual-module';

export function virtualModulePlugin(virtualModuleMapping: Record<string, string>): Plugin {
  return {
    name,
    setup(build) {
      Object.entries(virtualModuleMapping).forEach(([key, value]) => {
        build.onResolve({ filter: new RegExp(`^${key}$`) }, (args) => ({
          path: args.path,
          namespace: name,
        }));

        build.onLoad({ filter: /.*/, namespace: name }, async (args) => {
          return {
            contents: value,
          };
        });
      });
    },
  };
}
