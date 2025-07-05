const { execSync } = require("child_process");

function getGitBranch() {
  const res = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" });
  return res.trim();
}

module.exports = {
  types: [
    {
      value: "fix",
      name: "fix: Bug fixes",
    },
    {
      value: "feat",
      name: "feat: Adding new functionality",
    },
    {
      value: "refactor",
      name: "refactor: Code edits without fixing bugs or adding new features",
    },
    {
      value: "build",
      name: "build: Building a project or changing external dependencies",
    },
    {
      value: "docs",
      name: "docs: Documentation Update",
    },
    {
      value: "docs",
      name: "docs: Edits to the project documentation or individual parts of the project",
    },
    {
      value: "test",
      name: "test: Adding tests",
    },
  ],
  scopes: [
    {
      name: getGitBranch(),
    },
  ],

  allowCustomScopes: true,

  allowBreakingChanges: false,

  subjectLimit: 255,
};
