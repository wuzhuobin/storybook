import { dirname, join, parse } from 'path';
import fs from 'fs-extra';
import { type EsbuildBuilder } from './types';
import { build as esbuildBuild } from './build';

const getAbsolutePath = <I extends string>(input: I): I =>
  dirname(require.resolve(join(input, 'package.json'))) as any;

export const build: EsbuildBuilder['build'] = async ({ options }) => {
  const esbuildCompilation = esbuildBuild(options);

  const previewResolvedDir = getAbsolutePath('@storybook/preview');
  const previewDirOrigin = join(previewResolvedDir, 'dist');
  const previewDirTarget = join(options.outputDir || '', `sb-preview`);

  const previewFiles = fs.copy(previewDirOrigin, previewDirTarget, {
    filter: (src) => {
      const { ext } = parse(src);
      if (ext) {
        return ext === '.js';
      }
      return true;
    },
  });

  const [out] = await Promise.all([esbuildCompilation, previewFiles]);

  return out;
};

export const corePresets = [join(__dirname, 'presets/preview-preset.js')];
