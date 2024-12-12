import { buildSync } from "esbuild";
import express from "express";
import { globbySync } from "globby";
import path from "path";

export async function startServer(port: number) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const currDir = process.cwd();
  const routesDir = path.join(currDir, "routes");

  // check if typescript files present
  const paths = globbySync(`**/*.ts`, {
    cwd: routesDir,
    ignore: ["node_modules", "dist"],
  });
  const hasTs = paths.length > 0;

  // where we import routes from
  let srcDir = currDir;

  if (hasTs) {
    buildSync({
      format: "esm",
      bundle: false,
      platform: "node",
      entryPoints: paths.map((p) => path.join(routesDir, p)),
      outdir: path.join(currDir, ".warwick"),
    });

    srcDir = path.join(currDir, ".warwick");
  }

  // look for route files
  const routeFiles = globbySync("**/route.js", { cwd: srcDir });

  for (const routeFile of routeFiles) {
    const filePath = path.join(srcDir, routeFile);

    const fileModule = await import(`file://${filePath}`);
    const allowedMethods = ["get", "post", "put", "delete"];

    // check for handlers
    Object.entries(fileModule).forEach(([m, handler]) => {
      const method = m.toLowerCase();
      const route = routeFile.replace(/route.js/g, "");

      if (!allowedMethods.includes(method)) return;

      app[method as keyof typeof app](`/${route}`, handler);
    });
  }

  app.listen(port, () => {
    console.log(`Starting server on port: ${port}`);
  });
}
