import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
interface WebpackRule {
  test: RegExp;
  use: string;
}

interface WebpackConfig {
  module: {
    rules: WebpackRule[];
  };
}

interface ModuleExports {
  webpack: (config: WebpackConfig) => WebpackConfig;
}

const moduleExports: ModuleExports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.js\.map$/,
      use: 'ignore-loader',
    });
    return config;
  },
};

module.exports = moduleExports;
