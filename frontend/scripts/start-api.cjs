const { spawn, spawnSync } = require("child_process");
const path = require("path");

// Try the usual Python command names for this operating system
const candidates =
  process.platform === "win32" ? ["py", "python", "python3"] : ["python3", "python"];

const python = candidates.find((cmd) => {
  const r = spawnSync(cmd, ["--version"]);
  return !r.error && r.status === 0;
});

if (!python) {
  console.error("Python was not found. Install Python 3 from python.org and try again.");
  process.exit(1);
}

const backendDir = path.join(__dirname, "..", "..", "backend");

const child = spawn(
  python,
  ["-m", "uvicorn", "main:app", "--reload", "--port", "8000"],
  { cwd: backendDir, stdio: "inherit" }
);

child.on("exit", (code) => process.exit(code ?? 0));
