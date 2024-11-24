import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
import { readdir, copyFile } from "node:fs/promises";
import path from "node:path";

export default {
  test: {
    typecheck: {
      ignoreSourceErrors: true,
    },
  },
  plugins: [
    tsconfigPaths(),
    dts({
      entryRoot: "src",
      tsconfigPath: "tsconfig.json",
      rollupTypes: true,
      async afterBuild() {
        const files = await readdir("dist");
        const dtsFiles = files.filter((file) => file.endsWith(".d.ts"));
        await Promise.all(
          dtsFiles.map((file) =>
            copyFile(
              path.join("dist", file),
              path.join("dist", file.replace(".d.ts", ".d.cts"))
            )
          )
        );
      },
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "openapi-ff",
      fileName: "openapi-ff",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["effector", "@farfetched/core"],
    },
  },
};
