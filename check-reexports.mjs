import fs from "fs";
import path from "path";

function checkReexports(indexFilePath) {
  const indexContent = fs.readFileSync(indexFilePath, "utf-8");
  const exportLines = indexContent
    .split("\n")
    .filter((line) => line.startsWith("export"));

  // Получаем список файлов в директории (кроме index.ts)
  const dir = path.dirname(indexFilePath);
  const files = fs
    .readdirSync(dir)
    .filter((file) => file !== "index.ts" && file.endsWith(".ts"));

  // Проверяем, что каждый файл имеет соответствующий экспорт
  files.forEach((file) => {
    if (file.includes(".test")) {
      return;
    }
    const moduleName = path.basename(file, ".ts");
    const hasExport = exportLines.some(
      (line) =>
        line.includes(`from './${moduleName}'`) ||
        line.includes(`from "./${moduleName}"`),
    );

    if (!hasExport) {
      console.error(`!!! - Missing re-export for module: ${moduleName}`);
      process.exit(1);
    }
  });
}

// Использование:
checkReexports("./src/components/index.ts");
checkReexports("./src/types/index.ts");
checkReexports("./src/helpers/index.ts");
